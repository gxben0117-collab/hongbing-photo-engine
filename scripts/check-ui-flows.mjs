import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

// Static regression checks for the contract between visible controls and the
// one-click / generation code. This intentionally avoids a browser dependency.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'travel.html', 'magazine.html', 'doll.html', 'fantasy-fashion.html',
  'chinese-classical.html', 'japanese-kimono.html', 'korean-hanbok.html',
  'xianxia.html', 'anime-character.html', 'flower-fairy.html',
  'isekai-fantasy.html', 'store-ad.html', 'floral-sweet.html',
  'gala-socialite.html', 'kpop-idol.html', 'battle-academy.html',
  'ancient-goddess.html', 'editorial-identity.html',
];

const visualOrderContracts = {
  'travel.html': {
    'travel-random': 0, 'travel-preset': 1, 'travel-style': 2, 'travel-theme': 3,
    'travel-composition': 4, 'travel-costume': 5, 'travel-adorn': 6,
    'travel-pose': 7, 'travel-motion': 8, 'travel-lighting': 9, 'travel-camera': 10,
    'travel-ratio': 11, 'travel-media': 12, 'travel-output': 13,
  },
  'magazine.html': {
    'magazine-preset': 0, 'magazine-style': 1, 'magazine-theme': 2,
    'magazine-garment-variation': 3, 'magazine-details': 4, 'magazine-body': 5,
    'magazine-pose': 6, 'magazine-framing': 7, 'magazine-background': 8,
    'magazine-motion': 9, 'magazine-camera': 10, 'magazine-ratio': 11,
    'magazine-media': 12, 'magazine-output': 13,
  },
  'fantasy-fashion.html': {
    'section-preset': 0, 'section-style': 1, 'section-composition': 2,
    'section-garment': 3, 'section-material': 4, 'section-garment-variation': 5,
    'section-body': 6, 'section-pose': 7, 'section-extra': 8,
    'section-lighting': 9, 'section-background': 10, 'section-camera': 11,
    'section-ratio': 12, 'section-output': 13,
  },
  'chinese-classical.html': {
    'section-preset': 0, 'section-style': 1, 'section-composition': 2,
    'section-garment': 3, 'section-material': 4, 'section-garment-variation': 5,
    'section-body': 6, 'section-pose': 7, 'section-extra': 8,
    'section-lighting': 9, 'section-background': 10, 'section-camera': 11,
    'section-ratio': 12, 'section-output': 13,
  },
  'japanese-kimono.html': {
    'section-preset': 0, 'section-style': 1, 'section-composition': 2,
    'section-garment': 3, 'section-material': 4, 'section-garment-variation': 5,
    'section-body': 6, 'section-pose': 7, 'section-extra': 8,
    'section-lighting': 9, 'section-background': 10, 'section-camera': 11,
    'section-ratio': 12, 'section-output': 13,
  },
  'korean-hanbok.html': {
    'section-preset': 0, 'section-style': 1, 'section-composition': 2,
    'section-garment': 3, 'section-material': 4, 'section-garment-variation': 5,
    'section-body': 6, 'section-pose': 7, 'section-extra': 8,
    'section-lighting': 9, 'section-background': 10, 'section-camera': 11,
    'section-ratio': 12, 'section-output': 13,
  },
  'flower-fairy.html': {
    'section-preset': 0, 'section-style': 1, 'section-composition': 2,
    'section-garment': 3, 'section-material': 4, 'section-wings': 5,
    'section-garmentdetail': 6, 'section-body': 7, 'section-pose': 8,
    'section-extra': 9, 'section-lighting': 10, 'section-background': 11,
    'section-camera': 12, 'section-ratio': 13, 'section-output': 14,
  },
  'battle-academy.html': {
    'section-preset': 0, 'section-style': 1, 'section-composition': 2,
    'section-school': 3, 'section-upper': 4, 'section-waist': 5,
    'section-lower': 6, 'section-uniformtype': 7, 'section-accessory': 8,
    'section-battlemode': 9, 'section-garmentdetail': 10, 'section-body': 11,
    'section-pose': 12, 'section-extra': 13, 'section-lighting': 14,
    'section-background': 15, 'section-camera': 16, 'section-ratio': 17,
    'section-output': 18,
  },
};

