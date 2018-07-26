import { stringify } from 'qs';

interface Filters {
  time_scope_value: number;
  time_scope_units: 'month' | 'day';
  resolution: 'daily' | 'monthly';
}

type GroupByValue = string | string[];

interface GroupBys {
  service: GroupByValue;
  account: GroupByValue;
}

export interface Query {
  filter?: Partial<Filters>;
  group_by?: Partial<GroupBys>;
}

export function getQuery(query: Query) {
  return stringify(query, { encode: false });
}
