import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (arg.startsWith('--')) {
    const key = arg.slice(2);
    const next = process.argv[i + 1];
    if (next && !next.startsWith('--')) {
      args.set(key, next);
      i += 1;
    } else {
      args.set(key, true);
    }
  }
}

const baseRev = args.get('base') || 'HEAD';
const outDir = path.resolve(root, args.get('out') || `output/ab-test-${new Date().toISOString().slice(0, 10)}`);

function readWorktree(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readGit(rev, relativePath) {
  const result = spawnSync('git', ['show', `${rev}:${relativePath}`], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`git show failed for ${rev}:${relativePath}\n${result.stderr || result.stdout}`);
  }
  return result.stdout;
}

function evalCore(source) {
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: 'core-prompt.js' });
  return context.window.HB_CORE_PROMPT;
}

function sliceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start === -1) throw new Error(`Missing start marker: ${startMarker}`);
  const end = source.indexOf(endMarker, start);
  if (end === -1) throw new Error(`Missing end marker: ${endMarker}`);
  return source.slice(start, end);
}

function evalDataSegment({ source, core, page, startMarker, endMarker, exportExpression }) {
  const segment = sliceBetween(source, startMarker, endMarker);
  const context = {
    window: { HB_CORE_PROMPT: { page: { [page]: core.page[page] } } },
  };
  vm.runInNewContext(`${segment}\n;globalThis.__previewData = ${exportExpression};`, context, {
    filename: `${page}-data.js`,
  });
  return context.__previewData;
}

function coreLengths(core) {
  const rows = Object.entries(core.blocks).map(([key, value]) => ({
    key,
    length: value.length,
  }));
  return {
    rows,
    total: rows.reduce((sum, row) => sum + row.length, 0),
  };
}

function generateTravel(core, data, mediaKey) {
  const selection = {
    composition: 'C',
    styleKey: 'jp_gravure',
    ratioKey: '3:4',
    cameraKey: 'neutral',
    lightingKey: 'scene_natural',
    motionKey: 'still',
    mediaKey,
    theme: '京都清水寺楓葉季',
  };
  const style = data.STYLES[selection.styleKey];
  const styleBlock = `【風格模組｜主風格】\n\n${style.text}\n\n${data.STYLE_SCOPE_NOTE}`;
  const cameraBlock = data.CAMERA_ANGLES[selection.cameraKey];
  const lightingBlock = data.TRAVEL_LIGHTING_STYLES[selection.lightingKey];
  const motionBlock = data.MOTION_LEVELS[selection.motionKey];
  const mediaBlock = data.MEDIA_STYLES[selection.mediaKey];
  const skeletonBlock = data.ILLUSTRATION_MEDIA_KEYS.has(selection.mediaKey)
    ? (core.page.travel.illustrationSkeleton || core.page.travel.skeleton)
    : core.page.travel.skeleton;
  const costumeBlock = `【服裝邏輯模組｜動態造型系統】\n\n根據主題「${selection.theme}」自動設計服裝層次(Layer1~Layer7)\n服裝層數依主題自動增減,通常2~5層,特殊主題可擴展至7層\n優先真人旅拍感\n優先${style.label}的視覺語言\n服裝符合主題世界觀與材質質感\nPremium Fabric / Fine Embroidery / Rich Material Detail\n\n避免過度Cosplay化\n避免遊戲角色盔甲化\n避免動漫角色化`;
  const themeBlock = `【主題】\n\n${selection.theme}`;
  const ratioBlock = `【輸出比例】\n\n${data.RATIOS[selection.ratioKey]}`;
  const sections = [
    core.page.travel.identity,
    skeletonBlock,
    core.page.travel.lighting,
    core.page.travel.pose,
    core.page.travel.photographer,
    ...(lightingBlock ? [lightingBlock] : []),
    ...(cameraBlock ? [cameraBlock] : []),
    ...(motionBlock ? [motionBlock] : []),
    data.COMPOSITION[selection.composition],
    styleBlock,
    mediaBlock,
    themeBlock,
    costumeBlock,
    core.page.travel.cleanframe,
    core.page.travel.output,
    ratioBlock,
  ];
  return sections.join('\n\n⸻\n\n');
}

function generateMagazine(core, data, mediaKey) {
  const selection = {
    styleKey: 'japanese_photo_magazine',
    bodyShapeKey: 'original',
    bgKey: 'gallery_white_wall',
    poseKey: 'auto',
    framingKey: 'half_body',
    cameraKey: 'neutral',
    motionKey: 'still',
    ratioKey: '3:4',
    mediaKey,
    makeupKeys: ['natural_highend'],
    skinTextureKey: 'natural_real',
    jewelryKeys: ['none'],
    expressionKey: 'lower_gaze',
    lightingKey: 'window_soft',
    theme: '京都清水寺楓葉季',
  };
  const style = data.STYLES[selection.styleKey];
  const isInkFlower = selection.styleKey === 'ink_flower';
  const styleBlock = isInkFlower
    ? `【封面風格｜${style.label}】\n\n${style.text}`
    : `【封面風格｜${style.label}】\n\n${style.text}\n\n風格僅套用於光線、構圖、氛圍、服裝質感\n不可覆寫或調整五官、臉型、臉部特徵`;
  const bgBlock = isInkFlower
    ? `【背景設定】\n\nPure White Background\nClean Empty Background\nNo Scene No Environment`
    : `【背景設定】\n\n${data.BACKGROUNDS[selection.bgKey]}`;
  const bodyShapeBlock = data.BODY_SHAPES[selection.bodyShapeKey];
  const poseText = isInkFlower ? null : data.POSES[selection.poseKey];
  const poseBlock = poseText ? `【姿態模組】\n\n${poseText}` : null;
  const framingBlock = data.FRAMING_RATIOS[selection.framingKey];
  const cameraBlock = data.CAMERAS[selection.cameraKey];
  const motionBlock = data.MOTION_LEVELS[selection.motionKey];
  const costumeBlock = isInkFlower
    ? `【服裝邏輯模組｜花墨染專屬】\n\n服裝依主題「${selection.theme}」或AI自動決定\n薄紗半透明材質為主\nSheer Translucent Fabric\nOrganza Or Thin Silk Texture\n服裝與花卉自然融合`
    : `【服裝邏輯模組｜動態造型系統】\n\n根據主題「${selection.theme}」自動設計服裝層次\n服裝層數依主題自動增減,通常2~5層\n優先封面大片感\n優先${style.label}的視覺語言\n服裝符合主題世界觀與材質質感\nPremium Fabric / Luxury Material Detail\n\n避免過度Cosplay化\n避免遊戲角色盔甲化`;
  const makeupBlock = `【妝容】\n\n${selection.makeupKeys.map((key) => data.DETAIL_BLOCKS.makeup[key]).filter(Boolean).join('\n\n')}`;
  const skinTextureBlock = `【膚質質感】\n\n${data.DETAIL_BLOCKS.skinTexture[selection.skinTextureKey]}`;
  const jewelryBlock = `【珠寶配飾】\n\n${selection.jewelryKeys.map((key) => data.DETAIL_BLOCKS.jewelry[key]).filter(Boolean).join('\n\n')}`;
  const expressionBlock = `【眼神表情】\n\n${data.DETAIL_BLOCKS.expression[selection.expressionKey]}`;
  const lightingToneBlock = `【光線類型】\n\n${data.DETAIL_BLOCKS.lighting[selection.lightingKey]}`;
  const mediaBlock = data.MEDIA_STYLES[selection.mediaKey];
  const isIllustrationMedia = data.MAGAZINE_ILLUSTRATION_MEDIA_KEYS.has(selection.mediaKey);
  const skeletonBlock = isIllustrationMedia
    ? (core.page.magazine.illustrationSkeleton || core.page.magazine.skeleton)
    : core.page.magazine.skeleton;
  const resolvedSkinTextureBlock = isIllustrationMedia
    ? data.MAGAZINE_ILLUSTRATION_SKIN_TEXTURE
    : skinTextureBlock;
  const themeBlock = `【主題 / 服裝方向】\n\n${selection.theme}`;
  const ratioBlock = `【輸出比例】\n\n${data.RATIOS[selection.ratioKey]}`;
  const sections = [
    core.page.magazine.identity,
    skeletonBlock,
    core.page.magazine.pose,
    bodyShapeBlock,
    data.MAGAZINE_LIGHTING_CONSISTENCY,
    data.MAGAZINE_SUBJECT_INTEGRATION,
    data.MAGAZINE_FACE_FILL,
    core.page.magazine.photographer,
    ...(poseBlock ? [poseBlock] : []),
    framingBlock,
    ...(cameraBlock ? [cameraBlock] : []),
    ...(motionBlock ? [motionBlock] : []),
    data.COVER_COMPOSITION,
    styleBlock,
    mediaBlock,
    bgBlock,
    themeBlock,
    costumeBlock,
    makeupBlock,
    resolvedSkinTextureBlock,
    jewelryBlock,
    expressionBlock,
    lightingToneBlock,
    data.COVER_LIGHTING,
    core.page.magazine.cleanframe,
    core.page.magazine.output,
    ratioBlock,
  ];
  return sections.join('\n\n⸻\n\n');
}

