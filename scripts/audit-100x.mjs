// Full-project audit: extract every option from the six generator pages,
// run N random combinations through a mirror of each page's real assembly
// logic, and flag structural/content problems (undefined leaks, missing
// identity lock, duplicate lines, etc). Read-only — writes a report only.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const N = Number(process.argv.find((a) => /^\d+$/.test(a))) || 100;

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
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
  const context = { window: { HB_CORE_PROMPT: { page: { [page]: core.page[page] } } } };
  vm.runInNewContext(`${segment}\n;globalThis.__d = ${exportExpression};`, context, { filename: `${page}-data.js` });
  return context.__d;
}

function radioValues(html, name) {
  return [...html.matchAll(new RegExp(`name="${name}" value="([^"]*)"`, 'g'))].map((m) => m[1]);
}

function selectValues(html, id) {
  const start = html.indexOf(`id="${id}"`);
  if (start === -1) return [];
  const end = html.indexOf('</select>', start);
  const seg = html.slice(start, end);
  return [...seg.matchAll(/<option value="([^"]*)"/g)].map((m) => m[1]);
}

function chipValues(html, containerId) {
  const start = html.indexOf(`id="${containerId}"`);
  if (start === -1) return [];
  const end = html.indexOf('</div>', start);
  const seg = html.slice(start, end);
  return [...seg.matchAll(/data-value="([^"]*)"/g)].map((m) => m[1]);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickSome(arr, max) {
  const n = Math.floor(Math.random() * (max + 1));
  const pool = [...arr];
  const out = [];
  for (let i = 0; i < n && pool.length; i += 1) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}
function randomText() {
  const samples = ['', '京都清水寺楓葉季', '海邊夕陽白色城堡', '測試主題 with émoji 🌸 and "quotes"', '  前後有空白  ', 'A'.repeat(120)];
  return pick(samples);
}

const ISSUES = [];
function checkOutput(pageLabel, i, selection, output, opts = {}) {
  const problems = [];
  if (!output || output.trim().length < (opts.minLen ?? 200)) problems.push('輸出過短或空白');
  if (/\bundefined\b/.test(output)) problems.push('含 undefined');
  if (/\bNaN\b/.test(output)) problems.push('含 NaN');
  if (/\[object Object\]/.test(output)) problems.push('含 [object Object]');
  if (/^null$|\bnull,|\bnull\n/.test(output)) problems.push('含 null 洩漏');
  if (opts.requireIdentity && core_identity_missing(output, opts.identityMarkers)) problems.push('缺身份鎖定區塊');
  const lines = output.split('\n');
  for (let li = 1; li < lines.length; li += 1) {
    if (lines[li].trim() && lines[li] === lines[li - 1]) { problems.push(`相鄰重複行: "${lines[li].slice(0, 40)}"`); break; }
  }
  if (problems.length) {
    ISSUES.push({ page: pageLabel, iteration: i, selection, problems });
  }
}
function core_identity_missing(output, markers) {
  if (!markers || !markers.length) return false;
  return !markers.some((m) => output.includes(m));
}

let totalRuns = 0;
function report(pageLabel, count) {
  totalRuns += count;
  console.log(`${pageLabel}: ${count} simulations done`);
}

// ---------------------------------------------------------------------
const coreSource = read('assets/core-prompt.js');
const core = evalCore(coreSource);

