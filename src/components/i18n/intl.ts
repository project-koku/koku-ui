import { createIntl, createIntlCache } from 'react-intl';

// eslint-disable-next-line no-restricted-imports
import messages from '../../../locales/data.json';

const locale = navigator.language.split(/[-_]/)[0] || 'en';

// export const getLocale = () => {
//   return locale;
// };

export const getLocale = () => {
  // Show "integrations" for stage and prod-beta only -- prod-stable uses "sources" until Nov 1st
  const isProd = typeof insights?.chrome?.isProd === 'function' ? insights?.chrome?.isProd() : insights?.chrome?.isProd;
  const isIntegrations = !isProd || (isProd && insights?.chrome?.isBeta());

  return isIntegrations ? locale : 'en-sources';
};

const cache = createIntlCache();

const intl = createIntl(
  {
    defaultLocale: 'en',
    // locale,
    locale: getLocale(),
    // eslint-disable-next-line no-console
    onError: console.log,
    // messages: messages[locale],
    messages: messages[getLocale()],
  },
  cache
);

export default intl;
