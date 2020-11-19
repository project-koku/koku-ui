import { ProviderType } from 'api/providers';
import { ProvidersQuery } from 'api/queries/providersQuery';

export const stateKey = 'providers';
export const addProviderKey = 'add-provider';

export const awsProvidersQuery: ProvidersQuery = {
  type: 'AWS',
};

export const azureProvidersQuery: ProvidersQuery = {
  type: 'AZURE',
};

export const ocpProvidersQuery: ProvidersQuery = {
  type: 'OCP',
};

export const gcpProvidersQuery: ProvidersQuery = {
  type: 'GCP',
};

export function getReportId(type: ProviderType, query: string) {
  return `${type}--${query}`;
}