// ===================== TRAVEL =====================
{
  const html = read('travel.html');
  const data = evalDataSegment({
    source: html, core, page: 'travel',
    startMarker: 'const CORE = window.HB_CORE_PROMPT.page.travel;',
    endMarker: 'function setupRadioCards',
    exportExpression: '({ COMPOSITION, STYLES, STYLE_SCOPE_NOTE, ILLUSTRATION_MEDIA_KEYS, MEDIA_STYLES, RATIOS, CAMERA_ANGLES, TRAVEL_LIGHTING_STYLES, MOTION_LEVELS, POSE_STYLES, COSTUME_DIRECTIONS, HAIR_STYLES, ACCESSORY_PROPS })',
  });
  const pools = {
    composition: Object.keys(data.COMPOSITION),
    style: Object.keys(data.STYLES),
    ratio: Object.keys(data.RATIOS),
    camera: Object.keys(data.CAMERA_ANGLES),
    lighting: Object.keys(data.TRAVEL_LIGHTING_STYLES),
    motion: Object.keys(data.MOTION_LEVELS),
    media: Object.keys(data.MEDIA_STYLES),
    pose: Object.keys(data.POSE_STYLES),
    costume: Object.keys(data.COSTUME_DIRECTIONS),
    hair: Object.keys(data.HAIR_STYLES),
    prop: Object.keys(data.ACCESSORY_PROPS),
  };
  for (let i = 0; i < N; i += 1) {
    const sel = {
      composition: pick(pools.composition), styleKey: pick(pools.style), ratioKey: pick(pools.ratio),
      cameraKey: pick(pools.camera), lightingKey: pick(pools.lighting), motionKey: pick(pools.motion),
      mediaKey: pick(pools.media), poseKey: pick(pools.pose), costumeKey: pick(pools.costume),
      hairKey: pick(pools.hair), propKey: pick(pools.prop), theme: randomText(),
    };
    const style = data.STYLES[sel.styleKey];
    const theme = sel.theme.trim() || '(請填寫主題)';
    const styleBlock = `【風格模組｜主風格】\n\n${style.text}\n\n${data.STYLE_SCOPE_NOTE}`;
    const cameraBlock = data.CAMERA_ANGLES[sel.cameraKey];
    const lightingBlock = data.TRAVEL_LIGHTING_STYLES[sel.lightingKey];
    const motionBlock = data.MOTION_LEVELS[sel.motionKey];
    const mediaBlock = data.MEDIA_STYLES[sel.mediaKey];
    const skeletonBlock = data.ILLUSTRATION_MEDIA_KEYS.has(sel.mediaKey)
      ? (core.page.travel.illustrationSkeleton || core.page.travel.skeleton) : core.page.travel.skeleton;
    const costumeBlock = `【服裝邏輯模組｜動態造型系統】\n\n根據主題「${theme}」自動設計服裝層次(Layer1~Layer7)\n服裝層數依主題自動增減,通常2~5層,特殊主題可擴展至7層\n優先真人旅拍感\n優先${style.label}的視覺語言\n服裝符合主題世界觀與材質質感\nPremium Fabric / Fine Embroidery / Rich Material Detail\n\n避免過度Cosplay化\n避免遊戲角色盔甲化\n避免動漫角色化`;
    const poseBlock = data.POSE_STYLES[sel.poseKey] || null;
    const costumeDirection = data.COSTUME_DIRECTIONS[sel.costumeKey] || null;
    const costumeBlockFinal = costumeDirection ? costumeBlock + `\n\n${costumeDirection}\n服裝以上述方向為主軸,細節仍需符合主題世界觀` : costumeBlock;
    const adornLines = [data.HAIR_STYLES[sel.hairKey], data.ACCESSORY_PROPS[sel.propKey]].filter(Boolean);
    const adornBlock = adornLines.length ? `【裝扮細節模組】\n\n${adornLines.join('\n')}\nStyling must not change facial identity or face shape` : null;
    const cameraOverridesComposition = ['cover', 'wide_scene', 'distant_hero'].includes(sel.cameraKey);
    const themeBlock = `【主題】\n\n${theme}`;
    const ratioBlock = `【輸出比例】\n\n${data.RATIOS[sel.ratioKey]}`;
    const sections = [
      core.page.travel.identity, skeletonBlock, core.page.travel.lighting, core.page.travel.pose, core.page.travel.photographer,
      ...(lightingBlock ? [lightingBlock] : []), ...(cameraBlock ? [cameraBlock] : []), ...(poseBlock ? [poseBlock] : []),
      ...(motionBlock ? [motionBlock] : []), ...(cameraOverridesComposition ? [] : [data.COMPOSITION[sel.composition]]),
      styleBlock, mediaBlock, themeBlock, costumeBlockFinal, ...(adornBlock ? [adornBlock] : []),
      core.page.travel.cleanframe, core.page.travel.output, ratioBlock,
    ];
    const output = sections.join('\n\n⸻\n\n');
    checkOutput('travel', i, sel, output, { requireIdentity: true, identityMarkers: ['身份鎖定系統'] });
  }
  report('travel', N);
}

