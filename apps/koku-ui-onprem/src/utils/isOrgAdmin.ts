/** Keycloak realm role mirrored by the Envoy gateway when building X-Rh-Identity. */
export const ORG_ADMIN_REALM_ROLE = 'org-admin';

type HeaderValue = string | string[] | undefined;

export type RequestHeaders = Record<string, HeaderValue>;

const headerValue = (value: HeaderValue): string | undefined => (Array.isArray(value) ? value[0] : value);

/** True when oauth2-proxy forwarded realm roles include org-admin (via --pass-groups). */
export const isOrgAdminFromGroupsHeader = (groupsHeader: HeaderValue): boolean => {
  const groups = headerValue(groupsHeader);
  if (!groups) {
    return false;
  }

  return groups.split(',').some(group => group.trim() === ORG_ADMIN_REALM_ROLE);
};

/** Decode JWT payload and check realm_access.roles — same rule as Envoy Lua in the gateway. */
export const isOrgAdminFromJwt = (token: string): boolean => {
  const payload = decodeJwtPayload(token) as { realm_access?: { roles?: string[] } } | undefined;
  return Array.isArray(payload?.realm_access?.roles) && payload.realm_access.roles.includes(ORG_ADMIN_REALM_ROLE);
};

const decodeJwtPayload = (token: string): Record<string, unknown> | undefined => {
  try {
    const [, payloadSegment] = token.split('.');
    if (!payloadSegment) {
      return undefined;
    }

    const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(Buffer.from(normalized, 'base64').toString('utf8')) as Record<string, unknown>;
  } catch {
    return undefined;
  }
};

/** Resolve username from oauth2-proxy headers or the forwarded Bearer JWT. */
export const usernameFromAuthHeaders = (headers: RequestHeaders): string | undefined => {
  const preferred = headerValue(headers['x-auth-request-preferred-username']);
  if (preferred) {
    return preferred;
  }

  const user = headerValue(headers['x-auth-request-user']);
  if (user) {
    return user;
  }

  const authorization = headerValue(headers.authorization);
  if (!authorization) {
    return undefined;
  }

  const token = authorization.replace(/^Bearer\s+/i, '');
  const payload = decodeJwtPayload(token);
  const preferredUsername = payload?.preferred_username;
  if (typeof preferredUsername === 'string' && preferredUsername.length > 0) {
    return preferredUsername;
  }

  const subject = payload?.sub;
  return typeof subject === 'string' && subject.length > 0 ? subject : undefined;
};

/**
 * Derive org-admin status from oauth2-proxy auth headers.
 * When X-Auth-Request-Groups is present it is authoritative; otherwise decode the Bearer JWT.
 */
export const isOrgAdminFromAuthHeaders = (headers: RequestHeaders): boolean => {
  const groupsHeader = headers['x-auth-request-groups'];
  if (groupsHeader !== undefined) {
    return isOrgAdminFromGroupsHeader(groupsHeader);
  }

  const authorization = headerValue(headers.authorization);
  if (!authorization) {
    return false;
  }

  const token = authorization.replace(/^Bearer\s+/i, '');
  return isOrgAdminFromJwt(token);
};
