import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlFiles = ['index.html', 'travel.html', 'magazine.html', 'doll.html'];
const requiredDirs = ['docs', 'assets'];
let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL ${message}`);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function normalizeLocalHref(href) {
  const clean = href.split('#')[0].split('?')[0];
  return clean || null;
}

function checkRequiredFiles() {
  for (const file of htmlFiles) {
    const filePath = path.join(root, file);
    if (fs.existsSync(filePath)) pass(`found ${file}`);
    else fail(`missing ${file}`);
  }

  for (const dir of requiredDirs) {
    const dirPath = path.join(root, dir);
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) pass(`found ${dir}/`);
    else fail(`missing ${dir}/`);
  }
}

function checkDuplicateIds(file, text) {
  const ids = [...text.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const counts = new Map();
  for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);
  const duplicates = [...counts.entries()].filter(([, count]) => count > 1);

  if (duplicates.length === 0) {
    pass(`${file}: no duplicate ids`);
    return;
  }

  for (const [id, count] of duplicates) {
    fail(`${file}: duplicate id "${id}" appears ${count} times`);
  }
}

function checkLocalLinks(file, text) {
  const hrefs = [...text.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  const localHrefs = hrefs
    .filter((href) => !/^(https?:|mailto:|tel:|#)/.test(href))
    .map(normalizeLocalHref)
    .filter(Boolean);

  for (const href of localHrefs) {
    const targetPath = path.resolve(root, href);
    if (!targetPath.startsWith(root)) {
      fail(`${file}: local link escapes project root: ${href}`);
      continue;
    }

    if (!fs.existsSync(targetPath)) fail(`${file}: missing local link target ${href}`);
  }

  pass(`${file}: local links checked`);
}

function checkInlineScripts(file, text) {
  const scripts = [...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  if (scripts.length === 0) {
    pass(`${file}: no inline scripts`);
    return;
  }

  scripts.forEach((script, index) => {
    const tempFile = path.join(os.tmpdir(), `hongbing-${file}-${index}.mjs`);
    fs.writeFileSync(tempFile, script[1], 'utf8');
    const result = spawnSync(process.execPath, ['--check', tempFile], { encoding: 'utf8' });
    fs.rmSync(tempFile, { force: true });

    if (result.status === 0) pass(`${file}: inline script ${index + 1} syntax ok`);
    else fail(`${file}: inline script ${index + 1} syntax error\n${result.stderr || result.stdout}`);
  });
}

function checkHtmlFile(file) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) return;

  const text = readText(filePath);
  checkDuplicateIds(file, text);
  checkLocalLinks(file, text);
  checkInlineScripts(file, text);
}

checkRequiredFiles();
for (const file of htmlFiles) checkHtmlFile(file);

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}

console.log('\nAll static checks passed.');
