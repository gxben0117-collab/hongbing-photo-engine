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
vm.runInNewContext(read('assets/style-reference-batch-2026-09-02.js'), { window: manifestWindow });
const manifest = manifestWindow.HB_STYLE_REFERENCE_BATCH_2026_09_02;
if (!manifest) fail('2026-09-02 style-reference manifest is missing');

const themeWindow = {};
vm.runInNewContext(read('assets/theme-registry.js'), { window: themeWindow });
const themeRegistry = themeWindow.HB_THEME_REGISTRY || {};

const expectedCount = manifest?.expectedCount || 0;
const expectedIds = new Set(Array.from({ length: expectedCount }, (_, index) => index + 1));
const clusterEntries = Object.entries(manifest?.clusterIds || {});
const clusterIds = clusterEntries.flatMap(([, ids]) => ids);

if (expectedCount !== 38) fail('expected source count should remain 38, found ' + expectedCount);
else pass('manifest expects 38 source images');

if (clusterIds.length !== expectedCount) {
  fail('cluster coverage expected ' + expectedCount + ', found ' + clusterIds.length);
} else {
  pass('all source ids are assigned to a cluster');
}

if (new Set(clusterIds).size !== clusterIds.length) fail('source ids are duplicated across clusters');
else pass('source ids are unique across clusters');

for (const id of clusterIds) {
  if (!expectedIds.has(id)) fail('source id is outside 1-' + expectedCount + ': ' + id);
}

const sourceIds = Object.keys(manifest?.sourceFiles || {}).map(Number);
for (const id of expectedIds) {
  if (!sourceIds.includes(id)) fail('source file is missing for id ' + id);
  if (!Object.prototype.hasOwnProperty.call(manifest?.ownerById || {}, id)) {
    fail('primary owner is missing for id ' + id);
  }
}
if (sourceIds.length !== expectedCount) fail('source file map contains ' + sourceIds.length + ' ids');
else pass('source file map covers all 38 images');

const sourceNames = Object.values(manifest?.sourceFiles || {});
if (new Set(sourceNames).size !== sourceNames.length) fail('source filenames are duplicated');
else pass('source filenames are unique');

for (const [cluster, ids] of clusterEntries) {
  const owner = manifest.defaultOwnerByCluster?.[cluster];
  if (!owner) {
    fail('cluster has no default owner: ' + cluster);
    continue;
  }
  if (!themeRegistry[owner]) fail('cluster owner is not a formal page: ' + owner);
  else pass(cluster + ': ' + ids.length + ' images -> ' + owner);
  for (const id of ids) {
    if (manifest.ownerById?.[id] !== owner) {
      fail('owner mismatch for ' + cluster + ' image ' + id);
    }
  }
}

const allowedActions = new Set(['record-only', 'candidate-only', 'reviewed']);
const specialCases = manifest.specialCases || [];
if (specialCases.length < 7) fail('special-case record is incomplete');
else pass(specialCases.length + ' special cases are documented');
for (const item of specialCases) {
  if (!expectedIds.has(item.id)) fail('special case references unknown id ' + item.id);
  if (!allowedActions.has(item.action)) fail('unsupported action for special case ' + item.id + ': ' + item.action);
  if (!item.reason) fail('special case has no reason for id ' + item.id);
}

const bridalAdoptions = manifest.adoptionPlan?.bridal || [];
for (const key of ['coastalDaylight', 'coastalHighKeyDaylight', 'backViewTrainEditorial', 'backViewOverShoulder', 'threeBridalEditorialPresets']) {
  if (!bridalAdoptions.includes(key)) fail('bridal adoption plan is missing ' + key);
}
if (manifest.adoptionPlan?.modernPortrait !== 'record-only') fail('modern portrait should remain record-only');
if (manifest.adoptionPlan?.travel !== 'record-only') fail('travel should remain record-only');
if (manifest.adoptionPlan?.magazine !== 'record-only') fail('magazine should remain record-only');
if (manifest.adoptionPlan?.chineseClassical !== 'candidate-only') fail('Chinese classical candidate should remain candidate-only');

if (!String(manifest.corePolicy || '').includes('shared cores')) {
  fail('core policy does not protect shared cores');
} else {
  pass('core policy protects shared cores from source-specific leakage');
}

if (failures.length) {
  console.error('\n' + failures.length + ' style-reference batch check(s) failed.');
  process.exit(1);
}

console.log('\nAll 2026-09-02 style-reference batch checks passed.');