// ===================== MAGAZINE =====================
{
  const html = read('magazine.html');
  const data = evalDataSegment({
    source: html, core, page: 'magazine',
    startMarker: 'const CORE = window.HB_CORE_PROMPT.page.magazine;',
    endMarker: 'function setupRadioCards',
    exportExpression: '({ STYLES, BACKGROUNDS, POSES, CAMERAS, MOTION_LEVELS, DETAIL_BLOCKS, MAGAZINE_ILLUSTRATION_MEDIA_KEYS, MAGAZINE_ILLUSTRATION_SKIN_TEXTURE, MEDIA_STYLES, RATIOS, BODY_SHAPES, FRAMING_RATIOS, COVER_LIGHTING, MAGAZINE_LIGHTING_CONSISTENCY, MAGAZINE_SUBJECT_INTEGRATION, MAGAZINE_FACE_FILL, COVER_COMPOSITION })',
  });
  const pools = {
    style: Object.keys(data.STYLES), bodyShape: Object.keys(data.BODY_SHAPES), bg: Object.keys(data.BACKGROUNDS),
    pose: Object.keys(data.POSES), framing: Object.keys(data.FRAMING_RATIOS), camera: Object.keys(data.CAMERAS),
    motion: Object.keys(data.MOTION_LEVELS), ratio: Object.keys(data.RATIOS), media: Object.keys(data.MEDIA_STYLES),
    makeup: Object.keys(data.DETAIL_BLOCKS.makeup), skinTexture: Object.keys(data.DETAIL_BLOCKS.skinTexture),
    jewelry: Object.keys(data.DETAIL_BLOCKS.jewelry), expression: Object.keys(data.DETAIL_BLOCKS.expression),
    lighting: Object.keys(data.DETAIL_BLOCKS.lighting),
  };
  for (let i = 0; i < N; i += 1) {
    const sel = {
      styleKey: pick(pools.style), bodyShapeKey: pick(pools.bodyShape), bgKey: pick(pools.bg), poseKey: pick(pools.pose),
      framingKey: pick(pools.framing), cameraKey: pick(pools.camera), motionKey: pick(pools.motion), ratioKey: pick(pools.ratio),
      mediaKey: pick(pools.media), makeupKeys: pickSome(pools.makeup, 2).length ? pickSome(pools.makeup, 2) : ['original'],
      skinTextureKey: pick(pools.skinTexture), jewelryKeys: pickSome(pools.jewelry, 2).length ? pickSome(pools.jewelry, 2) : ['none'],
      expressionKey: pick(pools.expression), lightingKey: pick(pools.lighting), theme: randomText(),
    };
    const style = data.STYLES[sel.styleKey];
    const isInkFlower = sel.styleKey === 'ink_flower';
    const theme = sel.theme.trim() || '(請填寫主題或服裝方向)';
    const styleBlock = isInkFlower ? `【封面風格｜${style.label}】\n\n${style.text}` : `【封面風格｜${style.label}】\n\n${style.text}\n\n風格僅套用於光線、構圖、氛圍、服裝質感\n不可覆寫或調整五官、臉型、臉部特徵`;
    const bgBlock = isInkFlower ? `【背景設定】\n\nPure White Background\nClean Empty Background\nNo Scene No Environment` : `【背景設定】\n\n${data.BACKGROUNDS[sel.bgKey]}`;
    const bodyShapeBlock = data.BODY_SHAPES[sel.bodyShapeKey];
    const poseText = isInkFlower ? null : data.POSES[sel.poseKey];
    const poseBlock = poseText ? `【姿態模組】\n\n${poseText}` : null;
    const framingBlock = data.FRAMING_RATIOS[sel.framingKey];
    const cameraBlock = data.CAMERAS[sel.cameraKey];
    const motionBlock = data.MOTION_LEVELS[sel.motionKey];
    const costumeBlock = isInkFlower
      ? `【服裝邏輯模組｜花墨染專屬】\n\n服裝依主題「${theme}」或AI自動決定\n薄紗半透明材質為主\nSheer Translucent Fabric\nOrganza Or Thin Silk Texture\n服裝與花卉自然融合`
      : `【服裝邏輯模組｜動態造型系統】\n\n根據主題「${theme}」自動設計服裝層次\n服裝層數依主題自動增減,通常2~5層\n優先封面大片感\n優先${style.label}的視覺語言\n服裝符合主題世界觀與材質質感\nPremium Fabric / Luxury Material Detail\n\n避免過度Cosplay化\n避免遊戲角色盔甲化`;
    const makeupBlock = `【妝容】\n\n${sel.makeupKeys.map((k) => data.DETAIL_BLOCKS.makeup[k]).filter(Boolean).join('\n\n')}`;
    const skinTextureBlock = `【膚質質感】\n\n${data.DETAIL_BLOCKS.skinTexture[sel.skinTextureKey]}`;
    const jewelryBlock = `【珠寶配飾】\n\n${sel.jewelryKeys.map((k) => data.DETAIL_BLOCKS.jewelry[k]).filter(Boolean).join('\n\n')}`;
    const expressionBlock = `【眼神表情】\n\n${data.DETAIL_BLOCKS.expression[sel.expressionKey]}`;
    const lightingToneBlock = `【光線類型】\n\n${data.DETAIL_BLOCKS.lighting[sel.lightingKey]}`;
    const mediaBlock = data.MEDIA_STYLES[sel.mediaKey];
    const isIllustrationMedia = data.MAGAZINE_ILLUSTRATION_MEDIA_KEYS.has(sel.mediaKey);
    const skeletonBlock = isIllustrationMedia ? (core.page.magazine.illustrationSkeleton || core.page.magazine.skeleton) : core.page.magazine.skeleton;
    const resolvedSkinTextureBlock = isIllustrationMedia ? data.MAGAZINE_ILLUSTRATION_SKIN_TEXTURE : skinTextureBlock;
    const themeBlock = `【主題 / 服裝方向】\n\n${theme}`;
    const ratioBlock = `【輸出比例】\n\n${data.RATIOS[sel.ratioKey]}`;
    const sections = [
      core.page.magazine.identity, skeletonBlock, bodyShapeBlock, data.MAGAZINE_LIGHTING_CONSISTENCY, data.MAGAZINE_SUBJECT_INTEGRATION,
      data.MAGAZINE_FACE_FILL, core.page.magazine.photographer, ...(poseBlock ? [poseBlock] : []), framingBlock,
      ...(cameraBlock ? [cameraBlock] : []), ...(motionBlock ? [motionBlock] : []), data.COVER_COMPOSITION, styleBlock, mediaBlock,
      bgBlock, themeBlock, costumeBlock, makeupBlock, resolvedSkinTextureBlock, jewelryBlock, expressionBlock, lightingToneBlock,
      data.COVER_LIGHTING, core.page.magazine.cleanframe, core.page.magazine.output, ratioBlock,
    ];
    const output = sections.join('\n\n⸻\n\n');
    checkOutput('magazine', i, sel, output, { requireIdentity: true, identityMarkers: ['身份鎖定系統'] });
  }
  report('magazine', N);
}

