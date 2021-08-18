// import { intlHelper as InsightsIntlHelper } from '@redhat-cloud-services/frontend-components-translations/';
import { enUS, eo } from 'date-fns/locale';
import { createIntl, createIntlCache } from 'react-intl';

import messages from '../../../locales/data.json';

const locale = navigator.language.split(/[-_]/)[0] || 'en';
export const getLocale = () => {
  return locale;
};

const cache = createIntlCache();
// const intlSettings = { locale };

export const intl = createIntl(
  {
    defaultLocale: 'en',
    locale,
    // eslint-disable-next-line no-console
    onError: console.log,
    messages: messages[locale],
  },
  cache
);

export const intlHelper = message => message; // InsightsIntlHelper(message, intlSettings);

export const getDateFnsLocale = (): Locale => {
  switch (locale) {
    case 'eo':
      return eo;
    case 'en':
    default:
      return enUS;
  }
};
