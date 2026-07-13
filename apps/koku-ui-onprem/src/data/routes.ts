export interface NavRoute {
  path: string;
  title: string;
}

export const COST_BASENAME = '/openshift/cost-management';
export const IAM_BASENAME = '/iam';

export const isIamPath = (path: string): boolean => path.startsWith(IAM_BASENAME);
export const stripIamBasename = (path: string): string => path.slice(IAM_BASENAME.length) || '/';

export const costRoutes: NavRoute[] = [
  { path: COST_BASENAME, title: 'Overview' },
  { path: `${COST_BASENAME}/optimizations`, title: 'Optimizations' },
  { path: `${COST_BASENAME}/ocp`, title: 'OpenShift' },
  { path: `${COST_BASENAME}/aws`, title: 'Amazon Web Services' },
  { path: `${COST_BASENAME}/gcp`, title: 'Google Cloud' },
  { path: `${COST_BASENAME}/azure`, title: 'Microsoft Azure' },
  { path: `${COST_BASENAME}/explorer`, title: 'Cost Explorer' },
  { path: `${COST_BASENAME}/settings`, title: 'Settings' },
];

export const iamRoutes: NavRoute[] = [
  { path: `${IAM_BASENAME}/user-access/users`, title: 'Users' },
  { path: `${IAM_BASENAME}/user-access/roles`, title: 'Roles' },
  { path: `${IAM_BASENAME}/user-access/groups`, title: 'Groups' },
];

export const MY_USER_ACCESS_PATH = `${IAM_BASENAME}/my-user-access?bundle=openshift`;