// ===================== FANTASY =====================
{
  const html = read('fantasy-fashion.html');
  const data = evalDataSegment({
    source: html, core, page: 'fantasy',
    startMarker: 'const materialData = {',
    endMarker: 'function setRadioValue',
    exportExpression: '({ materialData, garmentData, styleData, backgroundData, lightingData, sharedFantasyCore, FANTASY_ILLUSTRATION_MATERIAL_KEYS: typeof FANTASY_ILLUSTRATION_MATERIAL_KEYS === "undefined" ? new Set() : FANTASY_ILLUSTRATION_MATERIAL_KEYS, identityGuard, anatomyGuard, BODY_SHAPES, styleScopeGuard, compositionGuard, lightingConsistencyGuard, colorTemperatureGuard, subjectIntegrationGuard, faceFillGuard, poseData, framingData, cameraData, ratioData })',
  });
  const compositionValues = radioValues(html, 'composition');
  const intensityValues = selectValues(html, 'intensity');
  const pools = {
    bodyShape: Object.keys(data.BODY_SHAPES), material: Object.keys(data.materialData), garment: Object.keys(data.garmentData),
    background: Object.keys(data.backgroundData), lighting: Object.keys(data.lightingData), composition: compositionValues,
    framing: Object.keys(data.framingData), intensity: intensityValues, pose: Object.keys(data.poseData),
    style: Object.keys(data.styleData), camera: Object.keys(data.cameraData), ratio: Object.keys(data.ratioData),
  };
  const customSamples = ['', '', 'watercolor splash', '手工訂製'];
  for (let i = 0; i < N; i += 1) {
    const sel = {
      bodyShape: pick(pools.bodyShape), material: pick(pools.material), garment: pick(pools.garment),
      background: pick(pools.background), lighting: pick(pools.lighting), composition: pick(pools.composition),
      framing: pick(pools.framing), intensity: pick(pools.intensity), pose: pick(pools.pose), style: pick(pools.style),
      camera: pick(pools.camera), ratio: pick(pools.ratio), customMaterial: pick(customSamples), customGarment: pick(customSamples),
      colorNote: pick(customSamples), extraNote: pick(customSamples),
    };
    const material = data.materialData[sel.material];
    const customMaterials = sel.customMaterial ? [sel.customMaterial] : [];
    const customMaterialText = customMaterials.join(', ');
    const isIllustrationMaterial = data.FANTASY_ILLUSTRATION_MATERIAL_KEYS.has(sel.material)
      || /illustration|watercolor|anime|manga|oil painting|paper|ink/i.test(customMaterialText);
    const resolvedAnatomyGuard = isIllustrationMaterial ? (core.page.fantasy.illustrationSkeleton || data.anatomyGuard) : data.anatomyGuard;
    const materialText = customMaterials.length
      ? `custom material system only: ${customMaterialText}; read and use every custom material keyword with equal priority, combine all custom materials into one coherent art system, do not include or blend any preset material option`
      : material.prompt;
    const materialPalette = customMaterials.length ? `derive the color palette only from custom material keywords: ${customMaterialText}` : material.palette;
    const garmentText = sel.customGarment ? `custom garment form only: ${sel.customGarment}; do not include or blend any preset garment option` : data.garmentData[sel.garment];
    const background = data.backgroundData[sel.background];
    const lighting = data.lightingData[sel.lighting];
    const bodyShape = data.BODY_SHAPES[sel.bodyShape];
    const framing = data.framingData[sel.framing];
    const poseText = data.poseData[sel.pose];
    const prompt = [
      data.identityGuard + ',', 'Same adult woman from the reference photo, realistic commercial portrait subject, reference photo used for identity only,',
      resolvedAnatomyGuard + ',', bodyShape + ',', data.lightingConsistencyGuard + ',', data.colorTemperatureGuard + ',',
      data.subjectIntegrationGuard + ',', data.faceFillGuard + ',', sel.composition + ',', data.compositionGuard + ',',
      'appearance form: ' + garmentText + ',', 'theme material and art system: ' + materialText + ',',
      'use the selected material system to form the clothing, ornaments, background accents and advertising visual language,',
      sel.intensity + ',', 'selected material appears as controlled clothing details, ornaments, particles and background accents without overpowering facial identity,',
      data.styleData[sel.style] + ',', data.styleScopeGuard + ',', poseText ? poseText + ',' : '', framing + ',',
      data.cameraData[sel.camera] + ',', 'lighting design: ' + lighting + ',', 'background design: ' + background + ',',
      data.ratioData[sel.ratio] + ',', core.page.fantasy.output ? core.page.fantasy.output + ',' : '',
      'sharp focus, hyper realistic, ultra detailed, premium advertising finish,', 'color palette: ' + (sel.colorNote || materialPalette) + ',',
      sel.extraNote ? 'extra direction: ' + sel.extraNote + ',' : '', core.page.fantasy.negativePrompt ? core.page.fantasy.negativePrompt + ',' : '',
      'no random text, no watermark, no logo artifacts, no extra fingers, no deformed body, no distorted face',
    ].filter(Boolean);
    const output = prompt.join('\n');
    checkOutput('fantasy', i, sel, output, { requireIdentity: true, identityMarkers: ['身份鎖定系統', '身份轉換'] });
  }
  report('fantasy', N);
}

