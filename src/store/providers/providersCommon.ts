import { ProviderType } from 'api/providers';
import { ProvidersQuery } from 'api/providersQuery';

export const stateKey = 'providers';
export const addProviderKey = 'add-provider';

export const awsProvidersQuery: ProvidersQuery = {
  // filter: {
  //   type: 'aws'
  // },
  page_size: 100,
};

export const ocpProvidersQuery: ProvidersQuery = {
  // filter: {
  //   type: 'aws'
  // },
  page_size: 100,
};

export function getReportId(type: ProviderType, query: string) {
  return `${type}--${query}`;
}
