import type { ToolbarChipGroup } from '@patternfly/react-core';
import { ToolbarFilter, ToolbarItem } from '@patternfly/react-core';
import type { SelectOptionObject } from '@patternfly/react-core/deprecated';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import type { Resource, ResourcePathsType } from 'api/resources/resource';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { cloneDeep, uniq, uniqBy } from 'lodash';
import React from 'react';
import { awsCategoryKey, awsCategoryPrefix } from 'utils/props';

import { CostCategoryValue } from '../costCategoryValue';
import type { Filters } from './common';
import { getChips, getFilter, hasFilters } from './common';
import { ExcludeType } from './exclude';

// Cost category key select

export const getCostCategoryKeySelect = ({
  currentCategory,
  currentCostCategoryKey,
  filters,
  isCostCategoryKeySelectExpanded,
  isDisabled,
  onCostCategoryKeyClear,
  onCostCategoryKeySelect,
  onCostCategoryKeyToggle,
  resourceReport,
}: {
  currentCategory?: string;
  currentCostCategoryKey?: string;
  filters?: Filters;
  isCostCategoryKeySelectExpanded?: boolean;
  isDisabled?: boolean;
  onCostCategoryKeyClear?: () => void;
  onCostCategoryKeySelect?: (selection: SelectOptionObject) => void;
  onCostCategoryKeyToggle?: (isOpen: boolean) => void;
  resourceReport?: Resource;
}) => {
  if (currentCategory !== awsCategoryKey) {
    return null;
  }

  const selectOptions = getCostCategoryKeyOptions(resourceReport).map(selectOption => {
    return <SelectOption key={selectOption.key} value={selectOption.key} />;
  });

  return (
    <ToolbarItem>
      <Select
        isDisabled={isDisabled && !hasFilters(filters)}
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={intl.formatMessage(messages.filterByCostCategoryKeyAriaLabel)}
        isOpen={isCostCategoryKeySelectExpanded}
        onClear={onCostCategoryKeyClear}
        onSelect={(_evt, value) => onCostCategoryKeySelect(value)}
        onToggle={(_evt, isExpanded) => onCostCategoryKeyToggle(isExpanded)}
        placeholderText={intl.formatMessage(messages.chooseKeyPlaceholder)}
        selections={currentCostCategoryKey}
      >
        {selectOptions}
      </Select>
    </ToolbarItem>
  );
};

export const getCostCategoryKeyOptions = (resourceReport: Resource): ToolbarChipGroup[] => {
  let data = [];
  let options = [];

  if (!resourceReport?.data) {
    return options;
  }

  // If the key_only param is used, we have an array of strings
  let hasKeys = false;
  for (const item of resourceReport.data) {
    if (item.hasOwnProperty('key')) {
      hasKeys = true;
      break;
    }
  }

  // Workaround for https://github.com/project-koku/koku/issues/1797
  if (hasKeys) {
    const keepData = resourceReport.data.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ type, ...keepProps }: any) => keepProps
    );
    data = uniqBy(keepData, 'key');
  } else {
    data = uniq(resourceReport.data);
  }

  if (data.length > 0) {
    options = data.map(item => {
      const key = hasKeys ? item.key : item;
      return {
        key,
        name: key, // keys not localized
      };
    });
  }
  return options;
};

// Cost category value select

