import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

// Static regression checks for the contract between visible controls and the
// one-click / generation code. This intentionally avoids a browser dependency.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'travel.html', 'magazine.html', 'luxury-lifestyle.html', 'modern-portrait.html', 'doll.html', 'fantasy-fashion.html',
  'chinese-classical.html', 'japanese-kimono.html', 'korean-hanbok.html',
  'xianxia.html', 'anime-character.html', 'flower-fairy.html',
  'isekai-fantasy.html', 'store-ad.html', 'floral-sweet.html',
  'gala-socialite.html', 'bridal-editorial.html', 'kpop-idol.html', 'battle-academy.html',
  'ancient-goddess.html', 'editorial-identity.html',
];

const coreWindow = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/core-prompt.js'), 'utf8'), { window: coreWindow });
const TOOL_PAGE_CONTRACTS = coreWindow.HB_TOOL_CONTRACTS || {};

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
  'luxury-lifestyle.html': {
    'section-preset': 0, 'section-style': 1, 'section-scene': 2,
    'section-garment': 3, 'section-garment-variation': 4, 'section-body': 5,
    'section-pose': 6, 'section-interaction': 7, 'section-lighting': 8,
    'section-camera': 9, 'section-ratio': 10, 'section-extra': 11,
    'section-output': 12,
  },
  'modern-portrait.html': {
    'section-preset': 0, 'section-style': 1, 'section-scene': 2,
    'section-garment': 3, 'section-garment-variation': 4, 'section-body': 5,
    'section-pose': 6, 'section-interaction': 7, 'section-lighting': 8,
    'section-camera': 9, 'section-ratio': 10, 'section-extra': 11,
    'section-output': 12,
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
  'editorial-identity.html': {
    'editorial-preset': 0, 'editorial-layout': 1, 'editorial-placement': 2,
    'editorial-typography': 3, 'editorial-copy-style': 4, 'editorial-text': 5,
    'editorial-language': 6, 'editorial-graphic': 7, 'editorial-graphic-accent': 8,
    'editorial-color': 9, 'editorial-image-treatment': 10, 'editorial-print-finish': 11,
    'editorial-whitespace': 12, 'editorial-ratio': 13, 'editorial-extra': 14,
    'editorial-output': 15,
  },
};

// The shared portrait contract uses human-readable ratio values everywhere.
// Theme pages may append their own controls, but these shared values remain
// portable between tools and templates.
const SHARED_CAMERA_RATIO_PAGES = new Set([
  'travel.html', 'magazine.html', 'luxury-lifestyle.html', 'modern-portrait.html', 'fantasy-fashion.html', 'chinese-classical.html',
  'japanese-kimono.html', 'korean-hanbok.html', 'xianxia.html',
  'anime-character.html', 'flower-fairy.html', 'isekai-fantasy.html',
  'floral-sweet.html', 'gala-socialite.html', 'bridal-editorial.html',
  'kpop-idol.html', 'battle-academy.html', 'ancient-goddess.html',
]);
const SHARED_BODY_LAYER_PAGES = new Set([
  'magazine.html', 'luxury-lifestyle.html', 'modern-portrait.html', 'fantasy-fashion.html', 'chinese-classical.html',
  'japanese-kimono.html', 'korean-hanbok.html', 'xianxia.html',
  'anime-character.html', 'flower-fairy.html', 'isekai-fantasy.html',
  'floral-sweet.html', 'gala-socialite.html', 'bridal-editorial.html',
  'kpop-idol.html', 'battle-academy.html', 'ancient-goddess.html',
]);
const SHARED_CAMERA_VALUES = [
  'eyeLevelCover', 'lowAngleHero', 'highAngleOverhead', 'softFocusGlow',
  'beautyCloseUp', 'sideProfile', 'threeQuarterSide', 'topBeauty', 'distantHero',
];
const SHARED_PORTRAIT_BODY_VALUES = [
  'original', 'slight_waist', 'curvy_waist', 'fashion_tall', 'korean_idol', 'full_bust_cleavage',
];
const SHARED_RATIO_VALUES = ['9:16', '4:5', '1:1', '2:3', '3:4', '16:9', '4:3', '21:9'];
const SHARED_GARMENT_LAYER_VALUES = ['layer0', 'layer3', 'layer6', 'layer9', 'random'];
const AUTO_POSE_PAGES = new Set([
  'travel.html', 'magazine.html', 'luxury-lifestyle.html', 'modern-portrait.html', 'doll.html', 'fantasy-fashion.html',
  'chinese-classical.html', 'japanese-kimono.html', 'korean-hanbok.html',
  'xianxia.html', 'anime-character.html', 'flower-fairy.html',
  'isekai-fantasy.html', 'floral-sweet.html', 'gala-socialite.html',
  'bridal-editorial.html', 'kpop-idol.html', 'battle-academy.html',
  'ancient-goddess.html',
]);

