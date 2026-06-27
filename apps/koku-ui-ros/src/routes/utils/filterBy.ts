import type { Query } from 'api/queries/query';

export const getExcludeById = (query: Query, id: string) => {
  const value = query?.exclude?.[id];
  return (Array.isArray(value) ? value[0] : value) ?? undefined;
};

export const getFilterById = (query: Query, id: string) => {
  const value = query?.filter_by?.[id];
  return (Array.isArray(value) ? value[0] : value) ?? undefined;
};