export const getCostCategoryValueSelect = ({
  currentCategory,
  currentCostCategoryKey,
  costCategoryKeyOption,
  costCategoryKeyValueInput,
  filters,
  isDisabled,
  onDelete,
  onCostCategoryValueSelect,
  onCostCategoryValueInput,
  onCostCategoryValueInputChange,
  resourcePathsType,
}: {
  currentCategory?: string;
  currentCostCategoryKey?: string;
  costCategoryKeyOption: ToolbarChipGroup;
  costCategoryKeyValueInput?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onDelete?: (type: any, chip: any) => void;
  onCostCategoryValueSelect?: (event, selection: string) => void;
  onCostCategoryValueInput?: (event) => void;
  onCostCategoryValueInputChange?: (value: string) => void;
  resourcePathsType?: ResourcePathsType;
}) => {
  // Todo: categoryName workaround for https://issues.redhat.com/browse/COST-2094
  const categoryName = {
    name: costCategoryKeyOption.name,
    key: `${awsCategoryPrefix}${costCategoryKeyOption.key}`,
  };

  return (
    <ToolbarFilter
      categoryName={categoryName}
      chips={getChips(filters[awsCategoryKey][costCategoryKeyOption.key])}
      deleteChip={onDelete}
      key={costCategoryKeyOption.key}
      showToolbarItem={currentCategory === awsCategoryKey && currentCostCategoryKey === costCategoryKeyOption.key}
    >
      <CostCategoryValue
        costCategoryKey={currentCostCategoryKey}
        costCategoryKeyValue={costCategoryKeyValueInput}
        isDisabled={isDisabled && !hasFilters(filters)}
        onCostCategoryValueSelect={onCostCategoryValueSelect}
        onCostCategoryValueInput={onCostCategoryValueInput}
        onCostCategoryValueInputChange={onCostCategoryValueInputChange}
        resourcePathsType={resourcePathsType}
        selections={
          filters[awsCategoryKey][costCategoryKeyOption.key]
            ? filters[awsCategoryKey][costCategoryKeyOption.key].map(filter => filter.value)
            : []
        }
      />
    </ToolbarFilter>
  );
};

export const onCostCategoryValueInput = ({
  costCategoryKeyValueInput,
  currentCostCategoryKey,
  currentFilters,
  currentExclude,
  event,
}: {
  costCategoryKeyValueInput?: string;
  currentCostCategoryKey?: string;
  currentFilters?: Filters;
  currentExclude?: string;
  event?: any;
}) => {
  if ((event.key && event.key !== 'Enter') || costCategoryKeyValueInput.trim() === '') {
    return;
  }

  const isExcludes = currentExclude === ExcludeType.exclude;
  const filter = getFilter(`${awsCategoryPrefix}${currentCostCategoryKey}`, costCategoryKeyValueInput, isExcludes);
  const newFilters: any = cloneDeep(
    currentFilters[awsCategoryKey][currentCostCategoryKey] ? currentFilters[awsCategoryKey][currentCostCategoryKey] : []
  );

  for (const item of newFilters) {
    if (item.value === costCategoryKeyValueInput) {
      return {
        filter,
        filters: {
          ...currentFilters,
        },
      };
    }
  }
  return {
    filter,
    filters: {
      ...currentFilters,
      [awsCategoryKey]: {
        ...currentFilters[awsCategoryKey],
        [currentCostCategoryKey]: [...newFilters, filter],
      },
    },
  };
};

export const onCostCategoryValueSelect = ({
  currentCostCategoryKey,
  currentFilters,
  currentExclude,
  event,
  selection,
}: {
  costCategoryKeyValueInput?: string;
  currentCostCategoryKey?: string;
  currentFilters?: Filters;
  currentExclude?: string;
  event?: any;
  selection?: string;
}) => {
  const checked = event.target.checked;
  let filter;
  if (checked) {
    const isExcludes = currentExclude === ExcludeType.exclude;
    filter = getFilter(`${awsCategoryPrefix}${currentCostCategoryKey}`, selection, isExcludes);
  } else if (currentFilters[awsCategoryKey][currentCostCategoryKey]) {
    filter = currentFilters[awsCategoryKey][currentCostCategoryKey].find(item => item.value === selection);
  }

  const newFilters: any = cloneDeep(
    currentFilters[awsCategoryKey][currentCostCategoryKey] ? currentFilters[awsCategoryKey][currentCostCategoryKey] : []
  );

  return {
    filter,
    filters: {
      ...currentFilters,
      [awsCategoryKey]: {
        ...currentFilters[awsCategoryKey],
        [currentCostCategoryKey]: checked
          ? [...newFilters, filter]
          : newFilters.filter(item => item.value !== filter.value),
      },
    },
  };
};
