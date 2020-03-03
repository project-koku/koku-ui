import axios from 'axios';
import { PagedLinks, PagedMetaData } from './api';
import {
  ProviderAuthentication,
  ProviderBillingSource,
  ProviderCreatedBy,
  ProviderCustomer,
} from './providers';

export interface ProviderCostModel {
  name: string;
  uuid: string;
}

export interface Provider {
  uuid?: string;
  name?: string;
  type?: string;
  authentication?: ProviderAuthentication;
  billing_source?: ProviderBillingSource;
  customer?: ProviderCustomer;
  created_by?: ProviderCreatedBy;
  created_timestamp?: Date;
  cost_models?: ProviderCostModel[];
}

export interface Providers {
  meta: PagedMetaData;
  links?: PagedLinks;
  data: Provider[];
}

export const enum ProviderType {
  aws = 'aws',
  azure = 'azure',
  ocp = 'ocp',
}

export function fetchProviders(query: string) {
  const queryString = query ? `?${query}` : '';
  return axios.get<Providers>(`providers/${queryString}`);
}