function generateFantasy(core, data) {
  const selection = {
    bodyShape: 'original',
    material: 'paperSculpture',
    garment: 'dress',
    background: 'plainStudio',
    lighting: 'soft',
    composition: 'centered luxury commercial portrait composition, clean premium poster layout, subject as the hero visual',
    framing: 'threeQuarter',
    intensity: 'balanced material effects, elegant and luxurious',
    pose: 'center_still',
    style: 'beautyCampaign',
    camera: 'eyeLevelCover',
    ratio: 'vertical45',
    customMaterial: '',
    customGarment: '',
    colorNote: '',
    extraNote: '',
  };
  const material = data.materialData[selection.material];
  const materialText = material.prompt;
  const materialPalette = material.palette;
  const isIllustrationMaterial = data.FANTASY_ILLUSTRATION_MATERIAL_KEYS?.has(selection.material)
    || /illustration|watercolor|anime|manga|oil painting|paper|ink/i.test(selection.customMaterial);
  const resolvedAnatomyGuard = isIllustrationMaterial
    ? (core.page.fantasy.illustrationSkeleton || data.anatomyGuard)
    : data.anatomyGuard;
  const garmentText = data.garmentData[selection.garment];
  const background = data.backgroundData[selection.background];
  const lighting = data.lightingData[selection.lighting];
  const bodyShape = data.BODY_SHAPES[selection.bodyShape];
  const framing = data.framingData[selection.framing];
  const poseText = data.poseData[selection.pose];
  const prompt = [
    data.identityGuard + ',',
    'Same adult woman from the reference photo, realistic commercial portrait subject, reference photo used for identity only,',
    resolvedAnatomyGuard + ',',
    data.poseNaturalityGuard + ',',
    bodyShape + ',',
    data.lightingConsistencyGuard + ',',
    selection.composition + ',',
    data.compositionGuard + ',',
    'appearance form: ' + garmentText + ',',
    'theme material and art system: ' + materialText + ',',
    'use the selected material system to form the clothing, ornaments, background accents and advertising visual language,',
    selection.intensity + ',',
    'selected material appears as controlled clothing details, ornaments, particles and background accents without overpowering facial identity,',
    data.styleData[selection.style] + ',',
    poseText ? poseText + ',' : '',
    framing + ',',
    data.cameraData[selection.camera] + ',',
    'lighting design: ' + lighting + ',',
    'background design: ' + background + ',',
    data.ratioData[selection.ratio] + ',',
    core.page.fantasy.output ? core.page.fantasy.output + ',' : '',
    'hyper realistic, ultra detailed, premium advertising finish,',
    'color palette: ' + materialPalette + ',',
    core.page.fantasy.negativePrompt ? core.page.fantasy.negativePrompt + ',' : '',
    'no random text, no watermark, no logo artifacts, no extra fingers, no deformed body, no distorted face',
  ];
  return prompt.filter(Boolean).join('\n');
}

function generateXianxia(core, data) {
  const selection = {
    bodyShape: 'original',
    material: 'immortalSword',
    garment: 'xianQipaoGauze',
    background: 'immortalMountainPeak',
    lighting: 'soft',
    composition: 'centered luxury commercial portrait composition, clean premium poster layout, subject as the hero visual',
    framing: 'threeQuarter',
    intensity: 'balanced material effects, elegant and luxurious',
    pose: 'sword_stance_still',
    style: 'beautyCampaign',
    camera: 'eyeLevelCover',
    ratio: 'vertical45',
    customMaterial: '',
    customGarment: '',
    chestDetail: 'archCutout',
    waistSideDetail: 'none',
    shoulderDetail: 'capeShoulderLine',
    customChestDetail: '',
    customWaistSideDetail: '',
    customShoulderDetail: '',
    colorNote: '',
    extraNote: '',
  };
  const material = data.materialData[selection.material];
  const materialText = material.prompt;
  const materialPalette = material.palette;
  const isIllustrationMaterial = data.XIANXIA_ILLUSTRATION_MATERIAL_KEYS?.has(selection.material)
    || /illustration|watercolor|anime|manga|oil painting|paper|ink/i.test(selection.customMaterial);
  const resolvedAnatomyGuard = isIllustrationMaterial
    ? (core.page.xianxia.illustrationSkeleton || data.anatomyGuard)
    : data.anatomyGuard;
  const garmentText = data.garmentData[selection.garment];
  const chestDetailText = selection.customChestDetail ? `custom chest surface detail only: ${selection.customChestDetail}` : data.chestDetailData[selection.chestDetail];
  const waistSideDetailText = selection.customWaistSideDetail ? `custom waist side surface detail only: ${selection.customWaistSideDetail}` : data.waistSideDetailData[selection.waistSideDetail];
  const shoulderDetailText = selection.customShoulderDetail ? `custom shoulder surface detail only: ${selection.customShoulderDetail}` : data.shoulderDetailData[selection.shoulderDetail];
  const garmentDetailParts = [chestDetailText, waistSideDetailText, shoulderDetailText].filter(Boolean);
  const garmentDetailText = garmentDetailParts.length
    ? 'garment surface detail: ' + garmentDetailParts.join(', ') + ' — structural surface accents only, the garment silhouette from the appearance form above stays unchanged,'
    : '';
  const background = data.backgroundData[selection.background];
  const lighting = data.lightingData[selection.lighting];
  const bodyShape = data.BODY_SHAPES[selection.bodyShape];
  const framing = data.framingData[selection.framing];
  const poseText = data.poseData[selection.pose];
  const prompt = [
    data.identityGuard + ',',
    'Same adult woman from the reference photo, realistic commercial portrait subject, reference photo used for identity only,',
    resolvedAnatomyGuard + ',',
    data.poseNaturalityGuard + ',',
    bodyShape + ',',
    data.lightingConsistencyGuard + ',',
    selection.composition + ',',
    data.compositionGuard + ',',
    'appearance form: ' + garmentText + ',',
    garmentDetailText,
    'theme material and art system: ' + materialText + ',',
    'use the selected material system to form the clothing, ornaments, background accents and advertising visual language,',
    selection.intensity + ',',
    'selected material appears as controlled clothing details, ornaments, particles and background accents without overpowering facial identity,',
    data.styleData[selection.style] + ',',
    poseText ? poseText + ',' : '',
    framing + ',',
    data.cameraData[selection.camera] + ',',
    'lighting design: ' + lighting + ',',
    'background design: ' + background + ',',
    data.ratioData[selection.ratio] + ',',
    core.page.xianxia.output ? core.page.xianxia.output + ',' : '',
    'hyper realistic, ultra detailed, premium advertising finish,',
    'color palette: ' + materialPalette + ',',
    core.page.xianxia.negativePrompt ? core.page.xianxia.negativePrompt + ',' : '',
    'no random text, no watermark, no logo artifacts, no extra fingers, no deformed body, no distorted face',
  ];
  return prompt.filter(Boolean).join('\n');
}

