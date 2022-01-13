import axios from 'axios';

import { PagedResponse } from './api';

// To do: Adjust when account-settings API is available
export interface AccountSettingsData {
  code?: string;
  description?: string;
  name?: string;
}

export interface AccountSettingsMeta {
  count?: string;
  ['cost-type']?: string;
  currency?: string;
}

export interface AccountSettings extends PagedResponse<AccountSettingsData, AccountSettingsMeta> {}

export function fetchAccountSettings() {
  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<AccountSettings>(`cost-type/`); // To do: Use account-settings API when available
    });
  } else {
    return axios.get<AccountSettings>(`cost-type/`); // To do: Use account-settings API when available
  }
}
