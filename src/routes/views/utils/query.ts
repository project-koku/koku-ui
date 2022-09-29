import { Query } from 'api/queries/query';

export interface Filter {
  isExcludes?: boolean;
  type?: string;
  value?: string;
}

export const addFilterToQuery = (query: Query, filter: Filter) => {
  if (filter.isExcludes) {
    return addQueryExclude(query, filter.type, filter.value);
  } else {
    return addQueryFilter(query, filter.type, filter.value);
  }
};

export const addQueryExclude = (query: Query, filterType: string, filterValue: string) => {
  const newQuery = { ...JSON.parse(JSON.stringify(query)) };
  if (!newQuery.exclude) {
    newQuery.exclude = {};
  }

  // Filter by * won't generate a new request if group_by * already exists
  if (filterValue === '*' && newQuery.group_by[filterValue] === '*') {
    return;
  }

  if (newQuery.exclude && newQuery.exclude[filterType]) {
    let found = false;
    const excludes = newQuery.exclude[filterType];
    if (!Array.isArray(excludes)) {
      found = filterValue === newQuery.exclude[filterType];
    } else {
      for (const exclude of excludes) {
        if (exclude === filterValue) {
          found = true;
          break;
        }
      }
    }
    if (!found) {
      newQuery.exclude[filterType] = [newQuery.exclude[filterType], filterValue];
    }
  } else {
    newQuery.exclude[filterType] = [filterValue];
  }
  return newQuery;
};

export const addQueryFilter = (query: Query, filterType: string, filterValue: string) => {
  const newQuery = { ...JSON.parse(JSON.stringify(query)) };
  if (!newQuery.filter_by) {
    newQuery.filter_by = {};
  }

  // Filter by * won't generate a new request if group_by * already exists
  if (filterValue === '*' && newQuery.group_by[filterType] === '*') {
    return;
  }

  if (newQuery.filter_by && newQuery.filter_by[filterType]) {
    let found = false;
    const filters = newQuery.filter_by[filterType];
    if (!Array.isArray(filters)) {
      found = filterValue === newQuery.filter_by[filterType];
    } else {
      for (const filter of filters) {
        if (filter === filterValue) {
          found = true;
          break;
        }
      }
    }
    if (!found) {
      newQuery.filter_by[filterType] = [newQuery.filter_by[filterType], filterValue];
    }
  } else {
    newQuery.filter_by[filterType] = [filterValue];
  }
  return newQuery;
};

export const removeFilterFromQuery = (query: Query, filter: Filter) => {
  // Clear all
  if (filter === null) {
    const excludesQuery = removeQueryExclude(query, null, null);
    return removeQueryFilter(excludesQuery, null, null);
  } else if (filter.isExcludes) {
    return removeQueryExclude(query, filter.type, filter.value);
  } else {
    return removeQueryFilter(query, filter.type, filter.value);
  }
};

export const removeQueryExclude = (query: Query, filterType: string, filterValue: string) => {
  const newQuery = { ...JSON.parse(JSON.stringify(query)) };
  if (!newQuery.exclude) {
    newQuery.exclude = {};
  }

  if (filterType === null) {
    newQuery.exclude = undefined; // Clear all
  } else if (filterValue === null) {
    newQuery.exclude[filterType] = undefined; // Clear all values
  } else if (Array.isArray(newQuery.exclude[filterType])) {
    const index = newQuery.exclude[filterType].indexOf(filterValue);
    if (index > -1) {
      newQuery.exclude[filterType] = [
        ...query.exclude[filterType].slice(0, index),
        ...query.exclude[filterType].slice(index + 1),
      ];
    }
  } else {
    newQuery.exclude[filterType] = undefined;
  }
  return newQuery;
};

export const removeQueryFilter = (query: Query, filterType: string, filterValue: string) => {
  const newQuery = { ...JSON.parse(JSON.stringify(query)) };
  if (!newQuery.filter_by) {
    newQuery.filter_by = {};
  }

  if (filterType === null) {
    newQuery.filter_by = undefined; // Clear all
  } else if (filterValue === null) {
    newQuery.filter_by[filterType] = undefined; // Clear all values
  } else if (Array.isArray(newQuery.filter_by[filterType])) {
    const index = newQuery.filter_by[filterType].indexOf(filterValue);
    if (index > -1) {
      newQuery.filter_by[filterType] = [
        ...query.filter_by[filterType].slice(0, index),
        ...query.filter_by[filterType].slice(index + 1),
      ];
    }
  } else {
    newQuery.filter_by[filterType] = undefined;
  }
  return newQuery;
};