function generateAnime(core, data) {
  const selection = {
    bodyShape: 'original',
    material: 'glowingMagicCircle',
    garment: 'magicalGirlOutfit',
    background: 'radiantMagicCircleBurst',
    lighting: 'prismaticColor',
    composition: 'subject surrounded by selected material environment, material wraps around foreground and background, immersive fantasy advertisement layout',
    framing: 'fullBody',
    intensity: 'massive explosive material splash, high speed frozen motion',
    pose: 'transformationSequencePose',
    style: 'moeCute',
    camera: 'lowAngleHero',
    ratio: 'vertical916',
    customMaterial: '',
    customGarment: '',
    chestDetail: 'magicCircleCutout',
    waistSideDetail: 'none',
    shoulderDetail: 'ribbonBow',
    customChestDetail: '',
    customWaistSideDetail: '',
    customShoulderDetail: '',
    colorNote: '',
    extraNote: '',
  };
  const material = data.materialData[selection.material];
  const materialText = material.prompt;
  const materialPalette = material.palette;
  const garmentText = data.garmentData[selection.garment];
  const chestDetailText = selection.customChestDetail ? `custom chest surface detail only: ${selection.customChestDetail}` : data.chestDetailData[selection.chestDetail];
  const waistSideDetailText = selection.customWaistSideDetail ? `custom waist side surface detail only: ${selection.customWaistSideDetail}` : data.waistSideDetailData[selection.waistSideDetail];
  const shoulderDetailText = selection.customShoulderDetail ? `custom shoulder surface detail only: ${selection.customShoulderDetail}` : data.shoulderDetailData[selection.shoulderDetail];
  const garmentDetailParts = [chestDetailText, waistSideDetailText, shoulderDetailText].filter(Boolean);
  const garmentDetailText = garmentDetailParts.length
    ? 'garment surface detail: ' + garmentDetailParts.join(', ') + ' — structural surface accents only, the garment silhouette from the appearance form above stays unchanged,'
    : '';
  const background = data.backgroundData[selection.background];
  const lighting = data.lightingData[selection.lighting];
  const bodyShape = data.BODY_SHAPES[selection.bodyShape];
  const framing = data.framingData[selection.framing];
  const poseText = data.poseData[selection.pose];
  const prompt = [
    data.identityGuard + ',',
    'Same adult woman from the reference photo, realistic commercial portrait subject, reference photo used for identity only,',
    data.anatomyGuard + ',',
    data.poseNaturalityGuard + ',',
    bodyShape + ',',
    data.lightingConsistencyGuard + ',',
    selection.composition + ',',
    data.compositionGuard + ',',
    'appearance form: ' + garmentText + ',',
    garmentDetailText,
    'theme material and art system: ' + materialText + ',',
    'use the selected material system to form the clothing, ornaments, background accents and advertising visual language,',
    selection.intensity + ',',
    'selected material appears as controlled clothing details, ornaments, particles and background accents without overpowering facial identity,',
    data.styleData[selection.style] + ',',
    poseText ? poseText + ',' : '',
    framing + ',',
    data.cameraData[selection.camera] + ',',
    'lighting design: ' + lighting + ',',
    'background design: ' + background + ',',
    data.ratioData[selection.ratio] + ',',
    core.page.anime.output ? core.page.anime.output + ',' : '',
    'hyper realistic, ultra detailed, premium advertising finish,',
    'color palette: ' + materialPalette + ',',
    core.page.anime.negativePrompt ? core.page.anime.negativePrompt + ',' : '',
    'no random text, no watermark, no logo artifacts, no extra fingers, no deformed body, no distorted face',
  ];
  return prompt.filter(Boolean).join('\n');
}

function generateFlowerFairy(core, data) {
  const selection = {
    bodyShape: 'original',
    material: 'crimsonRosePetals',
    garment: 'roseCrimsonGown',
    background: 'roseGardenTwilight',
    lighting: 'soft',
    composition: 'centered commercial key visual, subject placed in the middle of the frame, balanced advertising layout',
    framing: 'threeQuarter',
    intensity: 'balanced material effects, elegant and luxurious',
    pose: 'hold_flower',
    style: 'luxury',
    camera: 'eyeLevelCover',
    ratio: 'vertical45',
    wings: 'sheerFairyWings',
    butterflies: 'fewButterflies',
    customMaterial: '',
    customGarment: '',
    chestDetail: 'petalCutout',
    waistSideDetail: 'none',
    shoulderDetail: 'petalCapelet',
    customChestDetail: '',
    customWaistSideDetail: '',
    customShoulderDetail: '',
    colorNote: '',
    extraNote: '',
  };
  const material = data.materialData[selection.material];
  const materialText = material.prompt;
  const materialPalette = material.palette;
  const garmentText = data.garmentData[selection.garment];
  const chestDetailText = selection.customChestDetail ? `custom chest surface detail only: ${selection.customChestDetail}` : data.chestDetailData[selection.chestDetail];
  const waistSideDetailText = selection.customWaistSideDetail ? `custom waist side surface detail only: ${selection.customWaistSideDetail}` : data.waistSideDetailData[selection.waistSideDetail];
  const shoulderDetailText = selection.customShoulderDetail ? `custom shoulder surface detail only: ${selection.customShoulderDetail}` : data.shoulderDetailData[selection.shoulderDetail];
  const garmentDetailParts = [chestDetailText, waistSideDetailText, shoulderDetailText].filter(Boolean);
  const garmentDetailText = garmentDetailParts.length
    ? 'garment surface detail: ' + garmentDetailParts.join(', ') + ' — structural surface accents only, the garment silhouette from the appearance form above stays unchanged,'
    : '';
  const background = data.backgroundData[selection.background];
  const lighting = data.lightingData[selection.lighting];
  const bodyShape = data.BODY_SHAPES[selection.bodyShape];
  const framing = data.framingData[selection.framing];
  const poseText = data.poseData[selection.pose];
  const wingsText = data.wingsData[selection.wings];
  const butterfliesText = data.butterfliesData[selection.butterflies];
  const prompt = [
    data.identityGuard + ',',
    'Same adult woman from the reference photo, realistic commercial portrait subject, reference photo used for identity only,',
    data.anatomyGuard + ',',
    data.poseNaturalityGuard + ',',
    bodyShape + ',',
    data.lightingConsistencyGuard + ',',
    selection.composition + ',',
    data.compositionGuard + ',',
    'appearance form: ' + garmentText + ',',
    garmentDetailText,
    'theme material and art system: ' + materialText + ',',
    'use the selected material system to form the clothing, ornaments, background accents and advertising visual language,',
    wingsText ? wingsText + ',' : '',
    butterfliesText ? butterfliesText + ',' : '',
    (wingsText || butterfliesText) ? 'wings and butterflies stay clear of the face at all times, never overlapping or obscuring facial identity,' : '',
    selection.intensity + ',',
    'selected material appears as controlled clothing details, ornaments, particles and background accents without overpowering facial identity,',
    data.styleData[selection.style] + ',',
    poseText ? poseText + ',' : '',
    framing + ',',
    data.cameraData[selection.camera] + ',',
    'lighting design: ' + lighting + ',',
    'background design: ' + background + ',',
    data.ratioData[selection.ratio] + ',',
    core.page.flowerFairy.output ? core.page.flowerFairy.output + ',' : '',
    'hyper realistic, ultra detailed, premium advertising finish,',
    'color palette: ' + materialPalette + ',',
    core.page.flowerFairy.negativePrompt ? core.page.flowerFairy.negativePrompt + ',' : '',
    'no random text, no watermark, no logo artifacts, no extra fingers, no deformed body, no distorted face',
  ];
  return prompt.filter(Boolean).join('\n');
}