const COLOR_SYSTEM_CONTRACTS = {
  'chinese-classical.html': 'colorPalette',
  'japanese-kimono.html': 'colorPalette',
  'korean-hanbok.html': 'colorPalette',
  'bridal-editorial.html': 'color',
  'editorial-identity.html': 'color',
};

function checkColorSystemContract(page, source, groups) {
  const groupName = COLOR_SYSTEM_CONTRACTS[page];
  if (!groupName) return;
  const group = groups.get(groupName);
  if (!group) {
    issue(page, `color system group "${groupName}" is missing`);
    return;
  }
  if (!group.values.has('aiThemeScenePalette')) {
    issue(page, 'color system is missing the AI theme-and-scene palette option');
  }
  const comboCount = (source.match(/class="name">搭配色｜/g) || []).length;
  if (comboCount < 5) issue(page, `color system needs at least 5 coordinated palette sets, found ${comboCount}`);
  if (!source.includes('AI 根據主題與場景判斷配色') && !source.includes('AI 根據主題與畫面判斷配色')) {
    issue(page, 'color system is missing visible AI palette wording');
  }
  if (!source.includes('aiThemeScenePalette:')) issue(page, 'color system data is missing the AI palette prompt');
}

function checkSharedPortraitControlContract(page, source, groups) {
  if (SHARED_CAMERA_RATIO_PAGES.has(page)) {
    const camera = groups.get('camera');
    const ratio = groups.get('ratio');
    if (!camera) issue(page, 'shared Fantasy camera group is missing');
    else for (const value of SHARED_CAMERA_VALUES) {
      if (!camera.values.has(value)) issue(page, `shared camera control is missing "${value}"`);
    }
    if (!ratio) issue(page, 'shared Fantasy ratio group is missing');
    else {
      for (const value of SHARED_RATIO_VALUES) {
        if (!ratio.values.has(value)) issue(page, `shared ratio control is missing "${value}"`);
      }
    }
  }

  if (!SHARED_BODY_LAYER_PAGES.has(page)) return;
  const body = groups.get('bodyShape');
  if (!body) issue(page, 'shared Fantasy body-shape group is missing');
  else for (const value of SHARED_PORTRAIT_BODY_VALUES) {
    if (!body.values.has(value)) issue(page, `shared body-shape control is missing "${value}"`);
  }

  const layer = groups.get('garmentLayer');
  if (!layer) issue(page, 'shared garment Layer group is missing');
  else for (const value of SHARED_GARMENT_LAYER_VALUES) {
    if (!layer.values.has(value)) issue(page, `shared garment Layer is missing "${value}"`);
  }

  if (page === 'bridal-editorial.html' && /85mm\s*婚紗人像|bridal85mm/i.test(source)) {
    issue(page, 'bridal page still contains the removed 85mm 婚紗人像 option');
  }
}

for (const page of ['xianxia.html', 'anime-character.html', 'isekai-fantasy.html', 'floral-sweet.html', 'gala-socialite.html', 'kpop-idol.html', 'ancient-goddess.html']) {
  visualOrderContracts[page] = {
    'section-preset': 0, 'section-style': 1, 'section-composition': 2,
    'section-garment': 3, 'section-material': 4, 'section-garmentdetail': 5,
    'section-body': 6, 'section-pose': 7, 'section-extra': 8,
    'section-lighting': 9, 'section-background': 10, 'section-camera': 11,
    'section-ratio': 12, 'section-output': 13,
  };
}

visualOrderContracts['bridal-editorial.html'] = {
  'section-preset': 0, 'section-style': 1, 'section-composition': 2,
  'section-garment': 3, 'section-material': 4, 'section-garment-variation': 5,
  'section-veil': 6, 'section-body': 7, 'section-pose': 8,
  'section-styling': 9, 'section-lighting': 10, 'section-background': 11,
  'section-extra': 12, 'section-camera': 13, 'section-ratio': 14,
  'section-output': 15,
};

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

