import axiosInstance from '../api';
import type { Org } from './org';
import { OrgType } from './org';

export const AwsOrgTypePaths: Partial<Record<OrgType, string>> = {
  [OrgType.org]: 'organizations/aws/',
};

export function runOrg(orgType: OrgType, query: string) {
  const path = AwsOrgTypePaths[orgType];
  return axiosInstance.get<Org>(`${path}?${query}`);
}