// ===================== DOLL =====================
{
  const html = read('doll.html');
  const data = evalDataSegment({
    source: html, core, page: 'doll',
    startMarker: 'const CORE_IDENTITY =',
    endMarker: 'function setupRadioCards',
    exportExpression: '({ CORE_IDENTITY, CORE_BODY, STYLES, COMPOSITIONS, POSES, BASES, MEDIA_STYLES, RATIOS })',
  });
  const pools = {
    style: Object.keys(data.STYLES), composition: Object.keys(data.COMPOSITIONS), ratio: Object.keys(data.RATIOS),
    media: Object.keys(data.MEDIA_STYLES), hairChip: chipValues(html, 'hairChips'), faceChip: chipValues(html, 'faceChips'),
    poseChip: Object.keys(data.POSES), baseChip: Object.keys(data.BASES),
  };
  for (let i = 0; i < N; i += 1) {
    const sel = {
      styleKey: pick(pools.style), compositionKey: pick(pools.composition), ratioKey: pick(pools.ratio), mediaKey: pick(pools.media),
      theme: randomText(), hair: pickSome(pools.hairChip, 2), face: pickSome(pools.faceChip, 2), pose: pickSome(pools.poseChip, 2),
      base: pickSome(pools.baseChip, 2),
    };
    const theme = sel.theme.trim() || '(請輸入主題靈感)';
    const mediaBlock = data.MEDIA_STYLES[sel.mediaKey];
    const themeBlock = `【主題設定】\n\n主題靈感:${theme}\n\n根據主題自動設計:\n服裝 — 符合主題世界觀,可愛Q版風格\n道具 — 主題相關代表性道具\n布景背景 — 對應主題情景與氛圍\n配色 — 依主題與風格強度自動配色\n細節裝飾 — 主題相關裝飾元素`;
    const styleBlock = `【風格強度】\n\n${data.STYLES[sel.styleKey]}`;
    const hairBlock = sel.hair.length > 0 ? `【髮型設定】\n\n${sel.hair.join(' / ')}` : `【髮型設定】\n\nAI根據主題自動選配最適合的髮型`;
    const faceBlock = sel.face.length > 0 ? `【表情設定】\n\n${sel.face.join(' / ')}` : `【表情設定】\n\nAI根據主題自動選配最適合的表情`;
    const poseBlock = sel.pose.length > 0 ? `【姿勢設定】\n\n${sel.pose.map((p) => data.POSES[p] || p).join('\n')}` : `【姿勢設定】\n\nAI根據主題與構圖自動選配最適合的姿勢`;
    const baseBlock = sel.base.length > 0 ? `【展示底座】\n\n${sel.base.map((b) => data.BASES[b] || b).join('\n')}` : `【展示底座】\n\nAI根據主題自動選配對應底座類型`;
    const sections = [
      data.CORE_IDENTITY, data.CORE_BODY, themeBlock, styleBlock, data.COMPOSITIONS[sel.compositionKey],
      hairBlock, faceBlock, poseBlock, baseBlock, mediaBlock,
      `【輸出規格】\n\n4K Quality / Ultra Detailed\nCollectible Figure Photography Quality\nPVC Figure Showcase Lighting\n${data.RATIOS[sel.ratioKey]}`,
    ];
    const output = sections.join('\n\n⸻\n\n');
    checkOutput('doll', i, sel, output, { requireIdentity: true, identityMarkers: ['公仔化身份轉換系統'] });
  }
  report('doll', N);
}

