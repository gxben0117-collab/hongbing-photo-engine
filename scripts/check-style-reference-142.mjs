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
  console.error(`FAIL ${message}`);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

const referenceWindow = {};
vm.runInNewContext(read('assets/style-reference-142.js'), { window: referenceWindow });
const reference = referenceWindow.HB_STYLE_REFERENCE_142;
if (!reference) fail('142-style reference registry is missing');

const themeWindow = {};
vm.runInNewContext(read('assets/theme-registry.js'), { window: themeWindow });
const themeRegistry = themeWindow.HB_THEME_REGISTRY || {};
const clusters = reference?.clusterIds || {};
const clusterIds = Object.values(clusters).flat();
const expectedIds = new Set(Array.from({ length: reference?.expectedCount || 0 }, (_, index) => index + 1));

if (clusterIds.length !== reference.expectedCount) {
  fail(`cluster coverage expected ${reference.expectedCount}, found ${clusterIds.length}`);
} else pass(`cluster registry contains ${clusterIds.length} source rows`);

if (new Set(clusterIds).size !== clusterIds.length) {
  fail('source row ids are duplicated across style clusters');
} else pass('source row ids are unique across style clusters');

for (const id of clusterIds) {
  if (!expectedIds.has(id)) fail(`source row id is outside 1-${reference.expectedCount}: ${id}`);
}
for (const id of expectedIds) {
  if (!Object.prototype.hasOwnProperty.call(reference.ownerById, id)) fail(`source row has no primary owner: ${id}`);
}

for (const [cluster, ids] of Object.entries(clusters)) {
  const owner = reference.defaultOwnerByCluster[cluster];
  if (!owner) fail(`cluster has no default owner: ${cluster}`);
  else if (!themeRegistry[owner]) fail(`cluster owner is not a formal page: ${owner}`);
  else pass(`${cluster}: ${ids.length} rows -> ${owner}`);
}

const overrideOwners = new Map();
for (const [owner, ids] of Object.entries(reference.ownerOverrides)) {
  if (!themeRegistry[owner]) fail(`override owner is not a formal page: ${owner}`);
  for (const id of ids) {
    if (!expectedIds.has(id)) fail(`owner override references unknown row ${id}`);
    if (overrideOwners.has(id)) fail(`row ${id} has multiple owner overrides: ${overrideOwners.get(id)} and ${owner}`);
    overrideOwners.set(id, owner);
    if (reference.ownerById[id] !== owner) fail(`resolved owner mismatch for row ${id}`);
  }
}
pass(`${overrideOwners.size} rows have explicit routing overrides`);

const ownerCounts = {};
for (const id of expectedIds) ownerCounts[reference.ownerById[id]] = (ownerCounts[reference.ownerById[id]] || 0) + 1;
for (const [owner, count] of Object.entries(ownerCounts).sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`  ${owner}: ${count}`);
}

if (reference.specialCases.length < 7) fail('special-case routing record is incomplete');
else pass(`${reference.specialCases.length} special cases are documented`);

if (failures.length) {
  console.error(`\n${failures.length} style-reference check(s) failed.`);
  process.exit(1);
}

console.log('\nAll 142-style reference checks passed.');
