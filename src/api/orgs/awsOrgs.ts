import axios from 'axios';

import type { Org } from './org';
import { OrgType } from './org';

export interface AwsOrg extends Org {}

export const OrgTypePaths: Partial<Record<OrgType, string>> = {
  [OrgType.org]: 'organizations/aws/',
};

export function runOrg(orgType: OrgType, query: string) {
  const path = OrgTypePaths[orgType];
  return axios.get<AwsOrg>(`${path}?${query}`);
}
