import { runOrg as runAwsOrg } from './awsOrgs';
import type { OrgType } from './org';
import { OrgPathsType } from './org';

export function runOrg(orgPathsType: OrgPathsType, orgType: OrgType, query: string) {
  let result;
  switch (orgPathsType) {
    case OrgPathsType.aws:
      result = runAwsOrg(orgType, query);
      break;
  }
  return result;
}
