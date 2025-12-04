import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import AppLayout from './AppLayout';

window.insights = {
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

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
