import { ToolbarFilter } from '@patternfly/react-core';
import { cloneDeep } from 'lodash';
import React from 'react';

import type { Filter } from '../../../utils/filter';
import type { SelectWrapperOption } from '../../selectWrapper';
import { CustomSelect } from '../customSelect';
import type { ToolbarChipGroupExt } from './common';
import type { Filters } from './common';
import { getChips, getFilter, hasFilters } from './common';

// Custom value select

export const getCustomSelect = ({
  categoryOption,
  currentCategory,
  filters,
  isDisabled,
  onDelete,
  onSelect,
  selectClassName,
  selectOptions,
}: {
  categoryOption?: ToolbarChipGroupExt;
  currentCategory?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onDelete?: (type: any, chip: any) => void;
  onSelect?: (event: any, selection) => void;
  selectOptions?: ToolbarChipGroupExt[];
  selectClassName?: string;
}) => {
  // Todo: categoryName workaround for https://issues.redhat.com/browse/COST-2094
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
        filters={filters[categoryOption.key]}
        isDisabled={isDisabled && !hasFilters(filters)}
        onSelect={onSelect}
        options={selectOptions}
      />
    </ToolbarFilter>
  );
};

export const onCustomSelect = ({
  currentCategory,
  currentFilters,
  event,
  selection,
}: {
  currentCategory?: string;
  currentFilters?: Filters;
  event?: any;
  selection: SelectWrapperOption;
}) => {
  const checked = event.target.checked;
  let filter;
  if (checked) {
    filter = getFilter(currentCategory, selection.value, false, selection.toString);
  } else if (currentFilters[currentCategory]) {
    filter = (currentFilters[currentCategory] as Filter[]).find(item => item.value === selection.value);
  }

  const newFilters: any = cloneDeep(currentFilters[currentCategory] ? currentFilters[currentCategory] : []);

  const result = {
    filter,
    filters: {
      ...currentFilters,
      [currentCategory]: checked ? [...newFilters, filter] : newFilters.filter(item => item.value !== filter.value),
    },
  };
  return result;
};
