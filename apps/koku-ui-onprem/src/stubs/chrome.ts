import { type AccessPermission, fetchCurrentUser, fetchUserPermissions } from '#/data/api';

let permissionsCache: AccessPermission[] | null = null;
let permissionsCacheKey: string | null = null;

const chromeStub = {
  auth: {
    getToken: async () => '',
    getUser: async () => {
      const user = await fetchCurrentUser();
      return {
        identity: {
          user: {
            email: user.email || 'dev@example.com',
            first_name: 'Dev',
            is_active: true,
            is_internal: false,
            is_org_admin: Boolean(user.is_org_admin),
            last_name: 'User',
            locale: 'en',
            username: user.username || 'dev-user',
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
  getUserPermissions: async (applicationName = '', disableCache = false) => {
    const cacheKey = applicationName || '';
    if (!disableCache && permissionsCache && permissionsCacheKey === cacheKey) {
      return permissionsCache;
    }

    try {
      permissionsCache = await fetchUserPermissions(applicationName);
      permissionsCacheKey = cacheKey;
      return permissionsCache;
    } catch {
      return [];
    }
  },
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