function checkToolPageContract(page, source, groups, selects) {
  const contract = TOOL_PAGE_CONTRACTS[page];
  if (!contract) {
    issue(page, 'missing shared tool-page classification contract');
    return;
  }
  if (!source.includes('assets/core-prompt.js')) issue(page, 'page does not load the shared core contract asset');

  for (const control of contract.sharedControls || []) {
    const hasRadio = groups.has(control);
    const hasSelect = selects.has(control);
    if (!hasRadio && !hasSelect) issue(page, `contract control "${control}" is missing`);
  }

  const ratioGroup = groups.get('ratio');
  const ratioValues = ratioGroup ? ratioGroup.values : selects.get('ratio');
  if (ratioValues) {
    for (const value of contract.ratioValues || []) {
      if (!ratioValues.has(value)) issue(page, `contract ratio value "${value}" is missing`);
    }
  }
}

function checkAutoPoseContract(page, source, groups) {
  if (!AUTO_POSE_PAGES.has(page)) return;
  const pose = groups.get('pose');
  if (!pose) {
    issue(page, 'AI theme-fit pose control is missing the pose radio group');
    return;
  }
  if (!pose.values.has('auto')) issue(page, 'pose control is missing the "auto" option');
  if (!source.includes('AI判斷') && !source.includes('AI根據主題')) {
    issue(page, 'pose auto option is missing the visible AI theme-fit wording');
  }
  const hasPromptBinding = /const\s+(?:poseData|POSES|POSE_STYLES)\s*=\s*\{\s*auto:\s*window\.HB_CORE_PROMPT\?\.controls\?\.autoPose/.test(source)
    || source.includes('公仔比例自動選配最適合的姿勢');
  if (!hasPromptBinding) issue(page, 'pose auto option is not connected to an AI pose prompt');
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
  if (!['chinese-classical.html', 'japanese-kimono.html', 'korean-hanbok.html', 'bridal-editorial.html'].includes(page)) return;
  const materialInputs = tags(source, 'input').filter(tag => (
    (attr(tag, 'type') || '').toLowerCase() === 'checkbox' && attr(tag, 'name') === 'materials'
  ));
  if (materialInputs.length < 2) issue(page, 'materials checkbox group is incomplete');
  if (!source.includes("selectedCheckboxes('materials')") && !source.includes("selectedMany('materials')")) {
    issue(page, 'materials checkbox group is not read by generation logic');
  }
  if (!/selectedCheckboxes\('materials'\)\.length\s*>\s*2/.test(source) && !source.includes("applyMaxTwo('materials')")) {
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
  if (page === 'bridal-editorial.html') {
    if (source.includes("setRadioValue('garmentLayer', 'random')")) {
      issue(page, 'random selection must respect the user-selected garment Layer instead of forcing random');
    }
    if (!source.includes("resolveLayer(selected('garmentLayer')")) {
      issue(page, 'random selection must resolve the selected garment Layer');
    }
    if (!source.includes("getRadioValues('veil').filter(value => value !== 'transparentFaceVeil')")) {
      issue(page, 'transparentFaceVeil must be excluded from the normal random pool');
    }
    if (!source.includes('BRIDAL_VEIL_IDENTITY_PROTECTION')) {
      issue(page, 'bridal veil identity protection is missing');
    }
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
  if (!source.includes('原圖鎖定系統') || !source.includes('No outpainting') || !source.includes('never infer factual text')) {
    issue(page, 'editorial Stage 2 source-lock and factual-content guard is incomplete');
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
  if (templateButtons.length !== 26) issue(page, `expected 26 template buttons, found ${templateButtons.length}`);
  if (!presetKeys || presetKeys.size !== 26) issue(page, `expected 26 themeTemplates entries, found ${presetKeys ? presetKeys.size : 0}`);
  for (const key of templateKeys) {
    if (!presetKeys?.has(key)) issue(page, `template button "${key}" has no themeTemplates entry`);
  }
  for (const key of presetKeys || []) {
    if (!templateKeys.has(key)) issue(page, `themeTemplates entry "${key}" has no template button`);
  }
  for (const label of ['朝代古典', '新式改良', '唯美古風寫真', '青春古風寫真', '精品主視覺']) {
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
  'bridal-editorial.html': '婚紗工藝與材質',
};

const themeIntensityContracts = {
  'floral-sweet.html': {
    forbidden: ['material effects', 'material splash', 'floating particles', 'explosive'],
    required: ['floral'],
  },
  'gala-socialite.html': {
    forbidden: ['material effects', 'material splash', 'floating particles', 'explosive'],
    required: ['couture'],
  },
  'kpop-idol.html': {
    forbidden: ['material effects', 'material splash', 'floating particles', 'explosive'],
    required: ['idol', 'performance'],
  },
  'ancient-goddess.html': {
    forbidden: ['material effects', 'material splash', 'floating particles', 'explosive'],
    required: ['ceremonial', 'goddess', 'mythic'],
  },
  'flower-fairy.html': {
    forbidden: ['material effects', 'material splash', 'floating particles'],
    required: ['floral', 'fairy'],
  },
  'xianxia.html': {
    forbidden: ['material effects', 'material splash', 'floating particles'],
    required: ['xianxia', 'spiritual'],
  },
  'anime-character.html': {
    forbidden: ['material effects', 'material splash', 'floating particles'],
    required: ['anime', 'character'],
  },
  'isekai-fantasy.html': {
    forbidden: ['material effects', 'material splash', 'floating particles'],
    required: ['fantasy'],
  },
  'battle-academy.html': {
    forbidden: ['material effects', 'material splash', 'floating particles'],
    required: ['academy', 'combat', 'battle'],
  },
};

function intensityValues(source) {
  const values = new Set();
  const selectBlock = source.match(/<select\b[^>]*\bid=["']intensity["'][^>]*>[\s\S]*?<\/select>/i);
  if (selectBlock) {
    for (const match of selectBlock[0].matchAll(/<option\b[^>]*value\s*=\s*["']([^"']+)["']/gi)) values.add(match[1]);
  }
  for (const match of source.matchAll(/\bintensity\s*:\s*["']([^"']+)["']/g)) values.add(match[1]);
  return values;
}

function checkThemeIntensityContract(page, source) {
  const contract = themeIntensityContracts[page];
  if (!contract) return;
  const values = [...intensityValues(source)].map(value => value.toLowerCase());
  if (!values.length) {
    issue(page, 'theme intensity values are missing');
    return;
  }
  for (const forbidden of contract.forbidden) {
    if (values.some(value => value.includes(forbidden))) issue(page, `generic intensity phrase remains: "${forbidden}"`);
  }
  for (const required of contract.required) {
    if (!values.some(value => value.includes(required))) issue(page, `theme intensity values are missing a ${required} marker`);
  }
}

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
  for (const required of ['亞洲傳統服飾', '奇幻世界觀', '動漫角色', '編輯視覺設計', '四組十九套']) {
    if (!source.includes(required)) issue(page, `homepage description is missing "${required}"`);
  }
}

function checkVisualOrder(page, source) {
  const contract = visualOrderContracts[page];
  if (!contract) return;
  const sectionMatches = [...source.matchAll(/<section\b[^>]*\bclass=["']([^"']+)["'][^>]*>/gi)];
  const actualClasses = sectionMatches
    .map(match => match[1].split(/\s+/).find(className => Object.hasOwn(contract, className)))
    .filter(Boolean);
  const expectedClasses = Object.entries(contract)
    .sort(([, left], [, right]) => left - right)
    .map(([className]) => className);
  if (actualClasses.join('|') !== expectedClasses.join('|')) {
    issue(page, `DOM section order is ${actualClasses.join(' -> ')}, expected ${expectedClasses.join(' -> ')}`);
  }
}

for (const page of pages) {
  const source = fs.readFileSync(path.join(root, page), 'utf8');
  const idSet = idsIn(source);
  const groups = radioGroups(source);
  const inputNames = new Set(tags(source, 'input').map(tag => attr(tag, 'name')).filter(Boolean));
  checkRequiredNodes(page, source, idSet);
  checkToolPageContract(page, source, groups, selectValues(source));
  checkRadioReferences(page, source, groups, inputNames, idSet, selectValues(source));
  checkInitialRadioState(page, groups);
  checkChoiceGroups(page, source, groups);
  checkCheckboxContracts(page, source);
  checkClassicalPageContract(page, source);
  checkColorSystemContract(page, source, groups);
  checkGarmentDetailLayerContract(page, source, groups);
  checkPresetButtons(page, source);
  checkEditorialTemplateContract(page, source, groups);
  checkChineseClassicalTemplateContract(page, source);
  checkThemeCopyContract(page, source);
  checkThemeIntensityContract(page, source);
  checkHomeCopyContract(page, source);
  checkSharedPortraitControlContract(page, source, groups);
  checkAutoPoseContract(page, source, groups);
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
