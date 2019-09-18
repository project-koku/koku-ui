import { ProviderType } from 'api/providers';
import { ProvidersQuery } from 'api/providersQuery';

export const stateKey = 'providers';
export const addProviderKey = 'add-provider';

export const awsProvidersQuery: ProvidersQuery = {
  type: 'AWS',
};

export const azureProvidersQuery: ProvidersQuery = {
  type: 'AWS', // Todo: update for Azure
};

export const ocpProvidersQuery: ProvidersQuery = {
  type: 'OCP',
};

export function getReportId(type: ProviderType, query: string) {
  return `${type}--${query}`;
}
