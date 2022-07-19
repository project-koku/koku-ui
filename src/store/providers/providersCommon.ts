import { ProviderType } from 'api/providers';
import { ProvidersQuery } from 'api/queries/providersQuery';

export const stateKey = 'providers';
export const addProviderKey = 'add-provider';

export const awsProvidersQuery: ProvidersQuery = {
  limit: 100,
  type: 'AWS',
};

export const azureProvidersQuery: ProvidersQuery = {
  limit: 100,
  type: 'Azure',
};

export const gcpProvidersQuery: ProvidersQuery = {
  limit: 100,
  type: 'GCP',
};

export const ibmProvidersQuery: ProvidersQuery = {
  limit: 100,
  type: 'IBM',
};

export const ociProvidersQuery: ProvidersQuery = {
  limit: 100,
  type: 'OCI',
};

export const ocpProvidersQuery: ProvidersQuery = {
  limit: 100,
  type: 'OCP',
};

// Omitting the type param, returns all providers
export const providersQuery: ProvidersQuery = {
  limit: 1000,
};

export function getReportId(type: ProviderType, query: string) {
  return `${type}--${query}`;
}
