import type { UserAccessQuery } from 'api/queries/userAccessQuery';
import type { UserAccessType } from 'api/userAccess';

export const stateKey = 'userAccess';
export const userAccessKey = 'user-access';

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

export const ibmUserAccessQuery: UserAccessQuery = {
  type: 'IBM',
  beta: true,
};

// Omitting the type param returns all user access
export const userAccessQuery: UserAccessQuery = {};

export function getReportId(type: UserAccessType, query: string) {
  return `${type}--${query}`;
}
