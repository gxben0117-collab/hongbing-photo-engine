import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const formalPages = [
  'travel.html', 'magazine.html', 'luxury-lifestyle.html', 'modern-portrait.html', 'extreme-sports.html', 'doll.html',
  'fantasy-fashion.html', 'chinese-classical.html', 'japanese-kimono.html', 'korean-hanbok.html',
  'xianxia.html', 'anime-character.html', 'flower-fairy.html', 'isekai-fantasy.html',
  'store-ad.html', 'floral-sweet.html', 'gala-socialite.html', 'festival-editorial.html', 'bridal-editorial.html', 'chinese-bridal.html',
  'kpop-idol.html', 'battle-academy.html', 'ancient-goddess.html', 'editorial-identity.html'
];
const failures = [];

function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

const themeWindow = {};
vm.runInNewContext(read('assets/theme-registry.js'), { window: themeWindow });
const registry = themeWindow.HB_THEME_REGISTRY || {};

for (const page of formalPages) {
  if (!fs.existsSync(path.join(root, page))) {
    fail(`formal page is missing: ${page}`);
    continue;
  }
  if (!registry[page]) fail(`formal page has no theme registry entry: ${page}`);
  else if (!registry[page].family || !registry[page].primaryIntent) fail(`theme registry entry is incomplete: ${page}`);
  else pass(`classified ${page} as ${registry[page].family}`);
}

for (const [page, entry] of Object.entries(registry)) {
  if (page === 'index.html') continue;
  if (!formalPages.includes(page)) fail(`registry points to an unregistered formal page: ${page}`);
  if (!Array.isArray(entry.allowed) || !entry.allowed.length) fail(`${page}: allowed scope is empty`);
  if (!Array.isArray(entry.forbidden) || !entry.forbidden.length) fail(`${page}: forbidden scope is empty`);
}

const coreSource = read('assets/core-prompt.js');
const rejectedSharedTerms = [
  'adult East Asian woman',
  'long black hair',
  'long natural dark hair',
  'soft red or rose-toned lips',
  'no dramatic cinematic lighting',
  'no animal ears',
  'no excessive pink'
];
for (const term of rejectedSharedTerms) {
  if (coreSource.toLowerCase().includes(term.toLowerCase())) fail(`shared core contains rejected style-specific term: ${term}`);
}
if (!coreSource.includes('modernPortraitCore') || !coreSource.includes('modernPortrait: modernPortraitCore')) {
  fail('modern portrait page core is not registered in assets/core-prompt.js');
} else {
  pass('modern portrait uses a page-scoped core assembly');
}
if (!coreSource.includes('extremeSportsCore') || !coreSource.includes('extremeSports: extremeSportsCore')) {
  fail('extreme sports page core is not registered in assets/core-prompt.js');
} else {
  pass('extreme sports uses a page-scoped core assembly');
}

const modernSource = read('modern-portrait.html');
const modernRequiredMarkers = [
  '現代寫真攝影', 'Modern Portrait Photography', 'const CORE = window.HB_CORE_PROMPT?.page?.modernPortrait || {};',
  'const sceneStoryData = {', 'const SCENE_POSE_POOLS =', 'AI判斷｜主題最佳姿勢',
  'AI 根據主題與場景判斷配色', 'name="camera" value="eyeLevelCover"', 'name="ratio" value="9:16"'
];
for (const marker of modernRequiredMarkers) {
  if (!modernSource.includes(marker)) fail(`modern-portrait.html missing required marker: ${marker}`);
}
const templateCount = (modernSource.match(/^[ \t]+[A-Za-z][A-Za-z0-9]*: \{ story:/gm) || []).length;
if (templateCount < 15) fail(`modern-portrait.html should have at least 15 complete templates, found ${templateCount}`);
else pass(`modern portrait has ${templateCount} complete templates`);

const extremeSource = read('extreme-sports.html');
const extremeRequiredMarkers = [
  '極限運動高速攝影', 'Extreme Sports High-Speed Photography', 'const CORE = window.HB_CORE_PROMPT?.page?.extremeSports',
  'name="sport" value="surfing"', 'name="sport" value="skiing"', 'name="sport" value="skateboarding"', 'name="sport" value="parkour"',
  'AI判斷｜主題最佳瞬間', 'name="camera" value="groundLevelTracking"', 'name="ratio" value="9:16"',
  'const environmentScaleData', 'Large-scale ocean response', 'Large-scale snow response', '【環境反應尺度】'
];
for (const marker of extremeRequiredMarkers) {
  if (!extremeSource.includes(marker)) fail(`extreme-sports.html missing required marker: ${marker}`);
}
const extremeTemplateCount = (extremeSource.match(/^[ \t]+[A-Za-z][A-Za-z0-9]*: \{ story:/gm) || []).length;
if (extremeTemplateCount < 44) fail(`extreme-sports.html should have at least 44 complete templates, found ${extremeTemplateCount}`);
else pass(`extreme sports has ${extremeTemplateCount} complete templates`);
for (const [sport, minimum] of Object.entries({ surfing: 12, skiing: 12, skateboarding: 10, parkour: 10 })) {
  const count = (extremeSource.match(new RegExp(`sport: '${sport}'`, 'g')) || []).length;
  if (count < minimum) fail(`extreme-sports.html should have at least ${minimum} ${sport} templates, found ${count}`);
  else pass(`extreme sports has ${count} ${sport} templates`);
}
for (const excluded of ['motorcycle', 'motorbike', 'motor racing', '重機賽車']) {
  if (new RegExp(`\\b${excluded}\\b`, 'i').test(extremeSource)) fail(`extreme-sports.html contains excluded motorcycle theme term: ${excluded}`);
}

const modernPositiveBlock = modernSource
  .replace(/<nav>[\s\S]*?<\/nav>/i, '')
  .replace(/<script src="assets\/core-prompt\.js"><\/script>/i, '')
  .replace(/<script src="assets\/garment-core\.js"><\/script>/i, '');
for (const term of ['xianxia', 'cyberpunk', 'mecha', 'magical aura', 'science fiction']) {
  if (new RegExp(`\\b${term}\\b`, 'i').test(modernPositiveBlock)) fail(`modern portrait positive scope contains unrelated theme term: ${term}`);
}

if (failures.length) {
  console.error(`\n${failures.length} classification check(s) failed.`);
  process.exit(1);
}

console.log('\nAll theme classification checks passed.');
