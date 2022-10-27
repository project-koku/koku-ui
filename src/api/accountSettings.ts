import axios from 'axios';

import type { PagedLinks, PagedMetaData } from './api';

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
  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<AccountSettings>(`account-settings/`);
    });
  } else {
    return axios.get<AccountSettings>(`account-settings/`);
  }
}
