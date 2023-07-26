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

export interface CostTypePayload {
  cost_type?: string;
}

export interface CurrencyPayload {
  currency?: string;
}

export function fetchAccountSettings() {
  return axios.get<AccountSettings>(`account-settings/`);
}

export function updateCostType(payload: CostTypePayload) {
  return axios.put(`account-settings/cost-type`, payload);
}

export function updateCurrency(payload: CurrencyPayload) {
  return axios.put(`account-settings/currency`, payload);
}
