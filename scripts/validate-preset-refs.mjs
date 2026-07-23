import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

// 檢查每頁的預設連動物件（QUICK_*_PRESETS / *_DEFAULTS / themeTemplates）裡
// 每一筆用到的每個欄位值，是否都能對到該頁當下真的存在的選項（radio value
// 或 <select><option> value）。這類物件是用精準字串比對來套用選項的，若
// 作者填的字串沒有逐字對到既有選項，套用時該欄位會靜默不生效、不會報錯
// （2026-07-22 fantasy 的 composition/intensity 就是這樣壞掉的）。純文字/
// vm 解析，沿用 build-prompt-preview.mjs 的手法，不需要 jsdom。

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function sliceBalancedBraces(source, openBraceIndex) {
  let depth = 0;
  let end = -1;
  for (let i = openBraceIndex; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) throw new Error(`Unbalanced braces starting at index ${openBraceIndex}`);
  return source.slice(openBraceIndex, end + 1);
}

// 有些物件在初始宣告後，還會用 `VAR.someKey = {...}` 追加條目（例如 travel.html
// 的 QUICK_TRAVEL_PRESETS.silkRoadBlueTiles），這裡一併掃出來合併，避免漏檢查。
function extractObjectLiteral(source, varName) {
  const startMarker = `const ${varName} = {`;
  const start = source.indexOf(startMarker);
  if (start === -1) return null;
  const objSource = sliceBalancedBraces(source, start + startMarker.length - 1);
  const combined = { ...vm.runInNewContext(`(${objSource});`, {}) };

  const appendRe = new RegExp(`${varName}\\.([A-Za-z0-9_]+) = \\{`, 'g');
  let m;
  while ((m = appendRe.exec(source))) {
    const braceIndex = m.index + m[0].length - 1;
    const entrySource = sliceBalancedBraces(source, braceIndex);
    combined[m[1]] = vm.runInNewContext(`(${entrySource});`, {});
  }
  return combined;
}

function liveRadioValues(source, fieldName) {
  const re = new RegExp(`name="${fieldName}" value="([^"]+)"`, 'g');
  const values = new Set();
  let m;
  while ((m = re.exec(source))) values.add(m[1]);
  return values;
}

function liveSelectOptionValues(source, selectId) {
  const selectMatch = source.match(new RegExp(`<select id="${selectId}">([\\s\\S]*?)</select>`));
  const values = new Set();
  if (!selectMatch) return values;
  const optRe = /<option value="([^"]+)">/g;
  let m;
  while ((m = optRe.exec(selectMatch[1]))) values.add(m[1]);
  return values;
}

function checkObject(pageLabel, objName, obj, fieldLive, issues, skipValues = new Set(['none', 'original'])) {
  if (!obj) { console.log(`  (skip: ${objName} not found)`); return; }
  console.log(`=== ${pageLabel}: ${objName} ===`);
  for (const [entryName, entry] of Object.entries(obj)) {
    for (const field of Object.keys(fieldLive)) {
      if (entry[field] === undefined) continue;
      const values = Array.isArray(entry[field]) ? entry[field] : [entry[field]];
      for (const v of values) {
        if (skipValues.has(v)) continue;
        if (!fieldLive[field].has(v)) {
          console.log(`  ISSUE: ${objName}."${entryName}" field "${field}"="${v}" not in live options`);
          issues.push({ page: pageLabel, obj: objName, entry: entryName, field, value: v });
        }
      }
    }
  }
  console.log(`  checked ${Object.keys(obj).length} entries`);
}

const issues = [];

// ===== travel.html =====
{
  const src = fs.readFileSync(path.join(root, 'travel.html'), 'utf8');
  const fieldLive = {
    composition: liveRadioValues(src, 'composition'),
    style: liveRadioValues(src, 'style'),
    ratio: liveRadioValues(src, 'ratio'),
    camera: liveRadioValues(src, 'camera'),
    lighting: liveRadioValues(src, 'lighting'),
    motion: liveRadioValues(src, 'motion'),
    media: liveRadioValues(src, 'media'),
    pose: liveRadioValues(src, 'pose'),
    costume: liveRadioValues(src, 'costume'),
    hair: liveRadioValues(src, 'hair'),
    prop: liveRadioValues(src, 'prop'),
  };
  checkObject('travel.html', 'QUICK_TRAVEL_PRESETS', extractObjectLiteral(src, 'QUICK_TRAVEL_PRESETS'), fieldLive, issues);
  checkObject('travel.html', 'TRAVEL_STYLE_PRESET_DEFAULTS', extractObjectLiteral(src, 'TRAVEL_STYLE_PRESET_DEFAULTS'), fieldLive, issues);
}