for (const page of ['xianxia.html', 'anime-character.html', 'isekai-fantasy.html', 'floral-sweet.html', 'gala-socialite.html', 'kpop-idol.html', 'ancient-goddess.html']) {
  visualOrderContracts[page] = {
    'section-preset': 0, 'section-style': 1, 'section-composition': 2,
    'section-garment': 3, 'section-material': 4, 'section-garmentdetail': 5,
    'section-body': 6, 'section-pose': 7, 'section-extra': 8,
    'section-lighting': 9, 'section-background': 10, 'section-camera': 11,
    'section-ratio': 12, 'section-output': 13,
  };
}

const issues = [];

function issue(page, message) {
  issues.push(`${page}: ${message}`);
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return match ? match[1] : null;
}

function tags(source, tagName) {
  return [...source.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map(match => match[0]);
}

function idsIn(source) {
  return new Set([...source.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(match => match[1]));
}

function sliceBalanced(source, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = openIndex; i < source.length; i += 1) {
    const char = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(openIndex, i + 1);
    }
  }
  return null;
}

function objectKeys(source, variableName) {
  const marker = `const ${variableName} = {`;
  const start = source.indexOf(marker);
  if (start === -1) return null;
  const literal = sliceBalanced(source, start + marker.length - 1);
  if (!literal) return null;
  try {
    const keys = new Set(Object.keys(vm.runInNewContext(`(${literal});`, {})));
    const appendRe = new RegExp(`${variableName}\\.([A-Za-z0-9_]+)\\s*=\\s*\\{`, 'g');
    let match;
    while ((match = appendRe.exec(source))) keys.add(match[1]);
    return keys;
  } catch {
    return null;
  }
}

function radioGroups(source) {
  const groups = new Map();
  for (const tag of tags(source, 'input')) {
    if ((attr(tag, 'type') || '').toLowerCase() !== 'radio') continue;
    const name = attr(tag, 'name');
    const value = attr(tag, 'value');
    if (!name || value === null) continue;
    if (!groups.has(name)) groups.set(name, { values: new Set(), checked: 0 });
    const group = groups.get(name);
    group.values.add(value);
    if (/\bchecked\b/i.test(tag)) group.checked += 1;
  }
  return groups;
}

function selectValues(source) {
  const values = new Map();
  for (const match of source.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi)) {
    const id = attr(match[0].slice(0, match[0].indexOf('>') + 1), 'id');
    if (!id) continue;
    values.set(id, new Set([...match[2].matchAll(/<option\b[^>]*value\s*=\s*["']([^"']+)["']/gi)].map(item => item[1])));
  }
  return values;
}

