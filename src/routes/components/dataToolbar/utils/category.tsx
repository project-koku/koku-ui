import type { SelectOptionObject, ToolbarChipGroup } from '@patternfly/react-core';
import {
  Button,
  ButtonVariant,
  InputGroup,
  Select,
  SelectOption,
  SelectVariant,
  TextInput,
  ToolbarFilter,
  ToolbarItem,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import type { ResourceType } from 'api/resources/resource';
import type { ResourcePathsType } from 'api/resources/resource';
import { isResourceTypeValid } from 'api/resources/resourceUtils';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import React from 'react';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import { ResourceTypeahead } from 'routes/components/resourceTypeahead';
import type { Filter } from 'routes/utils/filter';

import type { Filters } from './common';
import { cleanInput, getChips, getFilter, hasFilters } from './common';
import { ExcludeType } from './exclude';

export interface CategoryOption extends SelectOptionObject {
  toString(): string; // label
  value?: string;
}

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
      chips={getChips(filters[categoryOption.key] as Filter[])}
      deleteChip={onDelete}
      key={categoryOption.key}
      showToolbarItem={currentCategory === categoryOption.key}
    >
      <InputGroup>
        {isResourceTypeValid(resourcePathsType, categoryOption.key as ResourceType) ? (
          <ResourceTypeahead
            ariaLabel={intl.formatMessage(messages.filterByInputAriaLabel, { value: ariaLabelKey })}
            isDisabled={isDisabled && !_hasFilters}
            onSelect={value => onCategoryInputSelect(value, categoryOption.key)}
            placeholder={intl.formatMessage(messages.filterByPlaceholder, { value: placeholderKey })}
            resourcePathsType={resourcePathsType}
            resourceType={categoryOption.key as ResourceType}
          />
        ) : (
          <>
            <TextInput
              isDisabled={isDisabled && !_hasFilters}
              name={`category-input-${categoryOption.key}`}
              id={`category-input-${categoryOption.key}`}
              type="search"
              aria-label={intl.formatMessage(messages.filterByInputAriaLabel, { value: ariaLabelKey })}
              onChange={onCategoryInputChange}
              value={categoryInput}
              placeholder={intl.formatMessage(messages.filterByPlaceholder, { value: placeholderKey })}
              onKeyDown={evt => onCategoryInput(evt, categoryOption.key)}
              size={intl.formatMessage(messages.filterByPlaceholder, { value: placeholderKey }).length}
            />
            <Button
              isDisabled={isDisabled && !_hasFilters}
              variant={ButtonVariant.control}
              aria-label={intl.formatMessage(messages.filterByButtonAriaLabel, { value: ariaLabelKey })}
              onClick={evt => onCategoryInput(evt, categoryOption.key)}
            >
              <SearchIcon />
            </Button>
          </>
        )}
      </InputGroup>
    </ToolbarFilter>
  );
};

export const getDefaultCategoryOptions = (): ToolbarChipGroup[] => {
  return [{ name: intl.formatMessage(messages.names, { count: 1 }), key: 'name' }];
};

export const onCategoryInput = ({
  categoryInput,
  currentCategory,
  currentExclude,
  currentFilters,
  event,
  key,
}: {
  categoryInput?: string;
  currentCategory?: string;
  currentExclude?: string;
  currentFilters?: Filters;
  event: any;
  key?: string;
}) => {
  if (event && event.key && event.key !== 'Enter') {
    return;
  }

  const val = cleanInput(categoryInput);
  if (val.trim() === '') {
    return;
  }

  const isExcludes = currentExclude === ExcludeType.exclude;
  const filter = getFilter(currentCategory, val, isExcludes);
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
  currentExclude,
  currentFilters,
  key,
  value,
}: {
  currentCategory?: string;
  currentExclude?: string;
  currentFilters?: Filters;
  key?: string;
  value: string;
}) => {
  const val = cleanInput(value);
  if (val.trim() === '') {
    return;
  }

  const isExcludes = currentExclude === ExcludeType.exclude;
  const filter = getFilter(currentCategory, val, isExcludes);
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
  isCategorySelectOpen,
  onCategorySelect,
  onCategoryToggle,
}: {
  categoryOptions?: ToolbarChipGroup[]; // Options for category menu
  currentCategory?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onCategorySelect?: (event, selection: CategoryOption) => void;
  onCategoryToggle?: (isOpen: boolean) => void;
  isCategorySelectOpen?: boolean;
}) => {
  if (!categoryOptions) {
    return null;
  }

  const selectOptions = getCategorySelectOptions(categoryOptions);
  const selection = selectOptions.find((option: CategoryOption) => option.value === currentCategory);

  return (
    <ToolbarItem>
      <Select
        id="category-select"
        isDisabled={isDisabled && !hasFilters(filters)}
        isOpen={isCategorySelectOpen}
        onSelect={onCategorySelect}
        onToggle={onCategoryToggle}
        selections={selection}
        toggleIcon={<FilterIcon />}
        variant={SelectVariant.single}
      >
        {selectOptions.map(option => (
          <SelectOption key={option.value} value={option} />
        ))}
      </Select>
    </ToolbarItem>
  );
};

export const getCategorySelectOptions = (categoryOptions: ToolbarChipGroup[]): CategoryOption[] => {
  const options: CategoryOption[] = [];

  categoryOptions.map(option => {
    options.push({
      toString: () => option.name,
      value: option.key,
    });
  });
  return options;
};
