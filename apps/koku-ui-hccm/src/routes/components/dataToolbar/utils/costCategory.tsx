import type { ToolbarLabelGroup } from '@patternfly/react-core';
import { ToolbarFilter, ToolbarItem } from '@patternfly/react-core';
import type { Resource, ResourcePathsType } from 'api/resources/resource';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { cloneDeep, uniq, uniqBy } from 'lodash';
import React from 'react';
import { CostCategoryValue } from 'routes/components/dataToolbar/costCategoryValue';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectTypeaheadWrapper } from 'routes/components/selectWrapper';
import { awsCategoryKey, awsCategoryPrefix } from 'utils/props';

import type { Filters } from './common';
import { getChips, getFilter, hasFilters } from './common';

// Cost category key select

export const getCostCategoryKeySelect = ({
  currentCategory,
  currentCostCategoryKey,
  filters,
  isDisabled,
  onCostCategoryKeyClear,
  onCostCategoryKeySelect,
  resourceReport,
}: {
  currentCategory?: string;
  currentCostCategoryKey?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onCostCategoryKeyClear?: () => void;
  onCostCategoryKeySelect?: (evt, selection: SelectWrapperOption) => void;
  resourceReport?: Resource;
}) => {
  if (currentCategory !== awsCategoryKey) {
    return null;
  }

  const selectOptions = getCostCategoryKeyOptions(resourceReport, true) as SelectWrapperOption[];
  const selection = selectOptions.find(option => option.value === currentCostCategoryKey);

  return (
    <ToolbarItem>
      <SelectTypeaheadWrapper
        aria-label={intl.formatMessage(messages.filterByCostCategoryKeyAriaLabel)}
        id="tag-value-select"
        isDisabled={isDisabled && !hasFilters(filters)}
        onClear={onCostCategoryKeyClear}
        onSelect={onCostCategoryKeySelect}
        options={selectOptions}
        placeholder={intl.formatMessage(messages.chooseValuePlaceholder)}
        selection={selection}
      />
    </ToolbarItem>
  );
};

export const getCostCategoryKeyOptions = (
  resourceReport: Resource,
  isSelectWrapperOption = false
): ToolbarLabelGroup[] | SelectWrapperOption[] => {
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
  let data = uniq(resourceReport.data);
  if (hasKeys) {
    const keepData = resourceReport.data.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ type, ...keepProps }: any) => keepProps
    );
    data = uniqBy(keepData, 'key');
  }

  if (data.length > 0) {
    options = data.map(item => {
      const key = hasKeys ? item.key : item;

      return isSelectWrapperOption
        ? {
            toString: () => key, // Tag keys not localized
            value: key,
          }
        : {
            key,
            name: key, // Tag keys not localized
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
  costCategoryKeyOption: ToolbarLabelGroup;
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
      labels={getChips(filters[awsCategoryKey][costCategoryKeyOption.key])}
      deleteLabel={onDelete}
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
  currentCriteria,
  event,
}: {
  costCategoryKeyValueInput?: string;
  currentCostCategoryKey?: string;
  currentFilters?: Filters;
  currentCriteria?: string;
  event?: any;
}) => {
  if ((event.key && event.key !== 'Enter') || costCategoryKeyValueInput.trim() === '') {
    return;
  }

  const filter = getFilter(`${awsCategoryPrefix}${currentCostCategoryKey}`, costCategoryKeyValueInput, currentCriteria);
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
  currentCriteria,
  event,
  selection,
}: {
  costCategoryKeyValueInput?: string;
  currentCostCategoryKey?: string;
  currentFilters?: Filters;
  currentCriteria?: string;
  event?: any;
  selection?: SelectWrapperOption;
}) => {
  const checked = event.target.checked;
  let filter;
  if (checked) {
    filter = getFilter(`${awsCategoryPrefix}${currentCostCategoryKey}`, selection.value, currentCriteria);
  } else if (currentFilters[awsCategoryKey][currentCostCategoryKey]) {
    filter = currentFilters[awsCategoryKey][currentCostCategoryKey].find(item => item.value === selection.value);
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
