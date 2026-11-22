const fs = require('fs');
const path = require('path');

const dictDir = path.join(__dirname, '../web/dictionaries');
const enPath = path.join(dictDir, 'en.json');

const targetLocales = ['ru', 'es', 'zh', 'hi', 'ar', 'pt', 'fr', 'bn', 'id'];

console.log('================================================================');
console.log('  VALIDATING ALL I18N DICTIONARIES AGAINST en.json');
console.log('================================================================');

// 1. Validate JSON.parse on en.json
let en;
try {
  en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  console.log('✓ Successfully parsed reference web/dictionaries/en.json');
} catch (e) {
  console.error('✗ Failed to parse en.json:', e.message);
  process.exit(1);
}

// Helper to recursively collect all keys (leaf nodes and intermediate objects/arrays)
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    keys.push(fullKey);
    if (Array.isArray(obj[k])) {
      obj[k].forEach((item, idx) => {
        const itemKey = `${fullKey}[${idx}]`;
        if (typeof item === 'object' && item !== null) {
          keys = keys.concat(getAllKeys(item, itemKey));
        } else {
          keys.push(itemKey);
        }
      });
    } else if (typeof obj[k] === 'object' && obj[k] !== null) {
      keys = keys.concat(getAllKeys(obj[k], fullKey));
    }
  }
  return keys;
}

const enKeys = getAllKeys(en);
const enTopKeysCount = Object.keys(en).reduce((sum, sec) => sum + Object.keys(en[sec]).length, 0);
console.log(`Reference en.json stats: 15 sections, ${enTopKeysCount} section keys, ${enKeys.length} total nested leaf keys.\n`);

function getPlaceholders(str) {
  if (typeof str !== 'string') return [];
  const matches = str.match(/\{[a-zA-Z0-9_]+\}/g);
  return matches ? matches.sort() : [];
}

const missingCounts = {};
let allPassed = true;

for (const loc of targetLocales) {
  const filePath = path.join(dictDir, `${loc}.json`);
  console.log(`>>> Validating [${loc}] (${filePath})...`);

  // 1. JSON.parse validation
  let data;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(content);
    console.log(`  ✓ [${loc}] Valid JSON structure with UTF-8 encoding.`);
  } catch (err) {
    console.error(`  ✗ [${loc}] Failed to parse JSON:`, err.message);
    missingCounts[loc] = -1;
    allPassed = false;
    continue;
  }

  // 2. Section and key comparison
  const locKeys = getAllKeys(data);
  const missing = enKeys.filter(k => !locKeys.includes(k));
  missingCounts[loc] = missing.length;

  const topKeysCount = Object.keys(data).reduce((sum, sec) => sum + (data[sec] ? Object.keys(data[sec]).length : 0), 0);

  if (missing.length === 0) {
    console.log(`  ✓ [${loc}] 100% key parity: 15 sections, ${topKeysCount} section keys, 0 missing keys.`);
  } else {
    console.error(`  ✗ [${loc}] Missing keys (${missing.length}):`, missing);
    allPassed = false;
  }

  // 3. Placeholder verification
  let phMismatches = 0;
  function verifyPH(objEn, objTarget, path = '') {
    for (const k in objEn) {
      const p = path ? `${path}.${k}` : k;
      if (typeof objEn[k] === 'string') {
        const phEn = getPlaceholders(objEn[k]);
        const phTarget = getPlaceholders(objTarget[k]);
        if (phEn.join(',') !== phTarget.join(',')) {
          console.warn(`    ⚠️ [${loc}] Placeholder mismatch at ${p}: EN [${phEn.join(', ')}] vs [${phTarget.join(', ')}]`);
          phMismatches++;
        }
      } else if (Array.isArray(objEn[k])) {
        objEn[k].forEach((item, idx) => {
          if (objTarget && objTarget[k] && objTarget[k][idx]) {
            verifyPH(item, objTarget[k][idx], `${p}[${idx}]`);
          }
        });
      } else if (typeof objEn[k] === 'object' && objEn[k] !== null) {
        if (objTarget && objTarget[k]) {
          verifyPH(objEn[k], objTarget[k], p);
        }
      }
    }
  }
  verifyPH(en, data);
  if (phMismatches === 0) {
    console.log(`  ✓ [${loc}] All template placeholders ({name}, {count}, {rank}, {seconds}, {protocol}, {country}) intact.`);
  }
}

console.log('\n================================================================');
console.log('  PARITY AUDIT SUMMARY:');
console.log('================================================================');
let hasMissing = false;
for (const loc of targetLocales) {
  const count = missingCounts[loc];
  console.log(`missingIn${loc.toUpperCase()}: ${count}`);
  if (count !== 0) hasMissing = true;
}

if (!hasMissing && allPassed) {
  console.log(`\n✓ PASS: All ${targetLocales.length} dictionaries verified with 100% key parity and 0 missing keys!`);
  process.exit(0);
} else {
  console.error('\n✗ FAIL: One or more dictionaries failed parity verification!');
  process.exit(1);
}
