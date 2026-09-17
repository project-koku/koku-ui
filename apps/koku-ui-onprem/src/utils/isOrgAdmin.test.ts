import {
  isOrgAdminFromAuthHeaders,
  isOrgAdminFromGroupsHeader,
  isOrgAdminFromJwt,
  usernameFromAuthHeaders,
} from './isOrgAdmin';

const adminJwtPayload = Buffer.from(
  JSON.stringify({
    preferred_username: 'admin',
    realm_access: { roles: ['org-admin', 'default-roles-kubernetes'] },
  })
).toString('base64url');

const viewerJwtPayload = Buffer.from(
  JSON.stringify({
    realm_access: { roles: ['default-roles-kubernetes'] },
  })
).toString('base64url');

const adminJwt = `header.${adminJwtPayload}.signature`;
const viewerJwt = `header.${viewerJwtPayload}.signature`;

describe('isOrgAdminFromGroupsHeader', () => {
  it('returns true when org-admin is present', () => {
    expect(isOrgAdminFromGroupsHeader('default-roles-kubernetes,org-admin')).toBe(true);
  });

  it('returns false when org-admin is absent', () => {
    expect(isOrgAdminFromGroupsHeader('default-roles-kubernetes')).toBe(false);
  });
});

describe('isOrgAdminFromJwt', () => {
  it('returns true for admin realm role', () => {
    expect(isOrgAdminFromJwt(adminJwt)).toBe(true);
  });

  it('returns false for viewer realm roles', () => {
    expect(isOrgAdminFromJwt(viewerJwt)).toBe(false);
  });
});

describe('usernameFromAuthHeaders', () => {
  it('prefers x-auth-request-preferred-username', () => {
    expect(
      usernameFromAuthHeaders({
        'x-auth-request-preferred-username': 'admin',
        authorization: `Bearer ${viewerJwt}`,
      })
    ).toBe('admin');
  });

  it('falls back to JWT preferred_username', () => {
    expect(
      usernameFromAuthHeaders({
        authorization: `Bearer ${adminJwt}`,
      })
    ).toBe('admin');
  });
});

describe('isOrgAdminFromAuthHeaders', () => {
  it('uses x-auth-request-groups when org-admin is present, ignoring JWT', () => {
    expect(
      isOrgAdminFromAuthHeaders({
        'x-auth-request-groups': 'org-admin',
        authorization: `Bearer ${viewerJwt}`,
      })
    ).toBe(true);
  });

  it('treats a present non-admin groups header as authoritative over an admin JWT', () => {
    expect(
      isOrgAdminFromAuthHeaders({
        'x-auth-request-groups': 'default-roles-kubernetes',
        authorization: `Bearer ${adminJwt}`,
      })
    ).toBe(false);
  });

  it('falls back to JWT when groups header is absent', () => {
    expect(
      isOrgAdminFromAuthHeaders({
        authorization: `Bearer ${adminJwt}`,
      })
    ).toBe(true);
  });

  it('returns false when neither header indicates org-admin', () => {
    expect(isOrgAdminFromAuthHeaders({})).toBe(false);
  });
});
