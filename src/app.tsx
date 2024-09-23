import './app.scss';

import NotificationsPortal from '@ausuliv/frontend-components-notifications/NotificationPortal';
import { notificationsReducer } from '@ausuliv/frontend-components-notifications/redux';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import React, { useEffect, useLayoutEffect } from 'react';
import { invalidateSession } from 'utils/sessionStorage';

import pkg from '../package.json';
import { useFeatureToggle } from './components/featureToggle';
import { Routes } from './routes';

const App = () => {
  const { updateDocumentTitle } = useChrome();

  useEffect(() => {
    const registry = getRegistry();
    registry.register({ notifications: notificationsReducer as any });

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

  return (
    <>
      <NotificationsPortal />
      <Routes />
    </>
  );
};

export default App;
