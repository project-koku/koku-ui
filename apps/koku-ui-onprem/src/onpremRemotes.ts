/** Scalprum / federation constants shared by the on-prem host (FLPATH-4164). */
export const RBAC_ONPREM_REMOTE = {
  scope: 'insightsRbac',
  manifestLocation: '/rbac/plugin-manifest.json',
  module: './Iam',
  publicPath: '/rbac/',
} as const;

/** Upstream IAM app uses `/iam` as router basename (see insights-rbac-frontend useAppLink). */
export const RBAC_IAM_ROUTE_PREFIX = '/iam';

/** Single host BrowserRouter basename when the document is under `/iam` (avoids nested MemoryRouter). */
export const getOnpremRouterBasename = (): string | undefined =>
  typeof window !== 'undefined' && window.location.pathname.startsWith(RBAC_IAM_ROUTE_PREFIX)
    ? RBAC_IAM_ROUTE_PREFIX
    : undefined;

export const isOnpremIamBasename = (): boolean => getOnpremRouterBasename() === RBAC_IAM_ROUTE_PREFIX;

/** In-app paths for IAM nav (relative when basename is `/iam`). */
export const RBAC_MY_USER_ACCESS_PATH = '/my-user-access';
export const RBAC_IAM_OVERVIEW_PATH = '/user-access/overview';
export const RBAC_IAM_USERS_PATH = '/user-access/users';
export const RBAC_IAM_ROLES_PATH = '/user-access/roles';
export const RBAC_IAM_GROUPS_PATH = '/user-access/groups';

/** Host sidebar IAM children — Stefan order (FLPATH-4164 UX). */
export const IAM_NAV_ITEMS = [
  { label: 'Overview', segment: RBAC_IAM_OVERVIEW_PATH },
  { label: 'My User Access', segment: RBAC_MY_USER_ACCESS_PATH },
  { label: 'Users', segment: RBAC_IAM_USERS_PATH },
  { label: 'Roles', segment: RBAC_IAM_ROLES_PATH },
  { label: 'Groups', segment: RBAC_IAM_GROUPS_PATH },
] as const;

/** Full browser path for host sidebar IAM links (always include `/iam`). */
export const toIamHostNavPath = (segment: string): string => `${RBAC_IAM_ROUTE_PREFIX}${segment}`;
