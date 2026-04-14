import { ScalprumProvider } from '@scalprum/react-core';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppLayout from './AppLayout';

(window as any).insights = {
  chrome: {
    auth: {
      getUser: async () => ({
        identity: {
          user: {
            is_org_admin: true,
            email: '',
            first_name: '',
            is_active: true,
            is_internal: false,
            last_name: '',
            locale: 'en',
            username: '',
          },
          org_id: '',
          type: '',
        },
        entitlements: {},
      }),
    } as any,
    getUserPermissions: async () => [],
    on: () => {},
  } as any,
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
};

const App = () => {
  return (
    <ScalprumProvider config={config} api={{}}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppLayout />
      </BrowserRouter>
    </ScalprumProvider>
  );
};

export default App;
