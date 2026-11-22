/**
 * Comprehensive Codebase Audit Script
 * Verifies:
 * 1. CSS Module Imports & Selectors: Every styles.<className> or styles['<className>']
 *    referenced in any TSX/TS file exists in the imported CSS module.
 * 2. I18N Parity: Complete 1-to-1 key structure between dictionaries/en.json and dictionaries/ru.json.
 * 3. I18N Usages: Every dict.<section>.<key> and sub-dictionary dict.<key> used in code exists.
 * 4. Zero Legacy Ternaries: Asserts no leftover isRu or is_ru flag constructions in code.
 */

const fs = require('fs');
const path = require('path');

function getFiles(dir, exts, ignoreDirs) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!ignoreDirs.includes(file)) {
        results = results.concat(getFiles(fullPath, exts, ignoreDirs));
      }
    } else {
      if (exts.some(ext => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const rootDir = path.resolve(__dirname, '..');
const webDir = path.join(rootDir, 'web');
const sourceFiles = getFiles(webDir, ['.tsx', '.ts'], ['node_modules', '.next', 'out', 'out-baseline']);

console.log(`================================================================`);
console.log(`  COMPREHENSIVE CODEBASE AUDIT: ${sourceFiles.length} TSX/TS FILES`);
console.log(`================================================================\n`);

// ----------------------------------------------------
// 1. CSS Module Selector Verification
// ----------------------------------------------------
console.log('>>> [1/4] AUDITING CSS MODULE SELECTORS...');
let totalImportsChecked = 0;
let totalSelectorsChecked = 0;
const missingSelectors = [];
const missingFiles = [];

sourceFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Match: import <identifier> from "....module.css"
  const importRegex = /import\s+([a-zA-Z0-9_]+)\s+from\s+['"]([^'"]+\.module\.css)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const varName = match[1];
    let rawPath = match[2];
    let cssPath;

    if (rawPath.startsWith('@/')) {
      cssPath = path.join(webDir, rawPath.slice(2));
    } else {
      cssPath = path.resolve(path.dirname(file), rawPath);
    }

    if (!fs.existsSync(cssPath)) {
      missingFiles.push({ file: path.relative(rootDir, file), rawPath, resolved: path.relative(rootDir, cssPath) });
      continue;
    }

    totalImportsChecked++;
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Parse all CSS class definitions
    const classRegex = /\.([a-zA-Z0-9_-]+)/g;
    const definedClasses = new Set();
    let cm;
    while ((cm = classRegex.exec(cssContent)) !== null) {
      const cls = cm[1];
      if (!/^\d/.test(cls)) {
        definedClasses.add(cls);
      }
    }

    // Find all usages of varName.something or varName['something'] or varName["something"]
    const usageRegex = new RegExp('\\b' + varName + '(?:\\.([a-zA-Z0-9_]+)|\\[[\'"]([a-zA-Z0-9_-]+)[\'"]\\])', 'g');
    let um;
    while ((um = usageRegex.exec(content)) !== null) {
      const usedClass = um[1] || um[2];
      totalSelectorsChecked++;

      if (!definedClasses.has(usedClass)) {
        missingSelectors.push({
          sourceFile: path.relative(rootDir, file),
          cssFile: path.relative(rootDir, cssPath),
          identifier: varName,
          missingClass: usedClass,
        });
      }
    }
  }
});

console.log(`  • CSS Module imports verified: ${totalImportsChecked}`);
console.log(`  • Selectors verified in code:  ${totalSelectorsChecked}`);
console.log(`  • Missing CSS files:           ${missingFiles.length}`);
console.log(`  • Broken/missing selectors:    ${missingSelectors.length}`);

if (missingSelectors.length > 0) {
  console.table(missingSelectors);
} else {
  console.log('  ✓ PASS: 100% of referenced CSS selectors are defined in CSS modules!\n');
}

// ----------------------------------------------------
// 2. Dictionary Key Structure Parity (All 10 Locales)
// ----------------------------------------------------
const ALL_LOCALES = ['en', 'ru', 'es', 'zh', 'hi', 'ar', 'pt', 'fr', 'bn', 'id'];
console.log(`>>> [2/4] AUDITING I18N DICTIONARY STRUCTURE (${ALL_LOCALES.length} LOCALES)...`);

const allDicts = {};
ALL_LOCALES.forEach(loc => {
  allDicts[loc] = JSON.parse(fs.readFileSync(path.join(webDir, 'dictionaries', `${loc}.json`), 'utf8'));
});
const enDict = allDicts['en'];
const enSections = Object.keys(enDict);

let dictKeyMismatches = [];

ALL_LOCALES.forEach(loc => {
  if (loc === 'en') return;
  const targetDict = allDicts[loc];
  const targetSections = Object.keys(targetDict);

  enSections.forEach(section => {
    if (!targetDict[section]) {
      dictKeyMismatches.push({ section, key: '*', missingIn: `${loc}.json` });
      return;
    }
    if (typeof enDict[section] === 'object' && enDict[section] !== null) {
      const enKeys = Object.keys(enDict[section]);
      const targetKeys = Object.keys(targetDict[section]);
      enKeys.forEach(k => {
        if (!targetKeys.includes(k)) dictKeyMismatches.push({ section, key: k, missingIn: `${loc}.json` });
      });
      targetKeys.forEach(k => {
        if (!enKeys.includes(k)) dictKeyMismatches.push({ section, key: k, missingIn: 'en.json' });
      });
    }
  });

  targetSections.forEach(section => {
    if (!enDict[section]) {
      dictKeyMismatches.push({ section, key: '*', missingIn: 'en.json' });
    }
  });
});

console.log(`  • Locales checked: ${ALL_LOCALES.join(', ')} (${ALL_LOCALES.length} total)`);
console.log(`  • Reference en.json sections: ${enSections.length}`);
console.log(`  • Key mismatches across all 10 dictionaries: ${dictKeyMismatches.length}`);
if (dictKeyMismatches.length > 0) {
  console.table(dictKeyMismatches);
} else {
  console.log('  ✓ PASS: All 10 dictionaries have 100% identical sections and keys!\n');
}

// ----------------------------------------------------
// 3. In-Code Dictionary Reference Verification
// ----------------------------------------------------
console.log('>>> [3/4] AUDITING IN-CODE DICTIONARY USAGES ACROSS ALL 10 DICTIONARIES...');
const brokenDictUsages = [];
let totalDictUsages = 0;

sourceFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');

  let subSection = null;
  const subMatch = content.match(/dict\s*[:=]\s*(?:globalDict|dict)\.([a-zA-Z0-9_]+)/);
  if (subMatch) {
    subSection = subMatch[1];
  }

  const r = /\bdict\.([a-zA-Z0-9_]+)(?:\.([a-zA-Z0-9_]+))?/g;
  let m;
  while ((m = r.exec(content)) !== null) {
    const first = m[1];
    const second = m[2];

    if (['replace', 'toString', 'toLowerCase', 'toUpperCase', 'trim', 'map', 'filter', 'slice'].includes(second)) {
      continue;
    }

    totalDictUsages++;
    if (second) {
      for (const loc of ALL_LOCALES) {
        const d = allDicts[loc];
        const val = d[first] ? d[first][second] : undefined;
        if (val === undefined) {
          brokenDictUsages.push({
            file: path.relative(rootDir, f),
            ref: `dict.${first}.${second}`,
            missingIn: loc,
          });
        }
      }
    } else if (subSection) {
      if (['replace', 'toString', 'toLowerCase', 'toUpperCase', 'trim'].includes(first)) continue;
      for (const loc of ALL_LOCALES) {
        const d = allDicts[loc];
        const val = d[subSection] ? d[subSection][first] : undefined;
        if (val === undefined) {
          brokenDictUsages.push({
            file: path.relative(rootDir, f),
            ref: `dict.${first} [${subSection}]`,
            missingIn: loc,
          });
        }
      }
    }
  }
});

