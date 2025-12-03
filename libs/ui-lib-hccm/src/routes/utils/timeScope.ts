import type { Query } from '@koku-ui/api/queries/query';

export const getTimeScope = (query: Query) => {
  const filters = query?.filter ? Object.keys(query.filter) : [];
  return filters.find(key => key === 'time_scope_value');
};

export const getTimeScopeValue = (query: Query) => {
  const timeScope = getTimeScope(query);
  return timeScope ? query.filter[timeScope] : -1;
};
