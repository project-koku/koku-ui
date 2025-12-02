// Note the en.json file must be first converted to an abstract syntax tree (AST)

const program = require('commander');
const { readFileSync, writeFileSync } = require('fs');

let LANG_DIR = 'locales/';
let LOCALE = 'fr';

program.option('-l, --lang-dir <dir>', 'folder with languages').option('-L, --locale <value>', 'language to generate');

const rootFolder = `${process.cwd()}/`;

program.parse(process.argv);
const options = program.opts();
if (options.langDir) {
  LANG_DIR = options.langDir;
}

if (options.locale) {
  LOCALE = options.locale;
}

const getTranslations = () => {
  const filename = `${rootFolder}${LANG_DIR}en.json`;
  return readFileSync(filename, 'utf8');
};

const getPrefixedTranslations = () => {
  const translations = JSON.parse(getTranslations());

  for (const key of Object.keys(translations)) {
    const obj = translations[key];
    injectLocale(obj);
  }
  return JSON.stringify({ ...translations }, null, 2);
};

const injectLocale = obj => {
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (item.type === 0) {
        item.value = `${LOCALE.toUpperCase()} ${item.value}`;
        return;
      } else {
        injectLocale(item);
      }
    }
  } else if (typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      injectLocale(obj[key]);
    }
  }
};

writeFileSync(`${rootFolder}${LANG_DIR}${LOCALE}.json`, getPrefixedTranslations());