// ===== magazine.html =====
{
  const src = fs.readFileSync(path.join(root, 'magazine.html'), 'utf8');
  const fieldLive = {
    style: liveRadioValues(src, 'style'),
    bg: liveRadioValues(src, 'bg'),
    pose: liveRadioValues(src, 'pose'),
    framing: liveRadioValues(src, 'framing'),
    camera: liveRadioValues(src, 'camera'),
    motion: liveRadioValues(src, 'motion'),
    media: liveRadioValues(src, 'media'),
    skinTexture: liveRadioValues(src, 'skinTexture'),
    expression: liveRadioValues(src, 'expression'),
    lighting: liveRadioValues(src, 'lighting'),
    ratio: liveRadioValues(src, 'ratio'),
    makeup: liveRadioValues(src, 'makeup'),
    jewelry: liveRadioValues(src, 'jewelry'),
  };
  checkObject('magazine.html', 'QUICK_MAGAZINE_PRESETS', extractObjectLiteral(src, 'QUICK_MAGAZINE_PRESETS'), fieldLive, issues);
  checkObject('magazine.html', 'STYLE_PRESET_DEFAULTS', extractObjectLiteral(src, 'STYLE_PRESET_DEFAULTS'), fieldLive, issues);
  checkObject('magazine.html', 'THEME_PRESET_DEFAULTS', extractObjectLiteral(src, 'THEME_PRESET_DEFAULTS'), fieldLive, issues);
}

// ===== fantasy-fashion.html =====
{
  const src = fs.readFileSync(path.join(root, 'fantasy-fashion.html'), 'utf8');
  const fieldLive = {
    garment: liveRadioValues(src, 'garment'),
    material: liveRadioValues(src, 'material'),
    style: liveRadioValues(src, 'style'),
    composition: liveRadioValues(src, 'composition'),
    framing: liveRadioValues(src, 'framing'),
    pose: liveRadioValues(src, 'pose'),
    camera: liveRadioValues(src, 'camera'),
    lighting: liveRadioValues(src, 'lighting'),
    background: liveRadioValues(src, 'background'),
    ratio: liveRadioValues(src, 'ratio'),
    bodyShape: liveRadioValues(src, 'bodyShape'),
    intensity: liveSelectOptionValues(src, 'intensity'),
  };
  checkObject('fantasy-fashion.html', 'themeTemplates', extractObjectLiteral(src, 'themeTemplates'), fieldLive, issues);
}

// ===== anime-hero.html =====
// anime-hero.html builds its option cards dynamically from JS data objects
// (buildCards() renders Object.entries(dataObj)) instead of static radio
// markup, so live options here come from the data objects themselves rather
// than from liveRadioValues().
{
  const src = fs.readFileSync(path.join(root, 'anime-hero.html'), 'utf8');
  const keysOf = (varName) => new Set(Object.keys(extractObjectLiteral(src, varName) || {}));
  const outfitKeys = new Set([...keysOf('outfitBattle'), ...keysOf('outfitNormal'), ...keysOf('outfitHybrid')]);
  const fieldLive = {
    companion: keysOf('companionData'),
    interaction: keysOf('interactionData'),
    outfit: outfitKeys,
    body: keysOf('bodyData'),
    style: keysOf('styleData'),
    camera: keysOf('cameraData'),
    lighting: keysOf('lightingData'),
    background: keysOf('backgroundData'),
    fx: keysOf('fxData'),
    ratio: keysOf('ratioData'),
  };
  checkObject('anime-hero.html', 'presets', extractObjectLiteral(src, 'presets'), fieldLive, issues);
}

console.log(`\nTotal issues found: ${issues.length}`);
process.exit(issues.length === 0 ? 0 : 1);
