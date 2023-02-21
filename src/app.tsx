import './app.scss';

import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Reducer } from 'redux';

import pkg from '../package.json';
import { useFeatureFlags } from './components/featureFlags';
import { Routes } from './routes';

const App = () => {
  const navigate = useNavigate();
  const { on, updateDocumentTitle } = useChrome();

  useEffect(() => {
    const registry = getRegistry();
    registry.register({ notifications: notificationsReducer as Reducer });

    // You can use directly the name of your app
    updateDocumentTitle(pkg.insights.appname);
    const unregister = on('APP_NAVIGATION', event => navigate(`/${event.navId}`));

    return () => {
      unregister();
    };
  }, []);

  useFeatureFlags();

  return (
    <div className="cost-management">
      <NotificationsPortal />
      <Routes />
    </div>
  );
};

export default App;
