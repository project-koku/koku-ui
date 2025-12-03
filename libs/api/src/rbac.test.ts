import { getRBAC, setRBACFunction } from './rbac';

beforeEach(() => {
  setRBACFunction(async () => {
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
  });
});

test('getRBAC sad path', () => {
  getRBAC().then(resp => {
    expect(resp).toEqual({ isOrgAdmin: false, permissions: null });
  });
});

test('getRBAC happy path', () => {
  global.window.insights = {
    chrome: {
      auth: {
        getUser: () =>
          new Promise(res => {
            return res({
              identity: {
                type: 'User',
                user: {
                  is_org_admin: true,
                },
              },
            });
          }),
      },
      getUserPermissions: () =>
        new Promise(res => {
          return res([]);
        }),
    },
  };

  getRBAC().then(resp => {
    expect(resp).toEqual({ isOrgAdmin: true, permissions: [] });
  });
});
