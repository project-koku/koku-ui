import { createIntl, createIntlCache } from 'react-intl';

// eslint-disable-next-line no-restricted-imports
import messages from '../../../locales/data.json';

const locale = navigator.language.split(/[-_]/)[0] || 'en';
export const getLocale = () => {
  return locale;
};

export const ignoreDefaultMessageError = error => {
  if (error?.code === 'MISSING_TRANSLATION') {
    return;
  }
  throw error;
};

const cache = createIntlCache();

const intl = createIntl(
  {
    defaultLocale: 'en',
    locale,
    onError: ignoreDefaultMessageError,
    messages: messages[locale] || messages.en,
  },
  cache
);

export default intl;