console.log(`  • Dictionary references checked: ${totalDictUsages}`);
console.log(`  • Broken dictionary references:   ${brokenDictUsages.length}`);
if (brokenDictUsages.length > 0) {
  console.table(brokenDictUsages);
} else {
  console.log('  ✓ PASS: All in-code dictionary references exist across all 10 dictionaries!\n');
}

// ----------------------------------------------------
// 4. Legacy Pattern Audit (No isRu or is_ru)
// ----------------------------------------------------
console.log('>>> [4/4] AUDITING LEGACY LOCALIZATION PATTERNS (isRu / is_ru)...');
const legacyMatches = [];

sourceFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (/\bisRu|\bis_ru/i.test(line)) {
      legacyMatches.push({ file: path.relative(rootDir, f), line: idx + 1, snippet: line.trim() });
    }
  });
});

console.log(`  • Legacy isRu references found: ${legacyMatches.length}`);
if (legacyMatches.length > 0) {
  console.table(legacyMatches);
} else {
  console.log('  ✓ PASS: Zero legacy isRu / is_ru ternary flags found across codebase!\n');
}

// Final Summary
const totalErrors = missingSelectors.length + missingFiles.length + dictKeyMismatches.length + brokenDictUsages.length + legacyMatches.length;

console.log(`================================================================`);
if (totalErrors === 0) {
  console.log(`  FINAL VERDICT: ALL CHECKS PASSED [100% PARITY & ZERO ERRORS]`);
  console.log(`================================================================`);
  process.exit(0);
} else {
  console.error(`  FINAL VERDICT: FAILED WITH ${totalErrors} DISCREPANCIES`);
  console.log(`================================================================`);
  process.exit(1);
}
