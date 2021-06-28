import { enUS, eo } from 'date-fns/locale';
import { createIntl, createIntlCache } from 'react-intl';

export const createIntlEnv = () => {
  const cache = createIntlCache();
  return createIntl(
    {
      locale: getLocale(),
      messages: {},
    },
    cache
  );
};

export const getInsightsLocale = async () => {
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
  getInsightsLocale().then(val => {
    locale = val;
  });

  return locale;
};

export const getDateFnsLocale = (): Locale => {
  const locale: string = getLocale();

  switch (locale) {
    case 'en_US':
      return enUS;
    case 'eo':
      return eo;
  }
};