function checkRequiredNodes(page, source, idSet) {
  for (const id of ['generateBtn', 'copyBtn', 'outputWrap']) {
    if (!idSet.has(id)) issue(page, `missing required UI id #${id}`);
  }
  if (!idSet.has('outputText') && !idSet.has('output')) issue(page, 'missing output target (#outputText or #output)');
  for (const id of ['generateBtn', 'copyBtn', 'outputWrap']) {
    const count = (source.match(new RegExp(`\\bid\\s*=\\s*["']${id}["']`, 'g')) || []).length;
    if (count !== 1) issue(page, `UI id #${id} appears ${count} times`);
  }
  if (!source.includes(`getElementById('generateBtn').addEventListener`)
    && !source.includes('getElementById("generateBtn").addEventListener')) {
    issue(page, 'generate button has no click handler');
  }
  if (!source.includes(`getElementById('copyBtn').addEventListener`)
    && !source.includes('getElementById("copyBtn").addEventListener')) {
    issue(page, 'copy button has no click handler');
  }
  const writesOutput = /\b(?:outputText|output)\.(?:value|textContent|innerHTML)\s*=/.test(source)
    || /getElementById\(['"](?:outputText|output)['"]\)\.(?:value|textContent|innerHTML)\s*=/.test(source);
  if (!writesOutput) {
    issue(page, 'generation code does not assign an output value');
  }
}

function checkRadioReferences(page, source, groups, inputNames, idSet, selects) {
  const checkName = (name, origin) => {
    if (!inputNames.has(name)) issue(page, `${origin} references missing input group "${name}"`);
  };
  for (const match of source.matchAll(/(?:selected|getAllRadioValues)\(['"]([^'"]+)['"]\)/g)) {
    checkName(match[1], 'radio helper');
  }
  for (const match of source.matchAll(/setRadioValue\(['"]([^'"]+)['"]\s*,/g)) {
    checkName(match[1], 'setRadioValue');
  }
  for (const match of source.matchAll(/input\[name=["']([^"'$]+)["'][^\]]*\]:checked/g)) {
    checkName(match[1], 'querySelector');
  }
  for (const match of source.matchAll(/(?:setRadioCardValue|setSelectedCardValue|setSelectedPoseValue|setSelectedChipValue|setMultiChipValues)\(['"]([^'"]+)['"]/g)) {
    if (!idSet.has(match[1])) issue(page, `card helper references missing container #${match[1]}`);
  }
  for (const match of source.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g)) {
    if (!idSet.has(match[1])) issue(page, `script references missing DOM id #${match[1]}`);
  }
  for (const [id, values] of selects) {
    if (!values.size) issue(page, `select #${id} has no option values`);
  }
}

function checkInitialRadioState(page, groups) {
  const optionalGroups = new Set(['themePreset', 'riskThemePreset']);
  for (const [name, group] of groups) {
    if (optionalGroups.has(name)) continue;
    if (group.checked !== 1) issue(page, `radio group "${name}" has ${group.checked} initial checked values`);
  }
}

function checkChoiceGroups(page, source, groups) {
  for (const match of source.matchAll(/data-choice\s*=\s*["']([^"']+)["']/gi)) {
    const name = match[1];
    if (!groups.has(name) && !source.includes(`name="${name}"`)) {
      issue(page, `data-choice group "${name}" has no matching input name`);
    }
  }
}

function checkCheckboxContracts(page, source) {
  if (!['chinese-classical.html', 'japanese-kimono.html', 'korean-hanbok.html'].includes(page)) return;
  const materialInputs = tags(source, 'input').filter(tag => (
    (attr(tag, 'type') || '').toLowerCase() === 'checkbox' && attr(tag, 'name') === 'materials'
  ));
  if (materialInputs.length < 2) issue(page, 'materials checkbox group is incomplete');
  if (!source.includes("selectedCheckboxes('materials')")) {
    issue(page, 'materials checkbox group is not read by generation logic');
  }
  if (!/selectedCheckboxes\('materials'\)\.length\s*>\s*2/.test(source)) {
    issue(page, 'materials checkbox group has no max-two selection guard');
  }
}

function sectionBlock(source, className) {
  const start = source.indexOf(`<section class="${className}">`);
  if (start === -1) return null;
  const end = source.indexOf('</section>', start);
  return end === -1 ? source.slice(start) : source.slice(start, end);
}

function checkClassicalPageContract(page, source) {
  if (!['chinese-classical.html', 'japanese-kimono.html', 'korean-hanbok.html'].includes(page)) return;

  const placements = [
    ['section-garment', 'customGarment'],
    ['section-material', 'customMaterial'],
    ['section-pose', 'customPose'],
    ['section-lighting', 'colorNote'],
    ['section-background', 'customBackground'],
  ];
  for (const [className, id] of placements) {
    const block = sectionBlock(source, className);
    if (!block || !block.includes(`id="${id}"`)) {
      issue(page, `#${id} is not placed in .${className}`);
    }
  }

  const extra = sectionBlock(source, 'section-extra');
  if (!extra || !extra.includes('id="intensity"') || !extra.includes('id="extraNote"')) {
    issue(page, '08 自訂要求 must contain #intensity and #extraNote');
  }
  for (const id of ['customGarment', 'customMaterial', 'customBackground', 'customPose', 'colorNote']) {
    if (extra?.includes(`id="${id}"`)) issue(page, `08 自訂要求 still contains #${id}`);
  }

  const background = sectionBlock(source, 'section-background');
  if (!background?.includes('value="pureWhiteBackground"') || !source.includes('pureWhiteBackground:')) {
    issue(page, 'background contract is missing pureWhiteBackground UI or data');
  }
  if (/10A|10B|whitespaceData|whitespace direction/.test(source)) {
    issue(page, 'background section contains removed 10A/10B or whitespace controls');
  }
}

function checkGarmentVariationLayerContract(page, source, groups) {
  const variationGroups = ['garmentChestVariation', 'garmentWaistVariation', 'garmentShoulderVariation'];
  if (!variationGroups.every(name => groups.has(name))) return;

  const layerGroup = groups.get('garmentLayer');
  const expectedLayers = ['layer0', 'layer3', 'layer6', 'layer9', 'random'];
  if (!layerGroup) {
    issue(page, 'three-zone garment core is missing garmentLayer');
    return;
  }
  for (const value of expectedLayers) {
    if (!layerGroup.values.has(value)) issue(page, `garmentLayer is missing "${value}"`);
  }
  if (!source.includes('GARMENT_VARIATION_LAYER_ZONES')) {
    issue(page, 'garmentLayer has no layer-to-zone mapping');
  }
  if (!source.includes('HB_GARMENT_CORE.chooseFreeZones') && (!source.includes('activeZones') || !source.includes('freeZones'))) {
    issue(page, 'garmentLayer random logic does not preserve active zones and fill only free zones');
  }
  if (!source.includes('服裝改造核心')) {
    issue(page, 'three-zone garment UI is not labeled 服裝改造核心');
  }
}

function checkGarmentDetailLayerContract(page, source, groups) {
  const detailGroups = ['chestDetail', 'waistSideDetail', 'shoulderDetail'];
  if (!detailGroups.every(name => groups.has(name))) return;

  const layerGroup = groups.get('garmentLayer');
  const expectedLayers = ['layer0', 'layer3', 'layer6', 'layer9', 'random'];
  if (!layerGroup) {
    issue(page, 'three-zone garment detail core is missing garmentLayer');
    return;
  }
  for (const value of expectedLayers) {
    if (!layerGroup.values.has(value)) issue(page, `garmentLayer is missing "${value}"`);
  }
  if (!source.includes('GARMENT_DETAIL_LAYER_ZONES')) {
    issue(page, 'garment detail Layer has no layer-to-zone mapping');
  }
  if (!source.includes('GARMENT_DETAIL_RANDOM_POOLS')) {
    issue(page, 'garment detail random pool is missing');
  }
  if (!source.includes('HB_GARMENT_CORE.randomKeys') || !source.includes('HB_GARMENT_CORE.chooseFreeZones')) {
    issue(page, 'garment detail random logic is not using the shared garment-core helper');
  }
  if (!source.includes('服裝改造核心')) {
    issue(page, 'three-zone garment detail UI is not labeled 服裝改造核心');
  }
  for (const field of detailGroups) {
    if (!source.includes(`name="${field}" value="none"`)) issue(page, `${field} is missing the none option`);
  }
}

function checkPresetButtons(page, source) {
  const mappings = [
    ['data-template', 'themeTemplates'],
    ['data-travel-preset', 'QUICK_TRAVEL_PRESETS'],
    ['data-magazine-preset', 'QUICK_MAGAZINE_PRESETS'],
  ];
  for (const [attribute, variableName] of mappings) {
    const keys = objectKeys(source, variableName);
    for (const tag of tags(source, 'button')) {
      const key = attr(tag, attribute);
      if (key && (!keys || !keys.has(key))) issue(page, `${attribute}="${key}" has no ${variableName} entry`);
    }
  }
}

function checkEditorialTemplateContract(page, source, groups) {
  if (page !== 'editorial-identity.html') return;
  const expectedCounts = { fashion: 6, beauty: 4, animeGame: 4, cinema: 7, photobook: 5, travel: 5 };
  const templateButtons = tags(source, 'button').filter(tag => attr(tag, 'data-template'));
  const templateKeys = new Set(templateButtons.map(tag => attr(tag, 'data-template')));
  const presetKeys = objectKeys(source, 'themeTemplates');
  if (templateButtons.length !== 31) issue(page, `expected 31 template buttons, found ${templateButtons.length}`);
  if (!presetKeys || presetKeys.size !== 31) issue(page, `expected 31 themeTemplates entries, found ${presetKeys ? presetKeys.size : 0}`);
  for (const key of templateKeys) {
    if (!presetKeys?.has(key)) issue(page, `template button "${key}" has no themeTemplates entry`);
  }
  for (const key of presetKeys || []) {
    if (!templateKeys.has(key)) issue(page, `themeTemplates entry "${key}" has no template button`);
  }
  const groupMatches = [...source.matchAll(/<div class="template-group" data-template-group="([^"]+)"/g)];
  if (groupMatches.length !== Object.keys(expectedCounts).length) issue(page, `expected ${Object.keys(expectedCounts).length} template groups, found ${groupMatches.length}`);
  for (let i = 0; i < groupMatches.length; i += 1) {
    const category = groupMatches[i][1];
    const start = groupMatches[i].index;
    const end = i + 1 < groupMatches.length ? groupMatches[i + 1].index : source.length;
    const count = (source.slice(start, end).match(/data-template="[^"]+"/g) || []).length;
    if (expectedCounts[category] === undefined) issue(page, `unknown template group "${category}"`);
    else if (count !== expectedCounts[category]) issue(page, `${category} group expected ${expectedCounts[category]} templates, found ${count}`);
  }
  for (const required of ['copyStyle', 'graphicAccent', 'metadata', 'creditLine', 'copyStyleData', 'graphicAccentData']) {
    if (!source.includes(required)) issue(page, `editorial template contract missing ${required}`);
  }
  if (!source.includes('do not invent products') || !source.includes('non-destructive editorial')) {
    issue(page, 'editorial source-lock and factual-content guard is incomplete');
  }
  for (const forbidden of ['Spider-Man', 'Marvel', 'psychological thriller', 'black crime', 'horror']) {
    if (source.toLowerCase().includes(forbidden.toLowerCase())) issue(page, `editorial source contains forbidden term "${forbidden}"`);
  }
}

function checkChineseClassicalTemplateContract(page, source) {
  if (page !== 'chinese-classical.html') return;
  const templateButtons = tags(source, 'button').filter(tag => attr(tag, 'data-template'));
  const templateKeys = new Set(templateButtons.map(tag => attr(tag, 'data-template')));
  const presetKeys = objectKeys(source, 'themeTemplates');
  if (templateButtons.length !== 18) issue(page, `expected 18 template buttons, found ${templateButtons.length}`);
  if (!presetKeys || presetKeys.size !== 18) issue(page, `expected 18 themeTemplates entries, found ${presetKeys ? presetKeys.size : 0}`);
  for (const key of templateKeys) {
    if (!presetKeys?.has(key)) issue(page, `template button "${key}" has no themeTemplates entry`);
  }
  for (const key of presetKeys || []) {
    if (!templateKeys.has(key)) issue(page, `themeTemplates entry "${key}" has no template button`);
  }
  for (const label of ['朝代古典', '新式改良', '唯美古風寫真']) {
    if (!source.includes(`class="group-title">${label}</div>`)) issue(page, `missing classical template group "${label}"`);
  }
}

const themeCopyContracts = {
  'fantasy-fashion.html': '奇幻材質與世界觀元素',
  'chinese-classical.html': '傳統材質與中式元素',
  'xianxia.html': '仙俠材質與修真元素',
  'anime-character.html': '動漫材質與渲染特效',
  'flower-fairy.html': '花卉材質與仙子元素',
  'isekai-fantasy.html': '異世界材質與幻想元素',
  'floral-sweet.html': '花卉材質與甜美元素',
  'gala-socialite.html': '晚宴材質與珠寶元素',
  'kpop-idol.html': '舞台材質與偶像元素',
  'ancient-goddess.html': '神話材質與古文明元素',
  'japanese-kimono.html': '日本材質與和風元素',
  'korean-hanbok.html': '韓國材質與韓服元素',
};

function checkThemeCopyContract(page, source) {
  const expectedTitle = themeCopyContracts[page];
  if (!expectedTitle) return;
  if (!source.includes(`class="section-title">${expectedTitle}</div>`)) {
    issue(page, `material section title should be "${expectedTitle}"`);
  }
  if (source.includes('主題材質與奇幻元素')) {
    issue(page, 'generic material section title remains on a theme-specific page');
  }
  const materialBlock = sectionBlock(source, 'section-material');
  if (materialBlock && !/data-choice="materials?"/.test(materialBlock)) {
    issue(page, 'theme-specific material section is not connected to the material choice group');
  }
}

function checkHomeCopyContract(page, source) {
  if (page !== 'index.html') return;
  for (const stale of ['真人旅拍感 × 雜誌封面氣場', '24種服裝與24種背景', '24種服裝與24種校園決戰背景', '四組十五套']) {
    if (source.includes(stale)) issue(page, `stale homepage copy remains: "${stale}"`);
  }
  for (const required of ['亞洲傳統服飾', '奇幻世界觀', '動漫角色', '編輯視覺設計', '四組十七套']) {
    if (!source.includes(required)) issue(page, `homepage description is missing "${required}"`);
  }
}

function checkVisualOrder(page, source) {
  const contract = visualOrderContracts[page];
  if (!contract) return;
  for (const [className, expectedOrder] of Object.entries(contract)) {
    const match = source.match(new RegExp(`\\.${className}\\s*\\{\\s*order\\s*:\\s*(-?\\d+)\\s*;`));
    if (!match) {
      issue(page, `missing visual order rule for .${className}`);
      continue;
    }
    const actualOrder = Number(match[1]);
    if (actualOrder !== expectedOrder) {
      issue(page, `visual order .${className} is ${actualOrder}, expected ${expectedOrder}`);
    }
  }
}

for (const page of pages) {
  const source = fs.readFileSync(path.join(root, page), 'utf8');
  const idSet = idsIn(source);
  const groups = radioGroups(source);
  const inputNames = new Set(tags(source, 'input').map(tag => attr(tag, 'name')).filter(Boolean));
  checkRequiredNodes(page, source, idSet);
  checkRadioReferences(page, source, groups, inputNames, idSet, selectValues(source));
  checkInitialRadioState(page, groups);
  checkChoiceGroups(page, source, groups);
  checkCheckboxContracts(page, source);
  checkClassicalPageContract(page, source);
  checkGarmentVariationLayerContract(page, source, groups);
  checkGarmentDetailLayerContract(page, source, groups);
  checkPresetButtons(page, source);
  checkEditorialTemplateContract(page, source, groups);
  checkChineseClassicalTemplateContract(page, source);
  checkThemeCopyContract(page, source);
  checkHomeCopyContract(page, source);
  checkVisualOrder(page, source);
  console.log(`checked ${page}: ${groups.size} radio groups, ${idSet.size} ids`);
}

console.log(`\nUI flow issues: ${issues.length}`);
if (issues.length) {
  for (const item of issues) console.log(`ISSUE: ${item}`);
  process.exitCode = 1;
} else {
  console.log('PASS UI flow contract: required controls, radio references, initial state, and one-click mappings are consistent.');
}
