import type { UserAccessQuery } from '@koku-ui/api/queries/userAccessQuery';
import type { UserAccessType } from '@koku-ui/api/userAccess';

export const stateKey = 'userAccess';

export const awsUserAccessQuery: UserAccessQuery = {
  type: 'AWS',
};

export const azureUserAccessQuery: UserAccessQuery = {
  type: 'Azure',
};

export const costModelUserAccessQuery: UserAccessQuery = {
  type: 'cost_model',
};

export const ocpUserAccessQuery: UserAccessQuery = {
  type: 'OCP',
};

export const gcpUserAccessQuery: UserAccessQuery = {
  type: 'GCP',
};

// Omitting the type param returns all user access
export const userAccessQuery: UserAccessQuery = {};

export function getFetchId(userAccessType: UserAccessType, userAccessQueryString: string) {
  return `${userAccessType}--${userAccessQueryString}`;
}
