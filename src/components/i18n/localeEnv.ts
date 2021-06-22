import { enUS, eo } from 'date-fns/locale';
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
  return 'en';
};

export const getDateFnsLocale = (): Locale => {
  const locale: string = 'enUS';

  switch (locale) {
    case 'enUS':
      return enUS;
    case 'eo':
      return eo;
  }
};
