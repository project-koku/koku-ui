import axios from 'axios';

import type { PagedMetaData, PagedResponse } from './api';

export interface ProviderAuthentication {
  uuid?: string;
  provider_resource_name: string;
}

export interface ProviderBillingSource {
  uuid?: string;
  bucket: string;
}

export interface ProviderCreatedBy {
  uuid?: string;
  username?: string;
  email?: string;
}

export interface ProviderCustomer {
  uuid?: string;
  name?: string;
  owner?: ProviderCreatedBy;
  date_created?: string;
}

export interface ProviderCostModel {
  name: string;
  uuid: string;
}

export interface ProviderInfrastructure {
  type?: string;
  uuid?: string;
}

export interface Provider {
  active?: boolean;
  authentication?: ProviderAuthentication;
  billing_source?: ProviderBillingSource;
  created_by?: ProviderCreatedBy;
  created_timestamp?: Date;
  cost_models?: ProviderCostModel[];
  current_month_data?: boolean;
  customer?: ProviderCustomer;
  has_data?: boolean;
  infrastructure?: ProviderInfrastructure;
  name?: string;
  previous_month_data?: boolean;
  source_type?: string;
  type?: string;
  uuid?: string;
}

export interface Providers extends PagedResponse<Provider, PagedMetaData> {}

// eslint-disable-next-line no-shadow
export const enum ProviderType {
  all = 'all',
  aws = 'aws',
  azure = 'azure',
  gcp = 'gcp',
  ibm = 'ibm',
  oci = 'oci',
  ocp = 'ocp',
  rhel = 'ocp', // Todo: Update to use rhel when APIs are available
}

export function fetchProviders(query: string) {
  const insights = (window as any).insights;
  const queryString = query ? `?${query}` : '';
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<Providers>(`sources/${queryString}`);
    });
  } else {
    return axios.get<Providers>(`sources/${queryString}`);
  }
}
