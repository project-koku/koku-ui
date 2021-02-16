import { parse, stringify } from 'qs';

export interface UserAccessQuery {
  page_size?: number;
  type?: '' | 'AWS' | 'AZURE' | 'cost_model' | 'GCP' | 'OCP';
}

export function getUserAccessQuery(query: UserAccessQuery) {
  return stringify(query, { encode: false, indices: false });
}

export function parseUserAccessQuery<T = any>(query: string): T {
  return parse(query, { ignoreQueryPrefix: true }) as any;
}
