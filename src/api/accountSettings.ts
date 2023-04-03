import axios from 'axios';

import type { PagedLinks, PagedMetaData } from './api';
import type { AwsOcpTag } from './tags/awsOcpTags';

export interface AccountSettingsData {
  cost_type?: string;
  currency?: string;
}

export interface AccountSettings {
  meta: PagedMetaData;
  links?: PagedLinks;
  data: AccountSettingsData;
}

export function fetchAccountSettings() {
  const fetch = () => axios.get<AwsOcpTag>(`account-settings/`);

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}
