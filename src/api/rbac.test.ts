import { getRBAC } from './rbac';

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
