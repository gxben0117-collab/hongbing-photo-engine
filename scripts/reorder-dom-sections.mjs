import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sectionOrders = {
  'travel.html': ['travel-random', 'travel-preset', 'travel-style', 'travel-theme', 'travel-composition', 'travel-costume', 'travel-adorn', 'travel-pose', 'travel-motion', 'travel-lighting', 'travel-camera', 'travel-ratio', 'travel-media', 'travel-output'],
  'magazine.html': ['magazine-preset', 'magazine-style', 'magazine-theme', 'magazine-garment-variation', 'magazine-details', 'magazine-body', 'magazine-pose', 'magazine-framing', 'magazine-background', 'magazine-motion', 'magazine-camera', 'magazine-ratio', 'magazine-media', 'magazine-output'],
  'luxury-lifestyle.html': ['section-preset', 'section-style', 'section-scene', 'section-garment', 'section-garment-variation', 'section-body', 'section-pose', 'section-interaction', 'section-lighting', 'section-camera', 'section-ratio', 'section-extra', 'section-output'],
  'fantasy-fashion.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-garment-variation', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'chinese-classical.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-garment-variation', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'japanese-kimono.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-garment-variation', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'korean-hanbok.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-garment-variation', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'xianxia.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-garmentdetail', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'anime-character.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-garmentdetail', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'flower-fairy.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-wings', 'section-garmentdetail', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'isekai-fantasy.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-garmentdetail', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'floral-sweet.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-garmentdetail', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'gala-socialite.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-garmentdetail', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'kpop-idol.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-garmentdetail', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'battle-academy.html': ['section-preset', 'section-style', 'section-composition', 'section-school', 'section-upper', 'section-waist', 'section-lower', 'section-uniformtype', 'section-accessory', 'section-battlemode', 'section-garmentdetail', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'ancient-goddess.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-garmentdetail', 'section-body', 'section-pose', 'section-extra', 'section-lighting', 'section-background', 'section-camera', 'section-ratio', 'section-output'],
  'bridal-editorial.html': ['section-preset', 'section-style', 'section-composition', 'section-garment', 'section-material', 'section-garment-variation', 'section-veil', 'section-body', 'section-pose', 'section-styling', 'section-lighting', 'section-background', 'section-extra', 'section-camera', 'section-ratio', 'section-output'],
  'editorial-identity.html': ['editorial-preset', 'editorial-layout', 'editorial-placement', 'editorial-typography', 'editorial-copy-style', 'editorial-text', 'editorial-language', 'editorial-graphic', 'editorial-graphic-accent', 'editorial-color', 'editorial-image-treatment', 'editorial-print-finish', 'editorial-whitespace', 'editorial-ratio', 'editorial-extra', 'editorial-output'],
};

const pages = Object.keys(sectionOrders);
const sectionPattern = /<section\b[^>]*>[\s\S]*?<\/section>/gi;
const classPattern = /<section\b[^>]*\bclass=["']([^"']+)["'][^>]*>/i;
const writeMode = process.argv.includes('--write');
const checkMode = process.argv.includes('--check');

let changedCount = 0;
let issueCount = 0;

for (const page of pages) {
  const filePath = path.join(root, page);
  const source = fs.readFileSync(filePath, 'utf8');
  const matches = [...source.matchAll(sectionPattern)];
  const sections = matches.map((match, index) => ({
    block: match[0],
    index,
    className: match[0].match(classPattern)?.[1]?.split(/\s+/).find(name => sectionOrders[page].includes(name)) || null,
    start: match.index,
    end: match.index + match[0].length,
  }));
  for (let index = 0; index < sections.length; index += 1) {
    const previousEnd = index === 0 ? sections[index].start : sections[index - 1].end;
    sections[index].segment = source.slice(previousEnd, sections[index].end);
  }
  const expected = sectionOrders[page];

  if (!sections.length) {
    issueCount += 1;
    console.error(`ISSUE ${page}: no section blocks`);
    continue;
  }
  const actual = sections.map(section => section.className).filter(Boolean);
  if (actual.length !== expected.length || new Set(actual).size !== expected.length) {
    issueCount += 1;
    console.error(`ISSUE ${page}: expected ${expected.length} named sections, found ${actual.length} (${actual.join(' -> ')})`);
    continue;
  }
  const byClass = new Map(sections.filter(section => section.className).map(section => [section.className, section]));
  if (expected.some(className => !byClass.has(className))) {
    issueCount += 1;
    console.error(`ISSUE ${page}: missing section(s): ${expected.filter(className => !byClass.has(className)).join(', ')}`);
    continue;
  }

  const sorted = expected.map(className => byClass.get(className));
  const alreadySorted = sorted.every((section, index) => section.index === index);
  if (alreadySorted) {
    console.log(`ok ${page}: ${actual.join(' -> ')}`);
    continue;
  }

  changedCount += 1;
  console.log(`${writeMode ? 'write' : 'would reorder'} ${page}: ${actual.join(' -> ')} => ${expected.join(' -> ')}`);
  if (!writeMode) continue;

  const prefix = source.slice(0, sections[0].start);
  const suffix = source.slice(sections.at(-1).end);
  const output = prefix + sorted.map(section => section.segment).join('') + suffix;
  fs.writeFileSync(filePath, output, 'utf8');
}

if (checkMode && changedCount) process.exitCode = 1;
if (issueCount) process.exitCode = 1;
console.log(`${writeMode ? 'Reordered' : 'Detected'} ${changedCount} page(s); ${issueCount} issue(s).`);
