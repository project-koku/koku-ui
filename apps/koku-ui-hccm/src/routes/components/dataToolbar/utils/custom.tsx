import { ToolbarFilter } from '@patternfly/react-core';
import { cloneDeep } from 'lodash';
import React from 'react';
import { CustomSelect } from 'routes/components/dataToolbar/customSelect';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import type { Filter } from 'routes/utils/filter';

import type { Filters } from './common';
import { getChips, getFilter, hasFilters } from './common';

// Custom value select

export const getCustomSelect = ({
  categoryOption,
  currentCategory,
  filters,
  isDisabled,
  isMultiSelect,
  onDelete,
  onSelect,
  selectClassName,
  selectOptions,
}: {
  categoryOption?: ToolbarChipGroupExt;
  currentCategory?: string;
  filters?: Filters;
  isDisabled?: boolean;
  isMultiSelect?: boolean;
  onDelete?: (type: any, chip: any) => void;
  onSelect?: (event: any, selection) => void;
  selectOptions?: ToolbarChipGroupExt[];
  selectClassName?: string;
}) => {
  // Todo: categoryName workaround for https://redhat.atlassian.net/browse/COST-2094
  const categoryName = {
    name: categoryOption.name,
    key: categoryOption.key,
  };

  return (
    <ToolbarFilter
      categoryName={categoryName}
      labels={getChips(filters[categoryOption.key] as Filter[])}
      deleteLabel={onDelete}
      key={`custom-select-${categoryOption.key}`}
      showToolbarItem={currentCategory === categoryOption.key}
    >
      <CustomSelect
        className={selectClassName}
        filters={filters[categoryOption.key] as Filter[]}
        isDisabled={isDisabled && !hasFilters(filters)}
        isMultiSelect={isMultiSelect}
        onSelect={onSelect}
        options={selectOptions}
        placeholderKey={categoryOption.placeholderKey}
      />
    </ToolbarFilter>
  );
};

export const onCustomSelect = ({
  currentCategory,
  currentFilters,
  event,
  isMultiSelect = true,
  selection,
}: {
  currentCategory?: string;
  currentFilters?: Filters;
  event?: any;
  isMultiSelect?: boolean;
  selection: SelectWrapperOption;
}) => {
  const checked = isMultiSelect ? event?.target?.checked : true;
  let filter;
  if (checked) {
    filter = getFilter(currentCategory, selection.value, false, selection.toString);
  } else if (currentFilters[currentCategory]) {
    filter = (currentFilters[currentCategory] as Filter[]).find(item => item.value === selection.value);
  }

  const newFilters: any = cloneDeep(currentFilters[currentCategory] ? currentFilters[currentCategory] : []);

  const result = {
    filter,
    filters: !isMultiSelect
      ? {
          ...currentFilters,
          [currentCategory]: checked ? [filter] : newFilters.filter(item => item.value !== filter.value),
        }
      : {
          ...currentFilters,
          [currentCategory]: checked ? [...newFilters, filter] : newFilters.filter(item => item.value !== filter.value),
        },
  };
  return result;
};
