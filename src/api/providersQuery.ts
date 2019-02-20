import { parse, stringify } from 'qs';

export interface ProvidersFilters {
  type?: 'aws' | 'ocp';
}

export interface ProvidersQuery {
  filter?: ProvidersFilters;
  page_size?: number;
}

export function getProvidersQuery(query: ProvidersQuery) {
  return stringify(query, { encode: false, indices: false });
}

export function parseProvidersQuery<T = any>(query: string): T {
  return parse(query, { ignoreQueryPrefix: true });
}
