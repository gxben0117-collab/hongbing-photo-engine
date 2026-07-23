import fs from 'node:fs';

const source = fs.readFileSync('anime-hero.html', 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const optionPattern = /<input\s+type="radio"\s+name="([^"]+)"\s+value="([^"]+)"/g;
const optionsByGroup = new Map();
for (const match of source.matchAll(optionPattern)) {
  const [, group, value] = match;
  if (value.includes("'+")) continue;
  if (!optionsByGroup.has(group)) optionsByGroup.set(group, new Set());
  optionsByGroup.get(group).add(value);
}
const dynamicMedia = ['inkWash', 'watercolor', 'conceptArt', 'gouache', 'ukiyoe', 'charcoal', 'pastel'];
for (const value of dynamicMedia) optionsByGroup.get('medium').add(value);
const dynamicOutfits = ['sculpturalWhite', 'blackVelvet', 'silkDrape', 'powerSuit', 'tweedSet', 'knitSoft', 'crystalCocktail', 'bridalEditorial', 'fringeStage', 'modernEastern', 'redBlackTalisman'];
for (const value of dynamicOutfits) optionsByGroup.get('outfit').add(value);

const promptGroups = ['mode', 'outfit', 'body', 'archetype', 'power', 'standForm', 'standAbility', 'shikigamiForm', 'shikigamiContract', 'personPose', 'pose', 'scene', 'fx', 'motion', 'camera', 'medium'];
const relationGroups = ['relationship', 'relationStrength', 'relationEvidence'];
for (const group of promptGroups) {
  const values = optionsByGroup.get(group) || new Set();
  expect(values.size > 0, `${group}: no clickable options found`);
  const binding = group === 'archetype'
    ? source.includes('data.archetype[archetype]')
    : source.includes(`data.${group}[pick('${group}')]`) || group === 'medium';
  expect(binding, `${group}: not connected to prompt generation`);
  for (const value of values) {
    const definition = new RegExp(`(?:\\b${escape(value)}\\s*:|\\[['"]${escape(value)}['"])`);
    expect(definition.test(source), `${group}.${value}: no prompt definition found`);
  }
}
for (const group of relationGroups) {
  const values = optionsByGroup.get(group) || new Set();
  expect(values.size > 0, `${group}: no clickable options found`);
  expect(source.includes(`RELATION_DATA[pick('${group}')]`), `${group}: not connected to relation prompt`);
  for (const value of values) expect(new RegExp(`\\b${escape(value)}\\s*:`).test(source), `${group}.${value}: no relation definition found`);
}
for (const [group, values] of optionsByGroup) {
  for (const value of values) expect(source.includes(value), `${group}.${value}: missing source text`);
}
const mediaValues = optionsByGroup.get('medium') || new Set();
for (const value of mediaValues) {
  expect(new RegExp(`\\b${escape(value)}\\s*:`).test(source.slice(source.indexOf('const RENDER_MEDIUM_LOCKS'))), `medium.${value}: missing render-medium lock`);
}
for (const value of dynamicOutfits) {
  expect(new RegExp(`\\b${escape(value)}\\s*:`).test(source.slice(source.indexOf('const MAGAZINE_EDITORIAL_OUTFITS'))), `outfit.${value}: missing editorial-fashion prompt`);
}
const presetPattern = /data-preset="([^"]+)"/g;
for (const match of source.matchAll(presetPattern)) {
  const preset = match[1];
  if (preset !== 'random') expect(new RegExp(`presets\\.${escape(preset)}\\s*=|${escape(preset)}\\s*:`).test(source), `preset.${preset}: no preset mapping found`);
}
expect(source.includes("getElementById('generate').addEventListener('click',generate)"), 'generate button: no click handler');
expect(source.includes("getElementById('copy').addEventListener('click'"), 'copy button: no click handler');
expect(source.includes("text('finishNote')"), 'finish-note field: not connected to prompt generation');
expect(source.includes("text('extra')"), 'custom-direction field: not connected to prompt generation');
expect(source.includes("text('prop')"), 'signature-prop field: not connected to prompt generation');
expect(source.includes("text('palette')"), 'palette field: not connected to prompt generation');
expect(source.includes("text('backgroundNote')"), 'background-note field: not connected to prompt generation');

if (failures.length) {
  console.error(`FAIL anime option audit: ${failures.length} issue(s)`);
  failures.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}
const total = [...optionsByGroup.values()].reduce((count, values) => count + values.size, 0);
console.log(`PASS anime option audit: ${total} clickable radio options mapped; ${mediaValues.size} render media locks verified.`);
