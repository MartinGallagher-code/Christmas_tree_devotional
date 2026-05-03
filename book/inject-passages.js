#!/usr/bin/env node
// Injects ESV passage text inline into book.html under each scripture-ref entry.
// Reads ESV_PASSAGES from ../passages.js, then for every
//   <li><span class="scripture-ref">REF</span><span class="scripture-desc">…</span></li>
// (already-injected entries are skipped) it appends
//   <div class="scripture-text">…verse text…</div>
// inside the same <li>.

const fs = require('fs');
const path = require('path');

const passagesPath = path.join(__dirname, '..', 'passages.js');
const bookPath = path.join(__dirname, 'book.html');

const passagesSrc = fs.readFileSync(passagesPath, 'utf8');
const sandbox = {};
new Function('module', 'exports', passagesSrc + '\nmodule.exports = ESV_PASSAGES;')(
  sandbox, sandbox
);
const ESV = sandbox.exports;

function decodeRef(ref) {
  return ref
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/–/g, '-')
    .replace(/—/g, '-');
}

let book = fs.readFileSync(bookPath, 'utf8');

const liRe = /<li>\s*<span class="scripture-ref">([^<]+)<\/span>\s*<span class="scripture-desc">([\s\S]*?)<\/span>\s*<\/li>/g;

const missing = new Set();
let injected = 0;
let skipped = 0;

book = book.replace(liRe, (full, ref, desc) => {
  const key = decodeRef(ref).trim();
  const text = ESV[key];
  if (!text) {
    missing.add(key);
    return full;
  }
  injected++;
  return `<li>\n        <span class="scripture-ref">${ref}</span>\n        <span class="scripture-desc">${desc}</span>\n        <div class="scripture-text">${text}</div>\n      </li>`;
});

fs.writeFileSync(bookPath, book);

console.log(`Injected ${injected} passages into ${path.relative(process.cwd(), bookPath)}`);
if (skipped) console.log(`Skipped ${skipped} already-injected entries`);
if (missing.size) {
  console.log('Missing passage text for:');
  for (const k of missing) console.log('  - ' + k);
  process.exit(1);
}
