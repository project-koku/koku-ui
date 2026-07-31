import type { Query } from 'api/queries/query';

export const getExcludeValuesById = (query: Query, id: string): string | string[] | undefined => {
  const value = query?.exclude?.[id];
  if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
    return undefined;
  }
  return value;
};

export const getFilterValuesById = (query: Query, id: string): string | string[] | undefined => {
  const value = query?.filter_by?.[id];
  if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
    return undefined;
  }
  return value;
};
