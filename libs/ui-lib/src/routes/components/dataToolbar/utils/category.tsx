import type { ResourcePathsType, ResourceType } from '@koku-ui/api/resources/resource';
import { isResourceTypeValid } from '@koku-ui/api/resources/resourceUtils';
import { intl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import type { ToolbarLabelGroup } from '@patternfly/react-core';
import { SearchInput, ToolbarFilter, ToolbarItem } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { cloneDeep } from 'lodash';
import React from 'react';

import type { Filter } from '../../../utils/filter';
import { ResourceTypeahead } from '../../resourceTypeahead';
import type { SelectWrapperOption } from '../../selectWrapper';
import { SelectWrapper } from '../../selectWrapper';
import type { ToolbarChipGroupExt } from './common';
import type { Filters } from './common';
import { cleanInput, getChips, getFilter, hasFilters } from './common';

// Category input

export const getCategoryInput = ({
  categoryInput,
  categoryOption,
  currentCategory,
  filters,
  isDisabled,
  onCategoryInput,
  onCategoryInputChange,
  onCategoryInputSelect,
  onDelete,
  resourcePathsType,
}: {
  categoryInput?: string;
  categoryOption?: ToolbarChipGroupExt;
  currentCategory?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onCategoryInput?: (event, key: string) => void;
  onCategoryInputChange?: (value: string) => void;
  onCategoryInputSelect?: (value: string, key: string) => void;
  onDelete?: (type: any, chip: any) => void;
  resourcePathsType?: ResourcePathsType;
}) => {
  const _hasFilters = hasFilters(filters);
  const ariaLabelKey = categoryOption.ariaLabelKey || categoryOption.key;
  const placeholderKey = categoryOption.placeholderKey || categoryOption.key;

  return (
    <ToolbarFilter
      categoryName={categoryOption}
      labels={getChips(filters?.[categoryOption.key] as Filter[])}
      deleteLabel={onDelete}
      key={categoryOption.key}
      showToolbarItem={currentCategory === categoryOption.key}
    >
      {isResourceTypeValid(resourcePathsType, categoryOption.key as ResourceType) ? (
        <ResourceTypeahead
          ariaLabel={intl.formatMessage(messages.filterByInputAriaLabel, { value: ariaLabelKey })}
          isDisabled={isDisabled && !_hasFilters}
          onSelect={value => onCategoryInputSelect(value, categoryOption.key)}
          placeholder={intl.formatMessage(messages.filterByPlaceholder, { value: placeholderKey })}
          resourceKey={categoryOption.resourceKey}
          resourcePathsType={resourcePathsType}
          resourceType={categoryOption.key as ResourceType}
        />
      ) : (
        <SearchInput
          aria-label={intl.formatMessage(messages.filterByInputAriaLabel, { value: ariaLabelKey })}
          id={`category-input-${categoryOption.key}`}
          isDisabled={isDisabled && !_hasFilters}
          onChange={(_evt, value) => onCategoryInputChange(value)}
          onClear={() => onCategoryInputChange('')}
          onSearch={evt => onCategoryInput(evt, categoryOption.key)}
          placeholder={intl.formatMessage(messages.filterByPlaceholder, { value: placeholderKey })}
          value={categoryInput}
        />
      )}
    </ToolbarFilter>
  );
};

export const getDefaultCategoryOptions = (): ToolbarLabelGroup[] => {
  return [{ name: intl.formatMessage(messages.names, { count: 1 }), key: 'name' }];
};

export const onCategoryInput = ({
  categoryInput,
  currentCategory,
  currentCriteria,
  currentFilters,
  event,
  key,
}: {
  categoryInput?: string;
  currentCategory?: string;
  currentCriteria?: string;
  currentFilters?: Filters;
  event: any;
  key?: string;
}) => {
  if (event && event.key && event.key !== 'Enter') {
    return {}; // For destructure
  }

  const val = cleanInput(categoryInput);
  if (val.trim() === '') {
    return {}; // For destructure
  }

  const filter = getFilter(currentCategory, val, currentCriteria);
  const newFilters: any = cloneDeep(currentFilters[key] ? currentFilters[key] : []);

  return {
    filter,
    filters: {
      ...currentFilters,
      [currentCategory]:
        newFilters && newFilters.find(item => item.value === val)
          ? newFilters
          : newFilters
            ? [...newFilters, filter]
            : [filter],
    },
  };
};

export const onCategoryInputSelect = ({
  currentCategory,
  currentCriteria,
  currentFilters,
  key,
  value,
}: {
  currentCategory?: string;
  currentCriteria?: string;
  currentFilters?: Filters;
  key?: string;
  value: string;
}) => {
  const val = cleanInput(value);
  if (val.trim() === '') {
    return;
  }

  const filter = getFilter(currentCategory, val, currentCriteria);
  const newFilters: any = cloneDeep(currentFilters[key] ? currentFilters[key] : []);

  return {
    filter,
    filters: {
      ...currentFilters,
      [currentCategory]:
        newFilters && newFilters.find(item => item.value === val)
          ? newFilters
          : newFilters
            ? [...newFilters, filter]
            : [filter],
    },
  };
};

// Category select

export const getCategorySelect = ({
  categoryOptions,
  currentCategory,
  filters,
  isDisabled,
  onCategorySelect,
}: {
  categoryOptions?: ToolbarLabelGroup[]; // Options for category menu
  currentCategory?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onCategorySelect?: (event, selection: SelectWrapperOption) => void;
  onCategoryToggle?: (isOpen: boolean) => void;
}) => {
  if (!categoryOptions) {
    return null;
  }

  const selectOptions = getCategorySelectOptions(categoryOptions);
  const selection = selectOptions.find(option => option.value === currentCategory);

  return (
    <ToolbarItem>
      <SelectWrapper
        id="category-select"
        isDisabled={isDisabled && !hasFilters(filters)}
        onSelect={onCategorySelect}
        options={selectOptions}
        selection={selection}
        toggleIcon={<FilterIcon />}
      />
    </ToolbarItem>
  );
};

export const getCategorySelectOptions = (categoryOptions: ToolbarLabelGroup[]): SelectWrapperOption[] => {
  const options: SelectWrapperOption[] = [];

  categoryOptions.map(option => {
    options.push({
      toString: () => option.name,
      value: option.key,
    });
  });
  return options;
};
