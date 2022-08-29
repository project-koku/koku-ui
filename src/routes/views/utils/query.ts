import { Query } from 'api/queries/query';

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