function generateIsekai(core, data) {
  const selection = {
    bodyShape: 'original',
    material: 'holyRadianceAura',
    garment: 'heroTravelerTunic',
    background: 'fantasyMarketStreet',
    lighting: 'soft',
    composition: 'centered commercial key visual, subject placed in the middle of the frame, balanced advertising layout',
    framing: 'threeQuarter',
    intensity: 'balanced material effects, elegant and luxurious',
    pose: 'sword_sheathe_calm',
    style: 'lightNovelAd',
    camera: 'eyeLevelCover',
    ratio: 'vertical45',
    customMaterial: '',
    customGarment: '',
    chestDetail: 'gemInlay',
    waistSideDetail: 'none',
    shoulderDetail: 'capeletDrape',
    customChestDetail: '',
    customWaistSideDetail: '',
    customShoulderDetail: '',
    colorNote: '',
    extraNote: '',
  };
  const material = data.materialData[selection.material];
  const materialText = material.prompt;
  const materialPalette = material.palette;
  const garmentText = data.garmentData[selection.garment];
  const chestDetailText = selection.customChestDetail ? `custom chest surface detail only: ${selection.customChestDetail}` : data.chestDetailData[selection.chestDetail];
  const waistSideDetailText = selection.customWaistSideDetail ? `custom waist side surface detail only: ${selection.customWaistSideDetail}` : data.waistSideDetailData[selection.waistSideDetail];
  const shoulderDetailText = selection.customShoulderDetail ? `custom shoulder surface detail only: ${selection.customShoulderDetail}` : data.shoulderDetailData[selection.shoulderDetail];
  const garmentDetailParts = [chestDetailText, waistSideDetailText, shoulderDetailText].filter(Boolean);
  const garmentDetailText = garmentDetailParts.length
    ? 'garment surface detail: ' + garmentDetailParts.join(', ') + ' — structural surface accents only, the garment silhouette from the appearance form above stays unchanged,'
    : '';
  const background = data.backgroundData[selection.background];
  const lighting = data.lightingData[selection.lighting];
  const bodyShape = data.BODY_SHAPES[selection.bodyShape];
  const framing = data.framingData[selection.framing];
  const poseText = data.poseData[selection.pose];
  const prompt = [
    data.identityGuard + ',',
    'Same adult woman from the reference photo, realistic commercial portrait subject, reference photo used for identity only,',
    data.anatomyGuard + ',',
    data.poseNaturalityGuard + ',',
    bodyShape + ',',
    data.lightingConsistencyGuard + ',',
    selection.composition + ',',
    data.compositionGuard + ',',
    'appearance form: ' + garmentText + ',',
    garmentDetailText,
    'theme material and art system: ' + materialText + ',',
    'use the selected material system to form the clothing, ornaments, background accents and advertising visual language,',
    selection.intensity + ',',
    'selected material appears as controlled clothing details, ornaments, particles and background accents without overpowering facial identity,',
    data.styleData[selection.style] + ',',
    poseText ? poseText + ',' : '',
    framing + ',',
    data.cameraData[selection.camera] + ',',
    'lighting design: ' + lighting + ',',
    'background design: ' + background + ',',
    data.ratioData[selection.ratio] + ',',
    core.page.isekai.output ? core.page.isekai.output + ',' : '',
    'hyper realistic, ultra detailed, premium advertising finish,',
    'color palette: ' + materialPalette + ',',
    core.page.isekai.negativePrompt ? core.page.isekai.negativePrompt + ',' : '',
    'no random text, no watermark, no logo artifacts, no extra fingers, no deformed body, no distorted face',
  ];
  return prompt.filter(Boolean).join('\n');
}

function generateFloralSweet(core, data) {
  const selection = {
    bodyShape: 'original',
    material: 'handHeldBouquet',
    garment: 'floralSundress',
    background: 'vintageFlowerShopInterior',
    lighting: 'soft',
    composition: 'centered commercial key visual, subject placed in the middle of the frame, balanced advertising layout',
    framing: 'threeQuarter',
    intensity: 'balanced material effects, elegant and luxurious',
    pose: 'floral_bouquet_hug',
    style: 'sweetCampaign',
    camera: 'eyeLevelCover',
    ratio: 'vertical45',
    customMaterial: '',
    customGarment: '',
    chestDetail: 'ribbonBow',
    waistSideDetail: 'none',
    shoulderDetail: 'frillTrim',
    customChestDetail: '',
    customWaistSideDetail: '',
    customShoulderDetail: '',
    colorNote: '',
    extraNote: '',
  };
  const material = data.materialData[selection.material];
  const materialText = material.prompt;
  const materialPalette = material.palette;
  const garmentText = data.garmentData[selection.garment];
  const chestDetailText = selection.customChestDetail ? `custom chest surface detail only: ${selection.customChestDetail}` : data.chestDetailData[selection.chestDetail];
  const waistSideDetailText = selection.customWaistSideDetail ? `custom waist side surface detail only: ${selection.customWaistSideDetail}` : data.waistSideDetailData[selection.waistSideDetail];
  const shoulderDetailText = selection.customShoulderDetail ? `custom shoulder surface detail only: ${selection.customShoulderDetail}` : data.shoulderDetailData[selection.shoulderDetail];
  const garmentDetailParts = [chestDetailText, waistSideDetailText, shoulderDetailText].filter(Boolean);
  const garmentDetailText = garmentDetailParts.length
    ? 'garment surface detail: ' + garmentDetailParts.join(', ') + ' — structural surface accents only, the garment silhouette from the appearance form above stays unchanged,'
    : '';
  const background = data.backgroundData[selection.background];
  const lighting = data.lightingData[selection.lighting];
  const bodyShape = data.BODY_SHAPES[selection.bodyShape];
  const framing = data.framingData[selection.framing];
  const poseText = data.poseData[selection.pose];
  const prompt = [
    data.identityGuard + ',',
    'Same adult woman from the reference photo, realistic commercial portrait subject, reference photo used for identity only,',
    data.anatomyGuard + ',',
    data.poseNaturalityGuard + ',',
    bodyShape + ',',
    data.lightingConsistencyGuard + ',',
    selection.composition + ',',
    data.compositionGuard + ',',
    'appearance form: ' + garmentText + ',',
    garmentDetailText,
    'theme material and art system: ' + materialText + ',',
    'use the selected material system to form the clothing, ornaments, background accents and advertising visual language,',
    selection.intensity + ',',
    'selected material appears as controlled clothing details, ornaments, particles and background accents without overpowering facial identity,',
    data.styleData[selection.style] + ',',
    poseText ? poseText + ',' : '',
    framing + ',',
    data.cameraData[selection.camera] + ',',
    'lighting design: ' + lighting + ',',
    'background design: ' + background + ',',
    data.ratioData[selection.ratio] + ',',
    core.page.floralSweet.output ? core.page.floralSweet.output + ',' : '',
    'hyper realistic, ultra detailed, premium advertising finish,',
    'color palette: ' + materialPalette + ',',
    core.page.floralSweet.negativePrompt ? core.page.floralSweet.negativePrompt + ',' : '',
    'no random text, no watermark, no logo artifacts, no extra fingers, no deformed body, no distorted face',
  ];
  return prompt.filter(Boolean).join('\n');
}

