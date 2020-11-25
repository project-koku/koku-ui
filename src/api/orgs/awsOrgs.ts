import axios from 'axios';

import { Org, OrgType } from './org';

export interface AwsOrg extends Org {}

export const OrgTypePaths: Partial<Record<OrgType, string>> = {
  [OrgType.org]: 'organizations/aws/',
};

export function runOrg(orgType: OrgType, query: string) {
  const path = OrgTypePaths[orgType];
  return axios.get<AwsOrg>(`${path}?${query}`);
}
