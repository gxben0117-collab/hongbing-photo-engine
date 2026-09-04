import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lightingWindow = {};
const lightingSource = fs.readFileSync(path.join(root, 'assets/lighting-system.js'), 'utf8');
vm.runInNewContext(lightingSource, { window: lightingWindow });

const system = lightingWindow.HB_LIGHTING_SYSTEM;
const requiredKeys = [
  'venetianBlindShadowStripe',
  'hardArchitecturalShadowBlock',
  'dappledFoliageGradientShadow',
  'selfSilhouetteWallDouble',
  'warmCoolSplitAmbient'
];
const pageRequirements = {
  'magazine.html': ['venetianBlindShadowStripe', 'hardArchitecturalShadowBlock', 'warmCoolSplitAmbient'],
  'modern-portrait.html': ['venetianBlindShadowStripe', 'hardArchitecturalShadowBlock', 'dappledFoliageGradientShadow', 'warmCoolSplitAmbient'],
  'luxury-lifestyle.html': ['venetianBlindShadowStripe', 'hardArchitecturalShadowBlock', 'dappledFoliageGradientShadow', 'warmCoolSplitAmbient'],
  'travel.html': ['hardArchitecturalShadowBlock', 'dappledFoliageGradientShadow', 'warmCoolSplitAmbient'],
  'chinese-classical.html': ['hardArchitecturalShadowBlock', 'dappledFoliageGradientShadow', 'venetianBlindShadowStripe'],
  'japanese-kimono.html': ['venetianBlindShadowStripe', 'dappledFoliageGradientShadow'],
  'bridal-editorial.html': ['dappledFoliageGradientShadow', 'hardArchitecturalShadowBlock'],
  'fantasy-fashion.html': requiredKeys
};
const templateRequirements = {
  'magazine.html': 'architecturalShadowPortrait',
  'modern-portrait.html': 'architecturalShadowWallEditorial',
  'luxury-lifestyle.html': 'warmCoolLibraryLifestyle',
  'travel.html': 'architecturalShadowPortrait',
  'chinese-classical.html': 'cinnabarArchitecturalShadow',
  'japanese-kimono.html': 'japaneseArchitecturalShadow',
  'bridal-editorial.html': 'dappledGardenLaceBride'
};
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

check(system?.version === 'v1', 'lighting system did not initialise at version v1');
for (const key of requiredKeys) {
  const item = system?.catalog?.[key];
  check(item && item.label && item.prompt, `catalog entry is incomplete: ${key}`);
  check(!/watermark|brand text|face swap|child|underage/i.test(item?.prompt || ''), `catalog entry contains a forbidden identity or branding term: ${key}`);
}

for (const [page, keys] of Object.entries(pageRequirements)) {
  const source = fs.readFileSync(path.join(root, page), 'utf8');
  check(source.includes('assets/lighting-system.js'), `${page} does not load the shared lighting system`);
  for (const key of keys) check(source.includes(`value="${key}"`), `${page} is missing the visible lighting option: ${key}`);
  check(source.includes('HB_LIGHTING_SYSTEM?.resolve'), `${page} does not resolve page lighting through the shared catalog`);
}

for (const [page, template] of Object.entries(templateRequirements)) {
  const source = fs.readFileSync(path.join(root, page), 'utf8');
  check(source.includes(template), `${page} is missing lighting template: ${template}`);
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log(`PASS shared lighting catalog: ${requiredKeys.length} techniques`);
console.log(`PASS page lighting integration: ${Object.keys(pageRequirements).length} pages`);
console.log(`PASS lighting templates: ${Object.keys(templateRequirements).length} templates`);