function generateGalaSocialite(core, data) {
  const selection = {
    bodyShape: 'original',
    material: 'diamondNecklaceAccent',
    garment: 'silkColumnGown',
    background: 'redCarpetEntrance',
    lighting: 'jewelrySparkle',
    composition: 'centered commercial key visual, subject placed in the middle of the frame, balanced advertising layout',
    framing: 'threeQuarter',
    intensity: 'balanced material effects, elegant and luxurious',
    pose: 'center_still',
    style: 'galaCampaign',
    camera: 'eyeLevelCover',
    ratio: 'vertical45',
    customMaterial: '',
    customGarment: '',
    chestDetail: 'gemInlay',
    waistSideDetail: 'none',
    shoulderDetail: 'beadedTrim',
    customChestDetail: '',
    customWaistSideDetail: '',
    customShoulderDetail: '',
    colorNote: '',
    extraNote: '',
  };
  const material = data.materialData[selection.material];
  const materialText = material.prompt;
  const materialPalette = material.palette;
  const garmentText = data.garmentData[selection.garment];
  const chestDetailText = selection.customChestDetail ? `custom chest surface detail only: ${selection.customChestDetail}` : data.chestDetailData[selection.chestDetail];
  const waistSideDetailText = selection.customWaistSideDetail ? `custom waist side surface detail only: ${selection.customWaistSideDetail}` : data.waistSideDetailData[selection.waistSideDetail];
  const shoulderDetailText = selection.customShoulderDetail ? `custom shoulder surface detail only: ${selection.customShoulderDetail}` : data.shoulderDetailData[selection.shoulderDetail];
  const garmentDetailParts = [chestDetailText, waistSideDetailText, shoulderDetailText].filter(Boolean);
  const garmentDetailText = garmentDetailParts.length
    ? 'garment surface detail: ' + garmentDetailParts.join(', ') + ' — structural surface accents only, the garment silhouette from the appearance form above stays unchanged,'
    : '';
  const background = data.backgroundData[selection.background];
  const lighting = data.lightingData[selection.lighting];
  const bodyShape = data.BODY_SHAPES[selection.bodyShape];
  const framing = data.framingData[selection.framing];
  const poseText = data.poseData[selection.pose];
  const prompt = [
    data.identityGuard + ',',
    'Same adult woman from the reference photo, realistic commercial portrait subject, reference photo used for identity only,',
    data.anatomyGuard + ',',
    data.poseNaturalityGuard + ',',
    bodyShape + ',',
    data.lightingConsistencyGuard + ',',
    selection.composition + ',',
    data.compositionGuard + ',',
    'appearance form: ' + garmentText + ',',
    garmentDetailText,
    'theme material and art system: ' + materialText + ',',
    'use the selected material system to form the clothing, ornaments, background accents and advertising visual language,',
    selection.intensity + ',',
    'selected material appears as controlled clothing details, ornaments, particles and background accents without overpowering facial identity,',
    data.styleData[selection.style] + ',',
    poseText ? poseText + ',' : '',
    framing + ',',
    data.cameraData[selection.camera] + ',',
    'lighting design: ' + lighting + ',',
    'background design: ' + background + ',',
    data.ratioData[selection.ratio] + ',',
    core.page.galaSocialite.output ? core.page.galaSocialite.output + ',' : '',
    'hyper realistic, ultra detailed, premium advertising finish,',
    'color palette: ' + materialPalette + ',',
    core.page.galaSocialite.negativePrompt ? core.page.galaSocialite.negativePrompt + ',' : '',
    'no random text, no watermark, no logo artifacts, no extra fingers, no deformed body, no distorted face',
  ];
  return prompt.filter(Boolean).join('\n');
}

function generateAncientGoddess(core, data) {
  const selection = {
    bodyShape: 'original',
    material: 'divineHaloGlow',
    garment: 'goldLaurelArmorGown',
    background: 'marbleTempleColumnHall',
    lighting: 'halo',
    composition: 'centered commercial key visual, subject placed in the middle of the frame, balanced advertising layout',
    framing: 'threeQuarter',
    intensity: 'balanced material effects, elegant and luxurious',
    pose: 'offering_gesture_goddess',
    style: 'mythologyEpicPoster',
    camera: 'eyeLevelCover',
    ratio: 'vertical45',
    customMaterial: '',
    customGarment: '',
    chestDetail: 'gemInlay',
    waistSideDetail: 'none',
    shoulderDetail: 'beadedTrim',
    customChestDetail: '',
    customWaistSideDetail: '',
    customShoulderDetail: '',
    colorNote: '',
    extraNote: '',
  };
  const material = data.materialData[selection.material];
  const materialText = material.prompt;
  const materialPalette = material.palette;
  const garmentText = data.garmentData[selection.garment];
  const chestDetailText = selection.customChestDetail ? `custom chest surface detail only: ${selection.customChestDetail}` : data.chestDetailData[selection.chestDetail];
  const waistSideDetailText = selection.customWaistSideDetail ? `custom waist side surface detail only: ${selection.customWaistSideDetail}` : data.waistSideDetailData[selection.waistSideDetail];
  const shoulderDetailText = selection.customShoulderDetail ? `custom shoulder surface detail only: ${selection.customShoulderDetail}` : data.shoulderDetailData[selection.shoulderDetail];
  const garmentDetailParts = [chestDetailText, waistSideDetailText, shoulderDetailText].filter(Boolean);
  const garmentDetailText = garmentDetailParts.length
    ? 'garment surface detail: ' + garmentDetailParts.join(', ') + ' — structural surface accents only, the garment silhouette from the appearance form above stays unchanged,'
    : '';
  const background = data.backgroundData[selection.background];
  const lighting = data.lightingData[selection.lighting];
  const bodyShape = data.BODY_SHAPES[selection.bodyShape];
  const framing = data.framingData[selection.framing];
  const poseText = data.poseData[selection.pose];
  const prompt = [
    data.identityGuard + ',',
    'Same adult woman from the reference photo, realistic commercial portrait subject, reference photo used for identity only,',
    data.anatomyGuard + ',',
    data.poseNaturalityGuard + ',',
    bodyShape + ',',
    data.lightingConsistencyGuard + ',',
    selection.composition + ',',
    data.compositionGuard + ',',
    'appearance form: ' + garmentText + ',',
    garmentDetailText,
    'theme material and art system: ' + materialText + ',',
    'use the selected material system to form the clothing, ornaments, background accents and advertising visual language,',
    selection.intensity + ',',
    'selected material appears as controlled clothing details, ornaments, particles and background accents without overpowering facial identity,',
    data.styleData[selection.style] + ',',
    poseText ? poseText + ',' : '',
    framing + ',',
    data.cameraData[selection.camera] + ',',
    'lighting design: ' + lighting + ',',
    'background design: ' + background + ',',
    data.ratioData[selection.ratio] + ',',
    core.page.ancientGoddess.output ? core.page.ancientGoddess.output + ',' : '',
    'hyper realistic, ultra detailed, premium advertising finish,',
    'color palette: ' + materialPalette + ',',
    core.page.ancientGoddess.negativePrompt ? core.page.ancientGoddess.negativePrompt + ',' : '',
    'no random text, no watermark, no logo artifacts, no extra fingers, no deformed body, no distorted face',
  ];
  return prompt.filter(Boolean).join('\n');
}

function generateEditorial(core, data) {
  const sel = {
    layout: 'classicMagazineCover', typography: 'editorialSerif', graphic: 'barcodeLabel',
    color: 'dominantBlack', imageTreatment: 'originalEditorial', printFinish: 'cleanDigital',
    placement: 'rightFullBody', whitespace: 'balancedWhitespace',
    language: 'bilingualEnglishChinese', ratio: 'magazine23',
    mainTitle: 'MAKIMA', subtitle: 'SPECIAL FEATURE', tagline: "Domination isn't power, it's nature.",
    infoLabels: ['PROFILE', 'PSYCHOLOGY'], extraNote: '',
  };
  const parts = [];
  parts.push(`main title / character name: "${sel.mainTitle}"`);
  parts.push(`subtitle / issue text: "${sel.subtitle}"`);
  parts.push(`tagline / quote line: "${sel.tagline}"`);
  parts.push(`information block headers: ${sel.infoLabels.map((l) => `"${l}"`).join(', ')}`);
  const textContentBlock = 'text content to use: ' + parts.join('; ') + ',';
  const prompt = [
    data.sourceImageLockGuard + ',',
    data.layoutData[sel.layout] + ',',
    data.typographyData[sel.typography] + ',',
    data.placementData[sel.placement] + ',',
    textContentBlock,
    data.languageData[sel.language] + ',',
    data.graphicData[sel.graphic] + ',',
    data.colorData[sel.color] + ',',
    data.imageTreatmentData[sel.imageTreatment] + ',',
    data.printFinishData[sel.printFinish] + ',',
    data.whitespaceData[sel.whitespace] + ',',
    data.ratioData[sel.ratio] + ',',
    data.outputQualityGuard + ',',
    'do not alter the photographed person, outfit, pose, lighting or background in any way — apply editorial graphic design on top only,',
    data.negativeGuard + ',',
    'no random text errors, no watermark artifacts, no distorted or illegible typography,',
    '— Attach your already-generated reference photo together with this text when submitting to the image editing model.',
  ];
  return prompt.filter(Boolean).join('\n');
}

