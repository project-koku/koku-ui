import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

const appPublicPath = process.env.APP_PUBLIC_PATH || '/insights/platform/cost-management';

// For props see https://react.i18next.com/legacy-v9/i18next-instance
i18next
  .use(XHR)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${appPublicPath}/locales/{{lng}}.json`,
    },
    fallbackLng: 'en',
    ns: ['default'],
    defaultNS: 'default',
    react: {
      useSuspense: false,
    },
  });

// Must re-export -- see https://github.com/i18next/react-i18next/issues/898
export { i18next as i18nInit };
