import './app.scss';

import UiVersion from '@koku-ui/ui-lib/components/page/uiVersion';
import { isOnPremNotificationsHost } from '@koku-ui/ui-lib/onPremNotificationsHost';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { createStore } from '@redhat-cloud-services/frontend-components-notifications/state';
import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { invalidateSession } from 'utils/sessionStorage';

import pkg from '../package.json';
import { useFeatureToggle } from './components/featureToggle';
import { Routes } from './routes';

const App = () => {
  const { updateDocumentTitle } = useChrome();
  const notificationsStore = useMemo(() => createStore(), []);
  const useHostNotifications = isOnPremNotificationsHost();

  useEffect(() => {
    // You can use directly the name of your app
    updateDocumentTitle(pkg.insights.appname);
  }, []);

  // Initialize Unleash feature toggles
  useFeatureToggle();

  // Clear local storage value if current session is not valid
  invalidateSession();

  useLayoutEffect(() => {
    const el = document.querySelector<HTMLDivElement>('.chr-scope__default-layout');
    if (el) {
      el.style.overflow = 'auto';
    }
  }, []);

  if (useHostNotifications) {
    return (
      <div>
        <Routes />
        <UiVersion />
      </div>
    );
  }

  return (
    <div>
      <NotificationsProvider store={notificationsStore}>
        <Routes />
      </NotificationsProvider>
      <UiVersion />
    </div>
  );
};

export default App;
