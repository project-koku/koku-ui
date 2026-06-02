import { ScalprumProvider } from '@scalprum/react-core';
import { FlagProvider } from '@unleash/proxy-client-react';
import { getOnpremRouterBasename, RBAC_ONPREM_REMOTE } from 'onpremRemotes';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppLayout from './AppLayout';

const chromeStub = {
  auth: {
    getToken: async () => '',
    getUser: async () => ({
      identity: {
        user: {
          is_org_admin: true,
          email: 'dev@example.com',
          first_name: 'Dev',
          is_active: true,
          is_internal: false,
          last_name: 'User',
          locale: 'en',
          username: 'dev-user',
        },
        org_id: 'dev-org',
        type: 'User',
      },
      entitlements: {
        openshift: { is_entitled: true, is_trial: false },
        settings: { is_entitled: true, is_trial: false },
      },
    }),
  },
  getUserPermissions: async () => [],
  getEnvironment: () => 'prod',
  getEnvironmentDetails: async () => ({}),
  on: () => {},
  appNavClick: () => {},
  updateDocumentTitle: () => {},
  quickStarts: {
    set: () => {},
    toggle: () => {},
    Catalog: () => null,
  },
};

(window as Window & { insights?: { chrome: typeof chromeStub } }).insights = {
  chrome: chromeStub,
};

const config = {
  costManagement: {
    name: 'costManagement',
    manifestLocation: '/costManagement/plugin-manifest.json',
  },
  costManagementRos: {
    name: 'costManagementRos',
    manifestLocation: '/costManagementRos/plugin-manifest.json',
  },
  sources: {
    name: 'sources',
    manifestLocation: '/sources/plugin-manifest.json',
  },
  [RBAC_ONPREM_REMOTE.scope]: {
    name: RBAC_ONPREM_REMOTE.scope,
    manifestLocation: RBAC_ONPREM_REMOTE.manifestLocation,
  },
};

const App = () => {
  return (
    <ScalprumProvider config={config} api={{}}>
      <FlagProvider>
        <BrowserRouter basename={getOnpremRouterBasename()}>
          <AppLayout />
        </BrowserRouter>
      </FlagProvider>
    </ScalprumProvider>
  );
};

export default App;
