import type { ProviderType } from '@koku-ui/api/providers';
import type { ProvidersQuery } from '@koku-ui/api/queries/providersQuery';

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

export const ocpProvidersQuery: ProvidersQuery = {
  limit: 100,
  type: 'OCP',
};

// Omitting the type param, returns all providers
export const providersQuery: ProvidersQuery = {
  limit: 1000,
};

export function getFetchId(type: ProviderType, provideQueryString: string) {
  return `${type}--${provideQueryString}`;
}