// ===================== STORE-AD =====================
{
  const html = read('store-ad.html');
  const data = evalDataSegment({
    source: html, core, page: 'storeAd',
    startMarker: 'const STORE_AD_CORE =',
    endMarker: 'function selected',
    exportExpression: '({ campaignData, visualData, heroSourceData })',
  });
  const pools = {
    campaign: Object.keys(data.campaignData), visual: Object.keys(data.visualData), heroSource: Object.keys(data.heroSourceData),
    industry: selectValues(html, 'industry'), logo: selectValues(html, 'logo'), ratio: selectValues(html, 'ratio'),
    festival: selectValues(html, 'festivalType'),
  };
  const textSamples = ['', '測試店名', 'A'.repeat(60), '  空白測試  ', '特殊字元 & < > "quote"'];
  const coreBlocks = core.blocks;
  const storeAdCore = core.page.storeAd;
  function makeSlogan(industry, campaign) {
    if (industry === 'real estate agency / residential property sales') {
      if (campaign === 'recruit') return '尋找懂市場、也懂服務的專業夥伴';
      if (campaign === 'price') return '透明資訊，安心找到理想住處';
      if (campaign === 'vip') return '專屬賞屋服務，為重要的選擇把關';
      if (campaign === 'newProduct') return '全新物件登場，遇見理想生活';
      return '找到適合生活的理想住所';
    }
    if (industry === 'hair salon') {
      if (campaign === 'recruit') return '一起打造更有質感的美';
      if (campaign === 'price') return '精緻髮型服務，清楚透明方案';
      return '換一個造型，迎接新的季節';
    }
    if (campaign === 'recruit') return '尋找一起成長的專業夥伴';
    if (campaign === 'vip') return '專屬邀請，只為重要的你';
    if (campaign === 'newProduct') return '全新登場，值得第一眼心動';
    return '用更好的體驗，留住每一次美好';
  }
  function placeholderText(t) { return t || '請填入'; }
  for (let i = 0; i < N; i += 1) {
    const sel = {
      campaign: pick(pools.campaign), visual: pick(pools.visual), heroSource: pick(pools.heroSource),
      industry: pick(pools.industry), logo: pick(pools.logo), ratio: pick(pools.ratio),
      storeName: pick(textSamples), eventName: pick(textSamples), eventDate: pick(textSamples), offer: pick(textSamples),
      phone: pick(textSamples), address: pick(textSamples), customColor: pick(textSamples), slogan: pick([...textSamples, '']),
      extraNote: pick(textSamples), festivalType: sel_festival(),
    };
    function sel_festival() { return Math.random() < 0.5 ? pick(pools.festival) : ''; }
    const campaign = data.campaignData[sel.campaign];
    const visual = data.visualData[sel.visual];
    const heroSource = sel.heroSource;
    const heroLine = data.heroSourceData[heroSource];
    const isPersonHero = heroSource === 'person';
    const festivalType = sel.campaign === 'festival' ? sel.festivalType : '';
    const storeName = sel.storeName.trim();
    const eventName = sel.eventName.trim();
    const eventDate = sel.eventDate.trim();
    const offer = sel.offer.trim();
    const phone = sel.phone.trim();
    const address = sel.address.trim();
    const customColor = sel.customColor.trim();
    const slogan = sel.slogan.trim() || makeSlogan(sel.industry, sel.campaign);
    const extraNote = sel.extraNote.trim();
    const palette = customColor || visual.palette;
    const title = eventName || campaign.title;
    const posterCopy = [
      sel.logo !== 'do not show a brand name or logo' && storeName ? `store name: ${storeName}` : '',
      `headline: ${title}`, `subheadline: ${slogan}`, offer ? `offer: ${offer}` : '', eventDate ? `date: ${eventDate}` : '',
      phone ? `phone: ${phone}` : '', address ? `address: ${address}` : '',
    ].filter(Boolean).join(' | ');
    const posterText = [
      '【海報企劃】', `主標題：${title}`, `副標題：${slogan}`, `活動文案：${placeholderText(offer)}`,
      `資訊排列：活動日期：${placeholderText(eventDate)}｜電話：${placeholderText(phone)}｜地址：${placeholderText(address)}`, '',
      `版面配置：${campaign.layout}`, `字體配置：${visual.font}`, `色彩建議：${palette}`, '', '【出圖咒語】',
      [
        `${sel.ratio}, premium commercial poster for a ${sel.industry},`, campaign.prompt + ',', festivalType ? festivalType + ',' : '',
        visual.prompt + ',', heroLine ? heroLine + ',' : '',
        isPersonHero && coreBlocks.identityLock ? coreBlocks.identityLock + ',' : '',
        isPersonHero && coreBlocks.faceGeometryLock ? coreBlocks.faceGeometryLock + ',' : '',
        isPersonHero && storeAdCore.lighting ? storeAdCore.lighting + ',' : '',
        `${sel.logo}, clear headline area and clear information area,`,
        'render the following Traditional Chinese poster copy exactly, legibly, with correct characters, punctuation, numerals, and line breaks; do not print field labels and do not add any other text:',
        posterCopy + ',',
        'place all text on high-contrast solid color areas or clean negative space for readability; if any Traditional Chinese character cannot be rendered perfectly, leave that text area blank instead of printing wrong characters,',
        'no misspelled text, no gibberish, no random letters, no watermark,',
        'clear visual hierarchy, refined lighting, high-end commercial design, premium local business advertising,',
        `visual direction color palette: ${palette},`, extraNote ? `extra direction: ${extraNote},` : '',
        storeAdCore.negativePrompt ? storeAdCore.negativePrompt + ',' : '', storeAdCore.output ? storeAdCore.output + ',' : '',
        'professional advertising artwork, elegant composition, high quality, sharp focus',
      ].filter(Boolean).join('\n'),
      '', '【海報文字內容】', `店名：${placeholderText(storeName)}`, `主標題：${title}`, `副標題：${slogan}`,
      `活動內容：${placeholderText(offer)}`, `日期：${placeholderText(eventDate)}`, `電話：${placeholderText(phone)}`, `地址：${placeholderText(address)}`,
    ].join('\n');
    checkOutput('store-ad', i, sel, posterText, {
      minLen: 100,
      requireIdentity: isPersonHero,
      identityMarkers: isPersonHero ? ['身份鎖定系統'] : [],
    });
  }
  report('store-ad', N);
}

