import type { Query } from '@koku-ui/api/queries/query';
import { intl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import type { ToolbarLabelGroup } from '@patternfly/react-core';
import { cloneDeep } from 'lodash';

import {
  awsCategoryKey,
  awsCategoryPrefix,
  exactPrefix,
  excludeKey,
  orgUnitIdKey,
  tagKey,
  tagPrefix,
} from '../../../../utils/props';
import type { Filter } from '../../../utils/filter';
import { CriteriaType } from './criteria';

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
      const excludeType = key.indexOf(exactPrefix) !== -1 ? CriteriaType.exact : undefined;

      const values = Array.isArray(query.filter_by[key]) ? [...query.filter_by[key]] : [query.filter_by[key]];
      const newKey = excludeType ? key.substring(excludeType.length + 1) : key;
      parseFilters(newKey, values, excludeType);
    });
  }
  if (query?.exclude) {
    Object.keys(query.exclude).forEach(key => {
      const values = Array.isArray(query.exclude[key]) ? [...query.exclude[key]] : [query.exclude[key]];
      parseFilters(key, values, CriteriaType.exclude);
    });
  }
  return filters;
};

export const getChips = (filters: Filter[]): string[] => {
  const chips = [];
  if (filters instanceof Array) {
    filters.forEach(item => {
      const value = item.toString ? item.toString() : item.value;
      const msg =
        item.excludeType === CriteriaType.exact
          ? messages.exactLabel
          : item.excludeType === CriteriaType.exclude
            ? messages.excludeLabel
            : undefined;

      chips.push({
        key: item.value,
        node: msg ? intl.formatMessage(msg, { value }) : value,
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

export const getFilters = (filterType: string, filterValues: string[], excludeType: CriteriaType): Filter[] => {
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
    let id = chip && chip.key ? chip.key : chip;
    if (id?.indexOf(exactPrefix) !== -1) {
      id = id.slice(exactPrefix.length);
    }
    if (id?.indexOf(excludeKey) !== -1) {
      id = id.slice(excludeKey.length);
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
