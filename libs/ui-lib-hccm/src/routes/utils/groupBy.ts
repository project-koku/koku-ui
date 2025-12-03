import type { Query } from '@koku-ui/api/queries/query';

import { awsCategoryPrefix, exactPrefix, orgUnitIdKey, tagPrefix } from '../../utils/props';

export const getGroupById = (query: Query) => {
  const groupBys = query?.group_by ? Object.keys(query.group_by) : [];
  return groupBys.find(key => key !== orgUnitIdKey);
};

export const getGroupByValue = (query: Query) => {
  const groupById = getGroupById(query);
  return groupById ? query.group_by[groupById] : undefined;
};

export const getGroupByOrgValue = (query: Query) => {
  let groupByOrg;

  if (query?.group_by) {
    for (const groupBy of Object.keys(query.group_by)) {
      if (groupBy === orgUnitIdKey) {
        groupByOrg = query.group_by[orgUnitIdKey];
        break;
      }
    }
  }
  return groupByOrg;
};

export const getGroupByCostCategory = (query: Query) => {
  let groupByCategoryKey;

  if (query?.group_by) {
    for (const groupBy of Object.keys(query.group_by)) {
      const tagIndex = groupBy.indexOf(awsCategoryPrefix);
      if (tagIndex !== -1) {
        groupByCategoryKey = groupBy.substring(tagIndex + awsCategoryPrefix.length) as any;
        break;
      }
    }
  }
  return groupByCategoryKey;
};

export const getGroupByTagKey = (query: Query) => {
  let groupByTagKey;

  if (query?.group_by) {
    for (const groupBy of Object.keys(query.group_by)) {
      const tagIndex = groupBy.indexOf(tagPrefix);
      if (tagIndex !== -1) {
        groupByTagKey = groupBy.substring(tagIndex + tagPrefix.length) as any;
        break;
      }
    }
  }
  return groupByTagKey;
};

export const getExcludeTagKey = (query: Query) => {
  let excludeTagKey;

  if (query?.exclude) {
    for (const groupBy of Object.keys(query.exclude)) {
      const tagIndex = groupBy.indexOf(tagPrefix);
      if (tagIndex !== -1) {
        excludeTagKey = groupBy.substring(tagIndex + tagPrefix.length) as any;
        break;
      }
    }
  }
  return excludeTagKey;
};

export const getFilterByTagKey = (query: Query) => {
  let filterByTagKey;

  if (query?.filter_by) {
    for (const groupBy of Object.keys(query.filter_by)) {
      const exactTagPrefix = `${exactPrefix}${tagPrefix}`;
      const exactTagIndex = groupBy.indexOf(exactTagPrefix);
      const tagIndex = groupBy.indexOf(tagPrefix);
      if (exactTagIndex !== -1) {
        filterByTagKey = groupBy.substring(exactTagIndex + exactTagPrefix.length) as any;
        break;
      } else if (tagIndex !== -1) {
        filterByTagKey = groupBy.substring(tagIndex + tagPrefix.length) as any;
        break;
      }
    }
  }
  return filterByTagKey;
};