function generateKpopIdol(core, data) {
  const selection = {
    bodyShape: 'original',
    material: 'stageSpotBeamGlow',
    garment: 'crystalStageBodysuit',
    background: 'ledScreenStageBackdrop',
    lighting: 'stage',
    composition: 'centered commercial key visual, subject placed in the middle of the frame, balanced advertising layout',
    framing: 'threeQuarter',
    intensity: 'balanced material effects, elegant and luxurious',
    pose: 'center_still',
    style: 'idolTeaserCampaign',
    camera: 'eyeLevelCover',
    ratio: 'vertical45',
    customMaterial: '',
    customGarment: '',
    chestDetail: 'crystalMesh',
    waistSideDetail: 'none',
    shoulderDetail: 'chainStrap',
    customChestDetail: '',
    customWaistSideDetail: '',
    customShoulderDetail: '',
    colorNote: '',
    extraNote: '',
  };
  const material = data.materialData[selection.material];
  const materialText = material.prompt;
  const materialPalette = material.palette;
  const garmentText = data.garmentData[selection.garment];
  const chestDetailText = selection.customChestDetail ? `custom chest surface detail only: ${selection.customChestDetail}` : data.chestDetailData[selection.chestDetail];
  const waistSideDetailText = selection.customWaistSideDetail ? `custom waist side surface detail only: ${selection.customWaistSideDetail}` : data.waistSideDetailData[selection.waistSideDetail];
  const shoulderDetailText = selection.customShoulderDetail ? `custom shoulder surface detail only: ${selection.customShoulderDetail}` : data.shoulderDetailData[selection.shoulderDetail];
  const garmentDetailParts = [chestDetailText, waistSideDetailText, shoulderDetailText].filter(Boolean);
  const garmentDetailText = garmentDetailParts.length
    ? 'garment surface detail: ' + garmentDetailParts.join(', ') + ' — structural surface accents only, the garment silhouette from the appearance form above stays unchanged,'
    : '';
  const background = data.backgroundData[selection.background];
  const lighting = data.lightingData[selection.lighting];
  const bodyShape = data.BODY_SHAPES[selection.bodyShape];
  const framing = data.framingData[selection.framing];
  const poseText = data.poseData[selection.pose];
  const prompt = [
    data.identityGuard + ',',
    'Same adult woman from the reference photo, realistic commercial portrait subject, reference photo used for identity only,',
    data.anatomyGuard + ',',
    data.poseNaturalityGuard + ',',
    bodyShape + ',',
    data.lightingConsistencyGuard + ',',
    selection.composition + ',',
    data.compositionGuard + ',',
    'appearance form: ' + garmentText + ',',
    garmentDetailText,
    'theme material and art system: ' + materialText + ',',
    'use the selected material system to form the clothing, ornaments, background accents and advertising visual language,',
    selection.intensity + ',',
    'selected material appears as controlled clothing details, ornaments, particles and background accents without overpowering facial identity,',
    data.styleData[selection.style] + ',',
    poseText ? poseText + ',' : '',
    framing + ',',
    data.cameraData[selection.camera] + ',',
    'lighting design: ' + lighting + ',',
    'background design: ' + background + ',',
    data.ratioData[selection.ratio] + ',',
    core.page.kpopIdol.output ? core.page.kpopIdol.output + ',' : '',
    'hyper realistic, ultra detailed, premium advertising finish,',
    'color palette: ' + materialPalette + ',',
    core.page.kpopIdol.negativePrompt ? core.page.kpopIdol.negativePrompt + ',' : '',
    'no random text, no watermark, no logo artifacts, no extra fingers, no deformed body, no distorted face',
  ];
  return prompt.filter(Boolean).join('\n');
}

function generateBattleAcademy(core, data) {
  const selection = {
    bodyShape: 'original',
    school: 'sakuraAcademy',
    upperBody: 'croppedAcademyBlazer',
    waist: 'highWaistTailoring',
    lower: 'pleatedMiniSkirt',
    uniformType: 'standard',
    chestDetail: 'vCutout',
    waistSideDetail: 'none',
    shoulderDetail: 'archCutout',
    accessory: 'swordSheathAccent',
    fantasyDetail: 'bladeEnergyTrailStreak',
    armorMode: 'off',
    emblemFocus: 'chestBadge',
    background: 'schoolRooftopBattle',
    lighting: 'hard',
    composition: 'centered commercial key visual, subject placed in the middle of the frame, balanced advertising layout',
    framing: 'threeQuarter',
    intensity: 'balanced material effects, elegant and luxurious',
    pose: 'sword_draw_pose',
    style: 'tacticalCampaign',
    camera: 'eyeLevelCover',
    ratio: 'vertical45',
    customSchool: '',
    customUpperBody: '',
    customLower: '',
    customChestDetail: '',
    customWaistSideDetail: '',
    customShoulderDetail: '',
    customFantasyDetail: '',
    colorNote: '',
    extraNote: '',
  };
  const schoolInfo = data.schoolData[selection.school];
  const schoolPromptText = selection.customSchool ? `custom school identity only: ${selection.customSchool}; do not include or blend any preset school identity option` : schoolInfo.prompt;
  const schoolColorNote = selection.customSchool ? '' : schoolInfo.colorNote;
  const upperText = data.upperBodyData[selection.upperBody];
  const waistText = data.waistData[selection.waist];
  const lowerText = data.lowerData[selection.lower];
  const uniformTypeText = data.uniformTypeData[selection.uniformType];
  const chestDetailText = selection.customChestDetail ? `custom chest surface detail only: ${selection.customChestDetail}` : data.chestDetailData[selection.chestDetail];
  const waistSideDetailText = selection.customWaistSideDetail ? `custom waist side surface detail only: ${selection.customWaistSideDetail}` : data.waistSideDetailData[selection.waistSideDetail];
  const shoulderDetailText = selection.customShoulderDetail ? `custom shoulder surface detail only: ${selection.customShoulderDetail}` : data.shoulderDetailData[selection.shoulderDetail];
  const garmentDetailParts = [chestDetailText, waistSideDetailText, shoulderDetailText].filter(Boolean);
  const garmentDetailText = garmentDetailParts.length
    ? 'garment surface detail: ' + garmentDetailParts.join(', ') + ' — structural surface accents only, the garment silhouette and archetype from the appearance form above stay unchanged,'
    : '';
  const accessoryText = data.accessoryData[selection.accessory];
  const fantasyDetailText = data.fantasyDetailData[selection.fantasyDetail];
  const armorText = data.armorModeData[selection.armorMode];
  const capeText = data.CAPE_TEXT_OFF;
  const emblemFocusText = selection.emblemFocus && selection.emblemFocus !== 'auto'
    ? data.emblemFocusData[selection.emblemFocus]
    : '';
  const background = data.backgroundData[selection.background];
  const lighting = data.lightingData[selection.lighting];
  const bodyShape = data.BODY_SHAPES[selection.bodyShape];
  const framing = data.framingData[selection.framing];
  const poseText = data.poseData[selection.pose];
  const prompt = [
    data.identityGuard + ',',
    'Same adult woman from the reference photo, realistic commercial portrait subject, reference photo used for identity only,',
    data.anatomyGuard + ',',
    bodyShape + ',',
    data.lightingConsistencyGuard + ',',
    selection.composition + ',',
    data.compositionGuard + ',',
    'school identity: ' + schoolPromptText + ',',
    'appearance form: ' + upperText + ', ' + waistText + ', ' + lowerText + ', ' + uniformTypeText + ',',
    garmentDetailText,
    'combat styling: ' + armorText + '; ' + capeText + ',',
    emblemFocusText ? emblemFocusText + ',' : '',
    'accessory: ' + accessoryText + ',',
    'fantasy battle detail: ' + fantasyDetailText + ',',
    selection.intensity + ',',
    data.styleData[selection.style] + ',',
    poseText ? poseText + ',' : '',
    framing + ',',
    data.cameraData[selection.camera] + ',',
    'lighting design: ' + lighting + ',',
    'background design: ' + background + ',',
    data.ratioData[selection.ratio] + ',',
    core.page.battleAcademy.output ? core.page.battleAcademy.output + ',' : '',
    'hyper realistic, ultra detailed, premium advertising finish,',
    (selection.colorNote || schoolColorNote) ? 'color palette: ' + (selection.colorNote || schoolColorNote) + ',' : '',
    core.page.battleAcademy.negativePrompt ? core.page.battleAcademy.negativePrompt + ',' : '',
    'the lower body garment stays a genuine skirt with nothing worn underneath it — no shorts, no safety shorts, no biker shorts, no hot pants, no culotte layer added beneath the skirt,',
    'no logo artifacts, no distorted face',
  ];
  return prompt.filter(Boolean).join('\n');
}

