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
  paused?: boolean;
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
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  rhel = 'ocp', // Todo: Update to use rhel when APIs are available
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  ros = 'ocp', // Todo: Update to use rhel when APIs are available
}

export function fetchProviders(query: string) {
  const queryString = query ? `?${query}` : '';
  return axios.get<Providers>(`sources/${queryString}`);
}
