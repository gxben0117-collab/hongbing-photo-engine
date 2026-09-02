import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function fail(message) {
  failures.push(message);
  console.error('FAIL ' + message);
}

function pass(message) {
  console.log('PASS ' + message);
}

const manifestWindow = {};
vm.runInNewContext(read('assets/style-reference-batch-2026-09-02-second.js'), { window: manifestWindow });
const manifest = manifestWindow.HB_STYLE_REFERENCE_BATCH_2026_09_02_SECOND;
if (!manifest) fail('second 2026-09-02 style-reference manifest is missing');

const themeWindow = {};
vm.runInNewContext(read('assets/theme-registry.js'), { window: themeWindow });
const themeRegistry = themeWindow.HB_THEME_REGISTRY || {};

const expectedCount = manifest?.expectedCount || 0;
const expectedIds = new Set(Array.from({ length: expectedCount }, (_, index) => index + 1));
const clusterEntries = Object.entries(manifest?.clusterIds || {});
const clusterIds = clusterEntries.flatMap(([, ids]) => ids);

if (expectedCount !== 22) fail('second batch expected source count should be 22, found ' + expectedCount);
else pass('second batch manifest expects 22 source images');

if (clusterIds.length !== expectedCount) {
  fail('second batch cluster coverage expected ' + expectedCount + ', found ' + clusterIds.length);
} else {
  pass('all second batch source ids are assigned to a cluster');
}

if (new Set(clusterIds).size !== clusterIds.length) fail('second batch source ids are duplicated across clusters');
else pass('second batch source ids are unique across clusters');

for (const id of clusterIds) {
  if (!expectedIds.has(id)) fail('second batch source id is outside 1-' + expectedCount + ': ' + id);
}

const sourceIds = Object.keys(manifest?.sourceFiles || {}).map(Number);
for (const id of expectedIds) {
  if (!sourceIds.includes(id)) fail('second batch source file is missing for id ' + id);
  if (!Object.prototype.hasOwnProperty.call(manifest?.ownerById || {}, id)) {
    fail('second batch primary owner is missing for id ' + id);
  }
}
if (sourceIds.length !== expectedCount) fail('second batch source file map contains ' + sourceIds.length + ' ids');
else pass('second batch source file map covers all 22 images');

const sourceNames = Object.values(manifest?.sourceFiles || {});
if (new Set(sourceNames).size !== sourceNames.length) fail('second batch source filenames are duplicated');
else pass('second batch source filenames are unique');

for (const [cluster, ids] of clusterEntries) {
  const owner = manifest.defaultOwnerByCluster?.[cluster];
  if (!owner) {
    fail('second batch cluster has no default owner: ' + cluster);
    continue;
  }
  if (!themeRegistry[owner]) fail('second batch cluster owner is not a formal page: ' + owner);
  else pass(cluster + ': ' + ids.length + ' images -> ' + owner);
  for (const id of ids) {
    if (manifest.ownerById?.[id] !== owner) {
      fail('second batch owner mismatch for ' + cluster + ' image ' + id);
    }
  }
}

const allowedActions = new Set(['record-only', 'candidate-only', 'reviewed']);
const specialCases = manifest.specialCases || [];
if (specialCases.length < 10) fail('second batch special-case record is incomplete');
else pass(specialCases.length + ' second batch special cases are documented');
for (const item of specialCases) {
  if (!expectedIds.has(item.id)) fail('second batch special case references unknown id ' + item.id);
  if (!allowedActions.has(item.action)) fail('unsupported second batch action for special case ' + item.id + ': ' + item.action);
  if (!item.reason) fail('second batch special case has no reason for id ' + item.id);
}

const adoptions = manifest.adoptionPlan || {};
const requiredAdoptions = [
  ['modernPortrait', 'teaShopSnapshot'],
  ['travel', 'coastalBicycleFloral'],
  ['fantasyFashion', 'crystalShardBeautyPortrait'],
  ['fantasyFashion', 'scarletGauzeFieldEditorial'],
  ['fantasyFashion', 'inkCalligraphyCouture']
];
for (const [cluster, key] of requiredAdoptions) {
  if (!adoptions[cluster]?.some(item => item.key === key)) fail('adoption plan is missing ' + cluster + '/' + key);
}
for (const cluster of ['luxuryLifestyle', 'magazineBeauty', 'animeCharacter', 'kpopIdol', 'doll']) {
  if (!adoptions.recordOnly?.includes(cluster)) fail('record-only plan is missing ' + cluster);
}
if (!adoptions.candidateOnly?.includes('chineseClassicalCandidate')) fail('candidate-only plan is missing Chinese classical cluster');

if (!String(manifest.corePolicy || '').includes('shared cores')) {
  fail('second batch core policy does not protect shared cores');
} else {
  pass('second batch core policy protects shared cores from source-specific leakage');
}

if ((manifest.sourcePromptFiles || []).length !== 0) fail('second batch should record that no prompt files were found');
else pass('second batch records no source prompt files');

if (failures.length) {
  console.error('\n' + failures.length + ' second style-reference batch check(s) failed.');
  process.exit(1);
}

console.log('\nAll second 2026-09-02 style-reference batch checks passed.');
