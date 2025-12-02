import type { OrgPathsType, OrgType } from '@koku-ui/api/orgs/org';

export const orgStateKey = 'org';

export function getFetchId(orgPathsType: OrgPathsType, orgType: OrgType, orgQueryString: string) {
  return `${orgPathsType}--${orgType}--${orgQueryString}`;
}
