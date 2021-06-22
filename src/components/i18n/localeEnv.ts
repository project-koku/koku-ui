import { createIntl, createIntlCache } from 'react-intl';

export const createIntlEnv = lang => {
  const cache = createIntlCache();
  return createIntl(
    {
      locale: lang,
      messages: {},
    },
    cache
  );
};

export const getLocale = () => {
  // todo: need to figure how we are to set locale, return 'en' as default.
  return 'en';
};
