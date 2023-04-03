import axios from 'axios';

import type { Org } from './org';
import { OrgType } from './org';

export interface AwsOrg extends Org {}

export const OrgTypePaths: Partial<Record<OrgType, string>> = {
  [OrgType.org]: 'organizations/aws/',
};

export function runOrg(orgType: OrgType, query: string) {
  const path = OrgTypePaths[orgType];
  const fetch = () => axios.get<AwsOrg>(`${path}?${query}`);

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}
