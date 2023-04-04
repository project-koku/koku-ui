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
  return axios.get<AccountSettings>(`account-settings/`);
}
