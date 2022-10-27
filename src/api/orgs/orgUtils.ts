import { runOrg as runAwsOrg } from './awsOrgs';
import type { OrgType } from './org';
import { OrgPathsType } from './org';

export function runOrg(orgPathsType: OrgPathsType, orgType: OrgType, query: string) {
  let orgReport;
  switch (orgPathsType) {
    case OrgPathsType.aws:
      orgReport = runAwsOrg(orgType, query);
      break;
  }
  return orgReport;
}
