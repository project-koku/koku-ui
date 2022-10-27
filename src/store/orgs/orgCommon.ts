import type { OrgPathsType, OrgType } from 'api/orgs/org';

export const orgStateKey = 'org';

export function getOrgId(orgPathsType: OrgPathsType, orgType: OrgType, query: string) {
  return `${orgPathsType}--${orgType}--${query}`;
}
