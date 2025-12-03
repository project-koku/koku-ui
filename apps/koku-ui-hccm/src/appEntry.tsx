/* eslint-disable no-console */
// Todo: Uncomment for use with non-shared PatternFly packages
// import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';
import './styles/global.css';

import { initAPILib, type InitAPIProps } from '@koku-ui/api/init';
import { getLocale } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/locales/data.json';
import { initUILib, type InitUIProps } from '@koku-ui/ui-lib-hccm/init';
import { configureStore } from '@koku-ui/ui-lib-hccm/store';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { Maintenance } from '@redhat-cloud-services/frontend-components/Maintenance';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import {
  useAddNotification,
  useClearNotifications,
  useNotifications,
  useRemoveNotification,
} from '@redhat-cloud-services/frontend-components-notifications/hooks';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import IntlProvider from '@redhat-cloud-services/frontend-components-translations/Provider';
import React from 'react';
import { Provider } from 'react-redux';

import App from './app';

const initLibs = () => {
  const initAPIProps: InitAPIProps = {
    setRBACFunction: async () => {
      const insights = (window as any).insights;
      if (insights?.chrome?.auth?.getUser && insights?.chrome?.getUserPermissions) {
        const user = await insights.chrome.auth.getUser();
        const permissions = await insights.chrome.getUserPermissions();
        return {
          isOrgAdmin: user.identity.user.is_org_admin,
          permissions,
        };
      }
      return { isOrgAdmin: false, permissions: null };
    },
  };

  initAPILib(initAPIProps);

  const initUiProps: InitUIProps = {
    PageHeader,
    PageHeaderTitle,
    AsyncComponent,
    Maintenance,
    Unavailable,
    setNotificationsFuncs: {
      useAddNotification,
      useClearNotifications,
      useNotifications,
      useRemoveNotification,
    },
    navToggleResizer: (handleResize: VoidFunction) =>
      insights.chrome.on('NAVIGATION_TOGGLE', () => setTimeout(handleResize, 500)),

    getUserIdentity: async () => {
      const insights = window.insights;
      const user = await insights.chrome.auth.getUser();
      return user ? user.identity : undefined;
    },
    basename: '/openshift/cost-management',
  };

  initUILib(initUiProps);

  return configureStore({
    // session: {
    //   token: getToken(),
    // },
  });
};

const costStore = initLibs();

const AppEntry = () => {
  const locale = getLocale();

  return (
    <IntlProvider defaultLocale="en" locale={locale} messages={messages[locale]} onError={console.log}>
      <Provider store={costStore}>
        <NotificationsPortal />
        <App />
      </Provider>
    </IntlProvider>
  );
};

export default AppEntry;
