import type { Query } from 'api/queries/query';

export const getExcludeById = (query: Query, id: string) => {
  return query?.exclude?.[id]?.[0] ?? undefined;
};

export const getFilterById = (query: Query, id: string) => {
  return query?.filter_by?.[id]?.[0] ?? undefined;
};