function loadRevision(label, sourceReader) {
  const coreSource = sourceReader('assets/core-prompt.js');
  const core = evalCore(coreSource);
  const travelSource = sourceReader('travel.html');
  const magazineSource = sourceReader('magazine.html');
  const fantasySource = sourceReader('fantasy-fashion.html');
  const travelData = evalDataSegment({
    source: travelSource,
    core,
    page: 'travel',
    startMarker: 'const CORE = window.HB_CORE_PROMPT.page.travel;',
    endMarker: 'function setupRadioCards',
    exportExpression: '({ COMPOSITION, STYLES, STYLE_SCOPE_NOTE, ILLUSTRATION_MEDIA_KEYS, MEDIA_STYLES, RATIOS, CAMERA_ANGLES, TRAVEL_LIGHTING_STYLES, MOTION_LEVELS })',
  });
  const magazineData = evalDataSegment({
    source: magazineSource,
    core,
    page: 'magazine',
    startMarker: 'const CORE = window.HB_CORE_PROMPT.page.magazine;',
    endMarker: 'function setupRadioCards',
    exportExpression: '({ STYLES, BACKGROUNDS, POSES, CAMERAS, MOTION_LEVELS, DETAIL_BLOCKS, MAGAZINE_ILLUSTRATION_MEDIA_KEYS, MAGAZINE_ILLUSTRATION_SKIN_TEXTURE, MEDIA_STYLES, RATIOS, BODY_SHAPES, FRAMING_RATIOS, COVER_LIGHTING, MAGAZINE_LIGHTING_CONSISTENCY, MAGAZINE_SUBJECT_INTEGRATION, MAGAZINE_FACE_FILL, COVER_COMPOSITION })',
  });
  const fantasyData = evalDataSegment({
    source: fantasySource,
    core,
    page: 'fantasy',
    startMarker: 'const materialData = {',
    endMarker: 'function setRadioValue',
    exportExpression: '({ materialData, garmentData, styleData, backgroundData, lightingData, sharedFantasyCore, FANTASY_ILLUSTRATION_MATERIAL_KEYS: typeof FANTASY_ILLUSTRATION_MATERIAL_KEYS === "undefined" ? new Set(["paperOiran","paperSculpture","redPaperWedding","watercolorBloom","inkPeony","inkGold","whitePaperFlower"]) : FANTASY_ILLUSTRATION_MATERIAL_KEYS, identityGuard, anatomyGuard, poseNaturalityGuard, BODY_SHAPES, compositionGuard, lightingConsistencyGuard, poseData, framingData, cameraData, ratioData })',
  });
  const prompts = {
    'travel-realistic.txt': generateTravel(core, travelData, 'cinematic_realistic'),
    'travel-watercolor.txt': generateTravel(core, travelData, 'watercolor_travel'),
    'magazine-realistic.txt': generateMagazine(core, magazineData, 'realistic_studio'),
    'magazine-illustration.txt': generateMagazine(core, magazineData, 'manga_cover'),
    'fantasy-default.txt': generateFantasy(core, fantasyData),
  };

  // xianxia.html is new; older revisions may not have it yet, so skip gracefully.
  try {
    const xianxiaSource = sourceReader('xianxia.html');
    const xianxiaData = evalDataSegment({
      source: xianxiaSource,
      core,
      page: 'xianxia',
      startMarker: 'const materialData = {',
      endMarker: 'function setRadioValue',
      exportExpression: '({ materialData, garmentData, chestDetailData, waistSideDetailData, shoulderDetailData, styleData, backgroundData, lightingData, sharedXianxiaCore, XIANXIA_ILLUSTRATION_MATERIAL_KEYS: typeof XIANXIA_ILLUSTRATION_MATERIAL_KEYS === "undefined" ? new Set() : XIANXIA_ILLUSTRATION_MATERIAL_KEYS, identityGuard, anatomyGuard, poseNaturalityGuard, BODY_SHAPES, compositionGuard, lightingConsistencyGuard, poseData, framingData, cameraData, ratioData })',
    });
    prompts['xianxia-default.txt'] = generateXianxia(core, xianxiaData);
  } catch (err) {
    // Not present in this revision — skip.
  }

  // anime-character.html is new; older revisions may not have it yet, so skip gracefully.
  try {
    const animeSource = sourceReader('anime-character.html');
    const animeData = evalDataSegment({
      source: animeSource,
      core,
      page: 'anime',
      startMarker: 'const materialData = {',
      endMarker: 'function setRadioValue',
      exportExpression: '({ materialData, garmentData, chestDetailData, waistSideDetailData, shoulderDetailData, styleData, backgroundData, lightingData, sharedAnimeCore, identityGuard, anatomyGuard, poseNaturalityGuard, BODY_SHAPES, compositionGuard, lightingConsistencyGuard, poseData, framingData, cameraData, ratioData })',
    });
    prompts['anime-default.txt'] = generateAnime(core, animeData);
  } catch (err) {
    // Not present in this revision — skip.
  }

  // flower-fairy.html is new; older revisions may not have it yet, so skip gracefully.
  try {
    const flowerFairySource = sourceReader('flower-fairy.html');
    const flowerFairyData = evalDataSegment({
      source: flowerFairySource,
      core,
      page: 'flowerFairy',
      startMarker: 'const materialData = {',
      endMarker: 'function setRadioValue',
      exportExpression: '({ materialData, garmentData, styleData, backgroundData, lightingData, wingsData, butterfliesData, sharedFlowerFairyCore, identityGuard, anatomyGuard, poseNaturalityGuard, BODY_SHAPES, compositionGuard, lightingConsistencyGuard, poseData, framingData, cameraData, ratioData, chestDetailData, waistSideDetailData, shoulderDetailData })',
    });
    prompts['flowerfairy-default.txt'] = generateFlowerFairy(core, flowerFairyData);
  } catch (err) {
    // Not present in this revision — skip.
  }

  // isekai-fantasy.html is new; older revisions may not have it yet, so skip gracefully.
  try {
    const isekaiSource = sourceReader('isekai-fantasy.html');
    const isekaiData = evalDataSegment({
      source: isekaiSource,
      core,
      page: 'isekai',
      startMarker: 'const materialData = {',
      endMarker: 'function setRadioValue',
      exportExpression: '({ materialData, garmentData, styleData, backgroundData, lightingData, sharedIsekaiCore, identityGuard, anatomyGuard, poseNaturalityGuard, BODY_SHAPES, compositionGuard, lightingConsistencyGuard, poseData, framingData, cameraData, ratioData, chestDetailData, waistSideDetailData, shoulderDetailData })',
    });
    prompts['isekai-default.txt'] = generateIsekai(core, isekaiData);
  } catch (err) {
    // Not present in this revision — skip.
  }

  // floral-sweet.html is new; older revisions may not have it yet, so skip gracefully.
  try {
    const floralSweetSource = sourceReader('floral-sweet.html');
    const floralSweetData = evalDataSegment({
      source: floralSweetSource,
      core,
      page: 'floralSweet',
      startMarker: 'const materialData = {',
      endMarker: 'function setRadioValue',
      exportExpression: '({ materialData, garmentData, styleData, backgroundData, lightingData, sharedFloralSweetCore, identityGuard, anatomyGuard, poseNaturalityGuard, BODY_SHAPES, compositionGuard, lightingConsistencyGuard, poseData, framingData, cameraData, ratioData, chestDetailData, waistSideDetailData, shoulderDetailData })',
    });
    prompts['floralsweet-default.txt'] = generateFloralSweet(core, floralSweetData);
  } catch (err) {
    // Not present in this revision — skip.
  }

  // gala-socialite.html is new; older revisions may not have it yet, so skip gracefully.
  try {
    const galaSocialiteSource = sourceReader('gala-socialite.html');
    const galaSocialiteData = evalDataSegment({
      source: galaSocialiteSource,
      core,
      page: 'galaSocialite',
      startMarker: 'const materialData = {',
      endMarker: 'function setRadioValue',
      exportExpression: '({ materialData, garmentData, styleData, backgroundData, lightingData, sharedGalaSocialiteCore, identityGuard, anatomyGuard, poseNaturalityGuard, BODY_SHAPES, compositionGuard, lightingConsistencyGuard, poseData, framingData, cameraData, ratioData, chestDetailData, waistSideDetailData, shoulderDetailData })',
    });
    prompts['galasocialite-default.txt'] = generateGalaSocialite(core, galaSocialiteData);
  } catch (err) {
    // Not present in this revision — skip.
  }

  // kpop-idol.html is new; older revisions may not have it yet, so skip gracefully.
  try {
    const kpopIdolSource = sourceReader('kpop-idol.html');
    const kpopIdolData = evalDataSegment({
      source: kpopIdolSource,
      core,
      page: 'kpopIdol',
      startMarker: 'const materialData = {',
      endMarker: 'function setRadioValue',
      exportExpression: '({ materialData, garmentData, styleData, backgroundData, lightingData, sharedKpopIdolCore, identityGuard, anatomyGuard, poseNaturalityGuard, BODY_SHAPES, compositionGuard, lightingConsistencyGuard, poseData, framingData, cameraData, ratioData, chestDetailData, waistSideDetailData, shoulderDetailData })',
    });
    prompts['kpopidol-default.txt'] = generateKpopIdol(core, kpopIdolData);
  } catch (err) {
    // Not present in this revision — skip.
  }

  // battle-academy.html is new; older revisions may not have it yet, so skip gracefully.
  try {
    const battleAcademySource = sourceReader('battle-academy.html');
    const battleAcademyData = evalDataSegment({
      source: battleAcademySource,
      core,
      page: 'battleAcademy',
      startMarker: 'const schoolData = {',
      endMarker: 'function selected',
      exportExpression: '({ schoolData, upperBodyData, waistData, lowerData, uniformTypeData, chestDetailData, waistSideDetailData, shoulderDetailData, accessoryData, fantasyDetailData, armorModeData, CAPE_TEXT_OFF, emblemFocusData, styleData, backgroundData, lightingData, sharedBattleAcademyCore, identityGuard, anatomyGuard, BODY_SHAPES, compositionGuard, lightingConsistencyGuard, poseData, framingData, cameraData, ratioData })',
    });
    prompts['battleacademy-default.txt'] = generateBattleAcademy(core, battleAcademyData);
  } catch (err) {
    // Not present in this revision — skip.
  }

  // ancient-goddess.html is new; older revisions may not have it yet, so skip gracefully.
  try {
    const ancientGoddessSource = sourceReader('ancient-goddess.html');
    const ancientGoddessData = evalDataSegment({
      source: ancientGoddessSource,
      core,
      page: 'ancientGoddess',
      startMarker: 'const materialData = {',
      endMarker: 'function setRadioValue',
      exportExpression: '({ materialData, garmentData, styleData, backgroundData, lightingData, sharedAncientGoddessCore, identityGuard, anatomyGuard, poseNaturalityGuard, BODY_SHAPES, compositionGuard, lightingConsistencyGuard, poseData, framingData, cameraData, ratioData, chestDetailData, waistSideDetailData, shoulderDetailData })',
    });
    prompts['ancientgoddess-default.txt'] = generateAncientGoddess(core, ancientGoddessData);
  } catch (err) {
    // Not present in this revision — skip.
  }

  // editorial-identity.html is new; older revisions may not have it yet, so skip gracefully.
  try {
    const editorialSource = sourceReader('editorial-identity.html');
    const editorialData = evalDataSegment({
      source: editorialSource,
      core,
      page: 'editorial',
      startMarker: 'const layoutData = {',
      endMarker: 'function selected(name)',
      exportExpression: '({ layoutData, typographyData, graphicData, colorData, imageTreatmentData, printFinishData, placementData, whitespaceData, languageData, ratioData, sourceImageLockGuard, outputQualityGuard, negativeGuard, themeTemplates })',
    });
    prompts['editorial-default.txt'] = generateEditorial(core, editorialData);
  } catch (err) {
    // Not present in this revision — skip.
  }

  return {
    label,
    core,
    coreLengths: coreLengths(core),
    prompts,
  };
}

