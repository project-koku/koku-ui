import type { ToolbarLabelGroup } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import type { Filter } from 'routes/utils/filter';
import { awsCategoryKey, awsCategoryPrefix, exactPrefix, orgUnitIdKey, tagKey, tagPrefix } from 'utils/props';

import { ExcludeType } from './exclude';

export interface Filters {
  [key: string]: Filter[] | { [key: string]: Filter[] };
}

export interface ToolbarChipGroupExt extends ToolbarLabelGroup {
  ariaLabelKey?: string;
  placeholderKey?: string;
  resourceKey?: string;
  selectClassName?: string; // A selector from routes/components/dataToolbar/dataToolbar.scss
  selectOptions?: ToolbarLabelGroup[];
}

export const defaultFilters = {
  [awsCategoryKey]: {},
  tag: {},
};

// Remove trailing commas -- see https://issues.redhat.com/browse/COST-3641
export const cleanInput = (value: string) => {
  return value.replace(/,*$/g, '').replace(/&*$/g, '');
};

export const getActiveFilters = query => {
  const filters = cloneDeep(defaultFilters);

  const parseFilters = (key, values, excludeType) => {
    if (key.indexOf(tagPrefix) !== -1) {
      if (filters.tag[key.substring(tagPrefix.length)]) {
        filters.tag[key.substring(tagPrefix.length)] = [
          ...filters.tag[key.substring(tagPrefix.length)],
          ...getFilters(key, values, excludeType),
        ];
      } else {
        filters.tag[key.substring(tagPrefix.length)] = getFilters(key, values, excludeType);
      }
    } else if (key.indexOf(awsCategoryPrefix) !== -1) {
      if (filters[awsCategoryKey][key.substring(awsCategoryPrefix.length)]) {
        filters[awsCategoryKey][key.substring(awsCategoryPrefix.length)] = [
          ...filters[awsCategoryKey][key.substring(awsCategoryPrefix.length)],
          ...getFilters(key, values, excludeType),
        ];
      } else {
        filters[awsCategoryKey][key.substring(awsCategoryPrefix.length)] = getFilters(key, values, excludeType);
      }
    } else if (filters[key]) {
      filters[key] = [...filters[key], ...getFilters(key, values, excludeType)];
    } else {
      filters[key] = getFilters(key, values, excludeType);
    }
  };

  if (query?.filter_by) {
    Object.keys(query.filter_by).forEach(key => {
      const excludeType = key.indexOf(exactPrefix) !== -1 ? ExcludeType.exact : undefined;

      const values = Array.isArray(query.filter_by[key]) ? [...query.filter_by[key]] : [query.filter_by[key]];
      const newKey = excludeType ? key.substring(excludeType.length + 1) : key;
      parseFilters(newKey, values, excludeType);
    });
  }
  if (query?.exclude) {
    Object.keys(query.exclude).forEach(key => {
      const values = Array.isArray(query.exclude[key]) ? [...query.exclude[key]] : [query.exclude[key]];
      parseFilters(key, values, ExcludeType.exclude);
    });
  }
  return filters;
};

export const getChips = (filters: Filter[]): string[] => {
  const chips = [];
  if (filters instanceof Array) {
    filters.forEach(item => {
      const value = item.toString ? item.toString() : undefined;
      const msg =
        item.excludeType === ExcludeType.exact
          ? messages.exactLabel
          : item.excludeType === ExcludeType.exclude
            ? messages.excludeLabel
            : undefined;

      chips.push({
        key: item.value,
        node: value || msg ? intl.formatMessage(msg, { value: item.value }) : item.value,
      });
    });
  }
  return chips;
};

export const getDefaultCategory = (categoryOptions: ToolbarLabelGroup[], groupBy: string, query: Query) => {
  if (!categoryOptions) {
    return 'name';
  }
  if (query && query.group_by && query.group_by[orgUnitIdKey]) {
    return orgUnitIdKey;
  }
  for (const option of categoryOptions) {
    if (groupBy === option.key || (groupBy && groupBy.indexOf(tagPrefix) !== -1 && option.key === tagKey)) {
      return option.key;
    }
  }
  return categoryOptions[0].key;
};

export const getFilter = (filterType: string, filterValue: string, excludeType, toString = undefined): Filter => {
  return { type: filterType, value: filterValue, excludeType, toString };
};

export const getFilters = (filterType: string, filterValues: string[], excludeType: ExcludeType): Filter[] => {
  return filterValues.map(value => getFilter(filterType, value, excludeType));
};

export const hasFilters = (filters: Filters) => {
  if (filters) {
    for (const filterKey of Object.keys(filters)) {
      if (filterKey === awsCategoryKey || filterKey === tagKey) {
        for (const key of Object.keys(filters[filterKey])) {
          if (filters[filterKey][key]) {
            return true;
          }
        }
      } else {
        return true;
      }
    }
  }
  return false;
};

export const onDelete = (type: any, chip: any, currentFilters) => {
  let filter = null; // Clear all
  let filters = cloneDeep(defaultFilters);

  // Todo: workaround for https://github.com/patternfly/patternfly-react/issues/3552
  // This prevents us from using a localized string, if necessary
  let _type = type && type.key ? type.key : type;
  if (_type && _type.indexOf(tagPrefix) !== -1) {
    _type = _type.slice(tagPrefix.length);
  } else if (_type && _type.indexOf(awsCategoryPrefix) !== -1) {
    _type = _type.slice(awsCategoryPrefix.length);
  }

  if (_type) {
    const exactPrefix = intl.formatMessage(messages.exactLabel, { value: '' });
    const excludePrefix = intl.formatMessage(messages.excludeLabel, { value: '' });

    let id = chip && chip.key ? chip.key : chip;
    if (id && id.indexOf(exactPrefix) !== -1) {
      const isExact = id ? id.indexOf(exactPrefix) !== -1 : false;
      id = isExact ? id.slice(exactPrefix.length) : id;
    }
    if (id && id.indexOf(excludePrefix) !== -1) {
      const isExclude = id ? id.indexOf(excludePrefix) !== -1 : false;
      id = isExclude ? id.slice(excludePrefix.length) : id;
    }

    if (currentFilters.tag[_type]) {
      filter = currentFilters.tag[_type].find(item => item.value === id);
    } else if (currentFilters[awsCategoryKey][_type]) {
      filter = currentFilters[awsCategoryKey][_type].find(item => item.value === id);
    } else if (currentFilters[_type]) {
      filter = (currentFilters[_type] as Filter[]).find(item => item.value === id);
    }

    const newFilters: any = cloneDeep(currentFilters);
    if (newFilters.tag[_type]) {
      // Todo: use ID
      newFilters.tag[_type] = newFilters.tag[_type].filter(item => item.value !== id);
    } else if (newFilters[awsCategoryKey][_type]) {
      newFilters[awsCategoryKey][_type] = newFilters[awsCategoryKey][_type].filter(item => item.value !== id);
    } else if (newFilters[_type]) {
      newFilters[_type] = newFilters[_type].filter(item => item.value !== id);
    }
    filters = newFilters;
  }
  return {
    filter,
    filters,
  };
};
