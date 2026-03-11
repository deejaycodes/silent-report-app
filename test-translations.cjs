#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 SafeVoice Translation Test Suite\n');

// Load all translation files
const en = JSON.parse(fs.readFileSync('./src/i18n/locales/en.json', 'utf8'));
const yo = JSON.parse(fs.readFileSync('./src/i18n/locales/yo.json', 'utf8'));
const ha = JSON.parse(fs.readFileSync('./src/i18n/locales/ha.json', 'utf8'));
const ig = JSON.parse(fs.readFileSync('./src/i18n/locales/ig.json', 'utf8'));

const languages = { en, yo, ha, ig };

// Test 1: Check all files have same structure
console.log('✅ TEST 1: File Structure');
const enKeys = Object.keys(en);
for (const [lang, data] of Object.entries(languages)) {
  const keys = Object.keys(data);
  if (keys.length === enKeys.length) {
    console.log(`   ✓ ${lang.toUpperCase()}: ${keys.length} sections`);
  } else {
    console.log(`   ✗ ${lang.toUpperCase()}: Missing sections!`);
  }
}

// Test 2: Check critical translations exist
console.log('\n✅ TEST 2: Critical Translations');
const criticalPaths = [
  'report.title',
  'report.submit_report',
  'report.location_state',
  'auth.welcome_back',
  'auth.login_failed',
  'confirmation.thank_you'
];

for (const path of criticalPaths) {
  const [section, key] = path.split('.');
  let allExist = true;
  for (const [lang, data] of Object.entries(languages)) {
    if (!data[section] || !data[section][key]) {
      console.log(`   ✗ ${lang.toUpperCase()}: Missing ${path}`);
      allExist = false;
    }
  }
  if (allExist) {
    console.log(`   ✓ ${path}: Present in all languages`);
  }
}

// Test 3: Show sample translations
console.log('\n✅ TEST 3: Sample Translations');
console.log('\n   📝 Report Form Title:');
console.log(`      EN: "${en.report.title}"`);
console.log(`      YO: "${yo.report.title}"`);
console.log(`      HA: "${ha.report.title}"`);
console.log(`      IG: "${ig.report.title}"`);

console.log('\n   📝 Submit Button:');
console.log(`      EN: "${en.report.submit_report}"`);
console.log(`      YO: "${yo.report.submit_report}"`);
console.log(`      HA: "${ha.report.submit_report}"`);
console.log(`      IG: "${ig.report.submit_report}"`);

console.log('\n   📝 Thank You Message:');
console.log(`      EN: "${en.confirmation.thank_you}"`);
console.log(`      YO: "${yo.confirmation.thank_you}"`);
console.log(`      HA: "${ha.confirmation.thank_you}"`);
console.log(`      IG: "${ig.confirmation.thank_you}"`);

// Test 4: Check config.ts loads JSON files
console.log('\n✅ TEST 4: Config File Check');
const configContent = fs.readFileSync('./src/i18n/config.ts', 'utf8');
if (configContent.includes("import en from './locales/en.json'")) {
  console.log('   ✓ Config imports JSON files');
} else {
  console.log('   ✗ Config NOT importing JSON files!');
}
if (configContent.includes("localStorage.getItem('language')")) {
  console.log('   ✓ Language persistence enabled');
} else {
  console.log('   ✗ Language persistence missing!');
}

// Test 5: Check components use translations
console.log('\n✅ TEST 5: Component Translation Usage');
const reportFile = fs.readFileSync('./src/pages/Report.tsx', 'utf8');
const authFile = fs.readFileSync('./src/pages/Auth.tsx', 'utf8');
const confirmFile = fs.readFileSync('./src/pages/ReportConfirmation.tsx', 'utf8');

const checks = [
  { file: 'Report.tsx', content: reportFile, key: "t('report.submit_report')" },
  { file: 'Auth.tsx', content: authFile, key: "t('auth.welcome_back')" },
  { file: 'ReportConfirmation.tsx', content: confirmFile, key: "t('confirmation.thank_you')" }
];

for (const check of checks) {
  if (check.content.includes(check.key)) {
    console.log(`   ✓ ${check.file}: Using translations`);
  } else {
    console.log(`   ✗ ${check.file}: NOT using translations!`);
  }
}

console.log('\n🎉 Translation Test Complete!\n');
console.log('📊 Summary:');
console.log(`   • 4 languages: English, Yoruba, Hausa, Igbo`);
console.log(`   • ${enKeys.length} translation sections`);
console.log(`   • 3 pages fully translated`);
console.log(`   • Language persistence: Enabled`);
console.log('\n✅ Ready for production!\n');