// ===================== ANIME-HERO =====================
{
  const html = read('anime-hero.html');
  // anime-hero.html builds its cards dynamically from JS data objects and calls
  // document.getElementById(...)/buildCards(...) at load time, so the vm context
  // needs a minimal document stub for that top-level code to run without throwing.
  const start = html.indexOf('const companionData = {');
  const end = html.indexOf('function selected(');
  const segment = html.slice(start, end);
  const context = {
    window: { HB_CORE_PROMPT: { page: { fantasy: core.page.fantasy } } },
    document: { getElementById: () => ({ innerHTML: '' }) },
  };
  vm.runInNewContext(`${segment}\n;globalThis.__d = ({ companionData, interactionData, compositionData, outfitBattle, outfitNormal, outfitHybrid, bodyData, styleData, cameraData, lightingData, backgroundData, fxData, ratioData, mediaData, presets, RELATION_LOCK, SECOND_EXISTENCE_IDENTITY_ISOLATION });`, context, { filename: 'anime-hero-data.js' });
  const data = context.__d;
  const pools = {
    companion: Object.keys(data.companionData), interaction: Object.keys(data.interactionData),
    composition: Object.keys(data.compositionData),
    outfit: [...Object.keys(data.outfitBattle), ...Object.keys(data.outfitNormal), ...Object.keys(data.outfitHybrid)],
    body: Object.keys(data.bodyData), style: Object.keys(data.styleData), camera: Object.keys(data.cameraData),
    lighting: Object.keys(data.lightingData), background: Object.keys(data.backgroundData), fx: Object.keys(data.fxData),
    ratio: Object.keys(data.ratioData), media: Object.keys(data.mediaData),
  };
  const identityGuard = core.page.fantasy.identityGuard;
  const anatomyGuard = core.page.fantasy.anatomyGuard;
  const lightingConsistencyGuard = core.page.fantasy.lightingGuard;
  const negativePrompt = core.page.fantasy.negativePrompt;
  const outputQuality = core.page.fantasy.output;
  const subjectIntegrationGuard = '【人物融合系統】';
  const customSamples = ['', '', '白銀鎧甲禮服', '測試主題 with émoji 🌸 and "quotes"'];
  for (let i = 0; i < N; i += 1) {
    const sel = {
      companion: pick(pools.companion), interaction: pick(pools.interaction), composition: pick(pools.composition),
      outfit: pick(pools.outfit),
      body: pick(pools.body), style: pick(pools.style), camera: pick(pools.camera), lighting: pick(pools.lighting),
      background: pick(pools.background), fx: pick(pools.fx), ratio: pick(pools.ratio), media: pick(pools.media),
      colorNote: randomText(), prop: randomText(), titleArea: randomText(), extraNote: randomText(),
      customOutfit: pick(customSamples), customBackground: pick(customSamples),
    };
    const companion = data.companionData[sel.companion];
    const interaction = data.interactionData[sel.interaction];
    const composition = data.compositionData[sel.composition];
    const outfit = data.outfitBattle[sel.outfit] || data.outfitNormal[sel.outfit] || data.outfitHybrid[sel.outfit];
    const body = data.bodyData[sel.body];
    const style = data.styleData[sel.style];
    const camera = data.cameraData[sel.camera];
    const lighting = data.lightingData[sel.lighting];
    const background = data.backgroundData[sel.background];
    const fx = data.fxData[sel.fx];
    const ratio = data.ratioData[sel.ratio];
    const media = data.mediaData[sel.media];
    const colorNote = sel.colorNote.trim();
    const prop = sel.prop.trim() || 'an original transformation core or matching signature weapon';
    const titleArea = sel.titleArea.trim() || 'leave a clean lower poster area for optional title treatment, but generate no readable text';
    const extraNote = sel.extraNote.trim();
    const customOutfit = sel.customOutfit.trim();
    const customBackground = sel.customBackground.trim();
    const outfitText = customOutfit ? 'custom outfit description only: ' + customOutfit + '; do not include or blend any preset outfit option' : outfit.prompt;
    const backgroundText = customBackground ? 'custom background description only: ' + customBackground + '; do not include or blend any preset background option' : background.prompt;
    const prompt = [
      identityGuard + ',', 'Same adult person from the reference photo, realistic cinematic key-art subject, reference photo used for identity only,',
      anatomyGuard + ',', body.prompt + ',', data.SECOND_EXISTENCE_IDENTITY_ISOLATION, data.RELATION_LOCK,
      '【配角設計】\ncompanion: ' + companion.prompt + ',', 'identity exception: ' + companion.identityException + ',',
      '【互動構圖】\n' + interaction.prompt + ',', '【構圖法則】\n' + composition.prompt + ',',
      lightingConsistencyGuard, subjectIntegrationGuard,
      '【服裝】\nperson outfit: ' + outfitText + ',', '【海報語氣】\n' + style.prompt + ',', '【場景】\nbackground: ' + backgroundText + ',',
      '【特效】\n' + fx.prompt + ',', '【鏡頭】\n' + camera.prompt + ',', '【光影】\nlighting design: ' + lighting.prompt + ',',
      'color palette: ' + (colorNote || 'derive a cohesive premium palette from the selected lighting and companion design') + ',',
      'signature prop: ' + prop + ',', titleArea + ',', ratio.prompt + ',', '【輸出風格／畫面媒材】\n' + media.prompt + ',',
      extraNote ? 'extra direction: ' + extraNote + ',' : '', outputQuality ? outputQuality + ',' : '',
      'premium cinematic promotional key art, rich layered depth: foreground particles, midground subjects, monumental background, volumetric light, controlled contrast,',
      negativePrompt ? negativePrompt + ',' : '',
      'no franchise character, no copyrighted logo, no readable title text, no watermark, no duplicate human, no extra exposed human face, no face-covered effects',
    ].filter(Boolean).join('\n');
    checkOutput('anime-hero', i, sel, prompt, { requireIdentity: true, identityMarkers: ['身份鎖定系統'] });
  }
  report('anime-hero', N);
}

