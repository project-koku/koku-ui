import type { Query } from 'api/queries/query';

export const getGroupById = (query: Query) => {
  const groupBys = query?.group_by ? Object.keys(query.group_by) : [];
  return groupBys.find(key => key !== undefined);
};

export const getGroupByValue = (query: Query) => {
  const groupById = getGroupById(query);
  return groupById ? query.group_by[groupById] : undefined;
};
