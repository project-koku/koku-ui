import { getRBAC } from './rbac';

test('getRBAC', () => {
  getRBAC().then(resp => {
    expect(resp).toEqual({ isOrgAdmin: false, permissions: null });
  });
});