function writeText(fileName, text) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, fileName), text, 'utf8');
}

const base = loadRevision(`base-${baseRev}`, (relativePath) => readGit(baseRev, relativePath));
const worktree = loadRevision('worktree', readWorktree);

for (const [fileName, text] of Object.entries(base.prompts)) {
  writeText(`base-${fileName}`, text);
}
for (const [fileName, text] of Object.entries(worktree.prompts)) {
  writeText(`worktree-${fileName}`, text);
}

const report = [
  `# Prompt Preview Report`,
  ``,
  `- Base revision: \`${baseRev}\``,
  `- Output directory: \`${path.relative(root, outDir).replaceAll(path.sep, '/')}\``,
  ``,
  `## Core Block Lengths`,
  ``,
  `| Block | Base | Worktree | Delta |`,
  `| --- | ---: | ---: | ---: |`,
  ...base.coreLengths.rows.map((baseRow) => {
    const workRow = worktree.coreLengths.rows.find((row) => row.key === baseRow.key);
    const workLength = workRow ? workRow.length : 0;
    return `| \`${baseRow.key}\` | ${baseRow.length} | ${workLength} | ${workLength - baseRow.length} |`;
  }),
  `| **total** | **${base.coreLengths.total}** | **${worktree.coreLengths.total}** | **${worktree.coreLengths.total - base.coreLengths.total}** |`,
  ``,
  `## Generated Files`,
  ``,
  ...Array.from(new Set([...Object.keys(base.prompts), ...Object.keys(worktree.prompts)])).sort().flatMap((fileName) => [
    base.prompts[fileName]
      ? `- \`base-${fileName}\``
      : `- \`base-${fileName}\` (base revision not present)`,
    worktree.prompts[fileName]
      ? `- \`worktree-${fileName}\``
      : `- \`worktree-${fileName}\` (worktree not present)`,
  ]),
  ``,
].join('\n');

writeText('preview-report.md', report);
console.log(`Wrote prompt previews to ${path.relative(root, outDir)}`);
