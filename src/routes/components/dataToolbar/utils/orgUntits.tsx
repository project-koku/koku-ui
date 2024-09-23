import type { ToolbarLabelGroup } from '@patternfly/react-core';
import { ToolbarFilter } from '@patternfly/react-core';
import type { Org } from 'api/orgs/org';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import React from 'react';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectCheckboxWrapper } from 'routes/components/selectWrapper';
import type { Filter } from 'routes/utils/filter';
import { orgUnitIdKey, orgUnitNameKey } from 'utils/props';

import type { Filters } from './common';
import { getFilter, hasFilters } from './common';
import { ExcludeType } from './exclude';

export const getOrgUnitSelect = ({
  currentCategory,
  filters,
  isDisabled,
  onDelete,
  onOrgUnitSelect,
  orgReport,
}: {
  currentCategory?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onDelete?: (type: any, chip: any) => void;
  onOrgUnitSelect?: (event: React.MouseEvent, selection: string) => void;
  orgReport: Org;
}) => {
  const selectOptions: SelectWrapperOption[] = getOrgUnitOptions(orgReport).map(option => ({
    description: option.key,
    compareTo: item =>
      filters?.[orgUnitIdKey] ? (filters[orgUnitIdKey] as any).find(filter => filter.value === item.value) : false,
    toString: () => option.name,
    value: option.key,
  }));

  const chips = []; // Get selected items as PatternFly's ToolbarChip type
  const selections = []; // Select options and selections must be same type
  if (filters?.[orgUnitIdKey] && Array.isArray(filters[orgUnitIdKey])) {
    (filters[orgUnitIdKey] as any).map(filter => {
      const selection = selectOptions.find(option => option.value === filter.value);
      if (selection) {
        selections.push(selection);
        chips.push({
          key: selection.value,
          node: filter.isExcludes
            ? intl.formatMessage(messages.excludeLabel, { value: selection.toString() })
            : selection.toString(),
        });
      }
    });
  }

  // Todo: selectOverride is a workaround for https://github.com/patternfly/patternfly-react/issues/4477
  // and https://github.com/patternfly/patternfly-react/issues/6371
  return (
    <ToolbarFilter
      categoryName={{
        key: orgUnitIdKey,
        name: intl.formatMessage(messages.filterByValues, { value: 'org_unit_id' }),
      }}
      labels={chips}
      deleteLabel={onDelete}
      key={orgUnitIdKey}
      showToolbarItem={currentCategory === orgUnitIdKey}
    >
      <SelectCheckboxWrapper
        ariaLabel={intl.formatMessage(messages.filterByOrgUnitAriaLabel)}
        className="selectOverride"
        id="org-units-select"
        isDisabled={isDisabled && !hasFilters(filters)}
        onSelect={onOrgUnitSelect}
        options={selectOptions}
        placeholder={intl.formatMessage(messages.filterByOrgUnitPlaceholder)}
        selections={selections}
      />
    </ToolbarFilter>
  );
};

export const getOrgUnitOptions = (orgReport: Org): ToolbarLabelGroup[] => {
  let options = [];
  if (!orgReport?.data) {
    return options;
  }

  // Sort all names first
  const sortedData = orgReport.data.sort((a, b) => {
    if (a[orgUnitNameKey] < b[orgUnitNameKey]) {
      return -1;
    }
    if (a[orgUnitNameKey] > b[orgUnitNameKey]) {
      return 1;
    }
    return 0;
  });

  // Move roots first
  const roots = sortedData.filter(org => org.level === 0);

  const filteredOrgs = sortedData.filter(org => org.level !== 0);
  roots.map(root => {
    const item = sortedData.find(org => org[orgUnitIdKey] === root[orgUnitIdKey]);
    filteredOrgs.unshift(item);
  });

  if (filteredOrgs.length > 0) {
    options = filteredOrgs.map(org => {
      return {
        key: org[orgUnitIdKey],
        name: org[orgUnitNameKey],
      };
    });
  }
  return options;
};

export const onOrgUnitSelect = ({
  currentExclude,
  currentFilters,
  event,
  selection,
}: {
  currentExclude?: string;
  currentFilters?: Filters;
  event?: any;
  selection?: SelectWrapperOption;
}) => {
  const checked = event.target.checked;
  let filter;

  if (checked) {
    const isExcludes = currentExclude === ExcludeType.exclude;
    filter = getFilter(orgUnitIdKey, selection.value, isExcludes);
  } else if (currentFilters[orgUnitIdKey]) {
    filter = (currentFilters[orgUnitIdKey] as Filter[]).find(item => item.value === selection.value);
  }

  const newFilters: any = cloneDeep(currentFilters[orgUnitIdKey] ? currentFilters[orgUnitIdKey] : []);

  return {
    filter,
    filters: {
      ...currentFilters,
      // tag: {
      //   ...currentFilters.tag,
      // },
      [orgUnitIdKey]: checked ? [...newFilters, filter] : newFilters.filter(item => item.value !== filter.value),
    },
  };
};
