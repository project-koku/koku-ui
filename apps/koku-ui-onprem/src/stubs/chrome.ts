import { fetchCurrentUser } from '#/data/api';

const chromeStub = {
  auth: {
    getToken: async () => '',
    getUser: async () => {
      const user = await fetchCurrentUser();
      return {
        identity: {
          user: {
            email: user.email,
            first_name: 'Dev',
            is_active: true,
            is_internal: false,
            is_org_admin: true,
            last_name: 'User',
            locale: 'en',
            username: user.username,
          },
          org_id: 'dev-org',
          type: 'User',
        },
        entitlements: {
          openshift: { is_entitled: true, is_trial: false },
          settings: { is_entitled: true, is_trial: false },
        },
      };
    },
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
