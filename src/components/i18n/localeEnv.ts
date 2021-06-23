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

export const getLocaleInsights = async () => {
  const { identity } = await (insights.chrome as any).auth.getUser();
  try {
    const result = identity.user.locale;
    return result;
  } catch {
    return 'en';
  }
};

export const getLocale = () => {
  let locale = 'en';
  getLocaleInsights().then(val => {
    locale = val;
  });

  return locale;
};

export const getDateFnsLocale = (): Locale => {
  const locale: string = getLocale();

  switch (locale) {
    case 'enUS':
      return enUS;
    case 'eo':
      return eo;
  }
};
