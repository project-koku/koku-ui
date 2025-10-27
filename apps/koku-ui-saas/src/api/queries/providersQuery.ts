import { parse, stringify } from 'qs';

export interface ProvidersQuery {
  limit?: number;
  page_size?: number;
  type?: 'AWS' | 'Azure' | 'GCP' | 'OCP';
}

export function getProvidersQuery(query: ProvidersQuery) {
  return stringify(query, { encode: false, indices: false });
}

export function parseProvidersQuery<T = any>(query: string): T {
  return parse(query, { ignoreQueryPrefix: true }) as any;
}
