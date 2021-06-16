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
