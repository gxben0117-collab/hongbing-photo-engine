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
vm.runInNewContext(read('assets/style-reference-batch-2026-09-04-fifth.js'), { window: manifestWindow });
const manifest = manifestWindow.HB_STYLE_REFERENCE_BATCH_2026_09_04_FIFTH;
if (!manifest) fail('fifth 2026-09-04 style-reference manifest is missing');

const themeWindow = {};
vm.runInNewContext(read('assets/theme-registry.js'), { window: themeWindow });
const themeRegistry = themeWindow.HB_THEME_REGISTRY || {};
const expectedCount = manifest?.expectedCount || 0;
const expectedIds = new Set(Array.from({ length: expectedCount }, (_, index) => index + 1));
const clusterEntries = Object.entries(manifest?.clusterIds || {});
const clusterIds = clusterEntries.flatMap(([, ids]) => ids);

if (expectedCount !== 49) fail('fifth batch expected source count should be 49, found ' + expectedCount);
else pass('fifth batch manifest expects 49 source images');

if (clusterIds.length !== expectedCount) fail('fifth batch cluster coverage expected ' + expectedCount + ', found ' + clusterIds.length);
else pass('all fifth batch source ids are assigned to a cluster');

if (new Set(clusterIds).size !== clusterIds.length) fail('fifth batch source ids are duplicated across clusters');
else pass('fifth batch source ids are unique across clusters');

for (const id of clusterIds) {
  if (!expectedIds.has(id)) fail('fifth batch source id is outside 1-' + expectedCount + ': ' + id);
}

const sourceIds = Object.keys(manifest?.sourceFiles || {}).map(Number);
for (const id of expectedIds) {
  if (!sourceIds.includes(id)) fail('fifth batch source file is missing for id ' + id);
  if (!Object.prototype.hasOwnProperty.call(manifest?.ownerById || {}, id)) fail('fifth batch primary owner is missing for id ' + id);
}
if (sourceIds.length !== expectedCount) fail('fifth batch source file map contains ' + sourceIds.length + ' ids');
else pass('fifth batch source file map covers all 49 images');

const sourceNames = Object.values(manifest?.sourceFiles || {});
if (new Set(sourceNames).size !== sourceNames.length) fail('fifth batch source filenames are duplicated');
else pass('fifth batch source filenames are unique');

const idToCluster = {};
for (const [cluster, ids] of clusterEntries) {
  const owner = manifest.defaultOwnerByCluster?.[cluster];
  if (!owner) {
    fail('fifth batch cluster has no default owner: ' + cluster);
    continue;
  }
  if (!themeRegistry[owner]) fail('fifth batch cluster owner is not a formal page: ' + owner);
  else pass(cluster + ': ' + ids.length + ' images -> ' + owner);
  for (const id of ids) {
    idToCluster[id] = cluster;
    if (manifest.ownerById?.[id] !== owner) fail('fifth batch owner mismatch for ' + cluster + ' image ' + id);
  }
}

const allowedActions = new Set(['record-only', 'candidate-only', 'reviewed']);
const specialCases = manifest.specialCases || [];
if (specialCases.length < 10) fail('fifth batch special-case record is incomplete');
else pass(specialCases.length + ' fifth batch special cases are documented');
for (const item of specialCases) {
  if (!expectedIds.has(item.id)) fail('fifth batch special case references unknown id ' + item.id);
  if (!allowedActions.has(item.action)) fail('unsupported fifth batch action for special case ' + item.id + ': ' + item.action);
  if (!item.reason) fail('fifth batch special case has no reason for id ' + item.id);
}

const adoptions = manifest.adoptionPlan || {};
for (const [cluster, items] of Object.entries(adoptions)) {
  if (cluster === 'recordOnly' || cluster === 'candidateOnly') continue;
  const owner = manifest.defaultOwnerByCluster?.[cluster];
  if (!owner) {
    fail('adoption plan references unknown cluster: ' + cluster);
    continue;
  }
  const pageSource = read(owner);
  for (const item of items) {
    if (!item.key || !pageSource.includes(item.key)) fail('adoption template is missing from ' + owner + ': ' + item.key);
    for (const id of item.sourceIds || []) {
      if (!expectedIds.has(id)) fail('adoption ' + cluster + '/' + item.key + ' references unknown source id ' + id);
      if (idToCluster[id] !== cluster) fail('adoption ' + cluster + '/' + item.key + ' references source id ' + id + ' from ' + idToCluster[id]);
    }
  }
}

for (const cluster of ['fantasy', 'animeCharacter', 'magazineEditorial']) {
  if (!adoptions.recordOnly?.includes(cluster)) fail('record-only plan is missing ' + cluster);
}

if (!String(manifest.corePolicy || '').includes('shared cores')) fail('fifth batch core policy does not protect shared cores');
else pass('fifth batch core policy protects shared cores from source-specific leakage');

if ((manifest.sourcePromptFiles || []).length !== 0) fail('fifth batch should record that no prompt files were found');
else pass('fifth batch records no source prompt files');

if (failures.length) {
  console.error('\n' + failures.length + ' fifth style-reference batch check(s) failed.');
  process.exit(1);
}

console.log('\nAll fifth 2026-09-04 style-reference batch checks passed.');
