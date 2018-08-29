import axios from 'axios';

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

export interface ProviderRequest {
  name: string;
  type: string;
  authentication: ProviderAuthentication;
  billing_source: ProviderBillingSource;
}

export interface Provider {
  uuid?: string;
  name?: string;
  type?: string;
  authentication?: ProviderAuthentication;
  billing_source?: ProviderBillingSource;
  customer?: ProviderCustomer;
  created_by?: ProviderCreatedBy;
}

export interface Providers {
  count?: number;
  next?: string;
  previous?: string;
  results: Provider[];
}

// See: http://koku-koku-dev.1b13.insights.openshiftapps.com/apidoc/index.html#api-Provider-createProvider
export function addProvider(request: ProviderRequest) {
  return axios.post<Provider>('providers/', request);
}

// See: http://koku-koku-dev.1b13.insights.openshiftapps.com/apidoc/index.html#api-Provider-GetProvider
export function getProviders() {
  return axios.get<Providers>(`providers/`);
}
