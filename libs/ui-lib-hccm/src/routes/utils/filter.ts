import type { Query } from '@koku-ui/api/queries/query';

import { CriteriaType } from '../components/dataToolbar/utils/criteria';

export interface Filter {
  excludeType?: CriteriaType;
  toString?: () => string;
  type?: string;
  value?: string;
}

enum QueryFilterType {
  exclude = 'exclude',
  filter = 'filter_by',
}

export const addFilterToQuery = (query: Query, filter: Filter) => {
  return addQueryFilter(
    query,
    filter?.excludeType === CriteriaType.exact ? `exact:${filter?.type}` : filter?.type,
    filter?.value,
    filter?.excludeType === CriteriaType.exclude ? QueryFilterType.exclude : QueryFilterType.filter
  );
};

export const addQueryFilter = (
  query: Query,
  filterType: string,
  filterValue: string,
  queryFilterType: QueryFilterType
) => {
  const newQuery = { ...JSON.parse(JSON.stringify(query)) };
  if (!newQuery[queryFilterType]) {
    newQuery[queryFilterType] = {};
  }

  // Filter by * won't generate a new request if group_by * already exists
  if (filterValue === '*' && newQuery.group_by[filterType] === '*') {
    return;
  }

  if (newQuery[queryFilterType] && newQuery[queryFilterType][filterType]) {
    let found = false;
    const filters = newQuery[queryFilterType][filterType];
    if (!Array.isArray(filters)) {
      found = filterValue === newQuery[queryFilterType][filterType];
    } else {
      for (const filter of filters) {
        if (filter === filterValue) {
          found = true;
          break;
        }
      }
    }
    if (!found) {
      if (Array.isArray(newQuery[queryFilterType][filterType])) {
        newQuery[queryFilterType][filterType] = [...newQuery[queryFilterType][filterType], filterValue];
      } else {
        newQuery[queryFilterType][filterType] = [newQuery[queryFilterType][filterType], filterValue];
      }
    }
  } else {
    newQuery[queryFilterType][filterType] = [filterValue];
  }
  return newQuery;
};

export const removeFilterFromQuery = (query: Query, filter: Filter) => {
  // Clear all
  if (filter === null) {
    const newQuery = removeQueryFilter(query, null, null, QueryFilterType.exclude);
    return removeQueryFilter(newQuery, null, null, QueryFilterType.filter);
  } else {
    return removeQueryFilter(
      query,
      filter?.excludeType === CriteriaType.exact ? `exact:${filter?.type}` : filter?.type,
      filter?.value,
      filter.excludeType === CriteriaType.exclude ? QueryFilterType.exclude : QueryFilterType.filter
    );
  }
};

export const removeQueryFilter = (
  query: Query,
  filterType: string,
  filterValue: string,
  queryFilterType: QueryFilterType
) => {
  const newQuery = { ...JSON.parse(JSON.stringify(query)) };
  if (!newQuery[queryFilterType]) {
    newQuery[queryFilterType] = {};
  }

  if (filterType === null) {
    newQuery[queryFilterType] = undefined; // Clear all
  } else if (filterValue === null) {
    newQuery[queryFilterType][filterType] = undefined; // Clear all values
  } else if (Array.isArray(newQuery[queryFilterType][filterType])) {
    const index = newQuery[queryFilterType][filterType].indexOf(filterValue);
    if (index > -1) {
      newQuery[queryFilterType][filterType] = [
        ...query[queryFilterType][filterType].slice(0, index),
        ...query[queryFilterType][filterType].slice(index + 1),
      ];
    }
  } else {
    newQuery[queryFilterType][filterType] = undefined;
  }
  return newQuery;
};
