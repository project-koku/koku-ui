import i18next from 'i18next';

export const initI18next = (language: string) => {
  const languageResource = require(`./locales/${language}.json`);
  return i18next.init({
    lng: language,
    defaultNS: 'default',
    resources: {
      en: {
        default: languageResource
      }
    }
  });
};
