const { syncLocales } = require('i18next-locales-sync');
const path = require('path');
const srcDir = path.resolve(__dirname, '../src/locales');

syncLocales({
  primaryLanguage: 'en',
  secondaryLanguages: [], // ['de', 'ja'],
  localesFolder: srcDir,
  // overridePluralRules: pluralResolver => pluralResolver.addRule('he', pluralResolver.getRule('en')),
});