// ===================== BANNED-NAME STATIC SCAN (source files, not simulation) =====================
const bannedNames = ['不知火舞', '月野うさぎ', '胡蝶しのぶ', '麻宮アテナ', 'ボア・ハンコック', 'ニコ・ロビン', '真三國無雙', '月英', '練師', '孫尚香'];
for (const file of ['travel.html', 'magazine.html', 'fantasy-fashion.html', 'doll.html', 'store-ad.html', 'anime-hero.html']) {
  const html = read(file);
  for (const name of bannedNames) {
    if (html.includes(name)) ISSUES.push({ page: file, iteration: 'static-scan', selection: null, problems: [`原始碼含禁用角色名: ${name}`] });
  }
}

// ===================== REPORT =====================
console.log(`\nTotal simulations: ${totalRuns}`);
console.log(`Issues found: ${ISSUES.length}`);
if (ISSUES.length) {
  console.log('\n--- ISSUE DETAIL (first 20) ---');
  for (const issue of ISSUES.slice(0, 20)) {
    console.log(`[${issue.page} #${issue.iteration}] ${issue.problems.join('; ')}`);
    console.log('  selection:', JSON.stringify(issue.selection));
  }
  process.exitCode = 1;
} else {
  console.log('\n✅ ALL SIMULATIONS PASS — 全部 100x6 隨機模擬皆無 undefined/NaN/[object Object]/null 洩漏、身份鎖定完整、無相鄰重複行、無禁用角色名。');
}
