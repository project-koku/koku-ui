import type { ToolbarChipGroup } from '@patternfly/react-core';
import { ToolbarFilter } from '@patternfly/react-core';
import type { SelectOptionObject } from '@patternfly/react-core/deprecated';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import type { Org } from 'api/orgs/org';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import React from 'react';
import type { Filter } from 'routes/utils/filter';
import { orgUnitIdKey, orgUnitNameKey } from 'utils/props';

import type { Filters } from './common';
import { getFilter, hasFilters } from './common';
import { ExcludeType } from './exclude';

interface GroupByOrgOption extends SelectOptionObject {
  toString(): string; // label
  id?: string;
}

export const getOrgUnitSelect = ({
  currentCategory,
  filters,
  isDisabled,
  isOrgUnitSelectExpanded,
  onDelete,
  onOrgUnitSelect,
  onOrgUnitToggle,
  orgReport,
}: {
  currentCategory?: string;
  filters?: Filters;
  isDisabled?: boolean;
  isOrgUnitSelectExpanded?: boolean;
  onDelete?: (type: any, chip: any) => void;
  onOrgUnitSelect?: (event: React.MouseEvent, selection: string) => void;
  onOrgUnitToggle?: (isOpen: boolean) => void;
  orgReport: Org;
}) => {
  const options: GroupByOrgOption[] = getOrgUnitOptions(orgReport).map(option => ({
    id: option.key,
    toString: () => option.name,
    compareTo: value =>
      filters[orgUnitIdKey] ? (filters[orgUnitIdKey] as any).find(filter => filter.value === value.id) : false,
  }));

  const chips = []; // Get selected items as PatternFly's ToolbarChip type
  const selections = []; // Select options and selections must be same type
  if (filters[orgUnitIdKey] && Array.isArray(filters[orgUnitIdKey])) {
    (filters[orgUnitIdKey] as any).map(filter => {
      const option = options.find(item => item.id === filter.value);
      if (option) {
        selections.push(option);
        chips.push({
          key: option.id,
          node: filter.isExcludes
            ? intl.formatMessage(messages.excludeLabel, { value: option.toString() })
            : option.toString(),
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
      chips={chips}
      deleteChip={onDelete}
      key={orgUnitIdKey}
      showToolbarItem={currentCategory === orgUnitIdKey}
    >
      <Select
        isDisabled={isDisabled && !hasFilters(filters)}
        className="selectOverride"
        variant={SelectVariant.checkbox}
        aria-label={intl.formatMessage(messages.filterByOrgUnitAriaLabel)}
        onSelect={onOrgUnitSelect}
        onToggle={(_evt, isExpanded) => onOrgUnitToggle(isExpanded)}
        selections={selections}
        isOpen={isOrgUnitSelectExpanded}
        placeholderText={intl.formatMessage(messages.filterByOrgUnitPlaceholder)}
      >
        {options.map(option => (
          <SelectOption description={option.id} key={option.id} value={option} />
        ))}
      </Select>
    </ToolbarFilter>
  );
};

export const getOrgUnitOptions = (orgReport: Org): ToolbarChipGroup[] => {
  let options = [];
  if (!(orgReport && orgReport.data)) {
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
  selection?: GroupByOrgOption;
}) => {
  const checked = event.target.checked;
  let filter;

  if (checked) {
    const isExcludes = currentExclude === ExcludeType.exclude;
    filter = getFilter(orgUnitIdKey, selection.id, isExcludes);
  } else if (currentFilters[orgUnitIdKey]) {
    filter = (currentFilters[orgUnitIdKey] as Filter[]).find(item => item.value === selection.id);
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
