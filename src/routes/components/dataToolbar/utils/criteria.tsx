import { ToolbarItem } from '@patternfly/react-core';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectWrapper } from 'routes/components/selectWrapper';

import type { Filters } from './common';
import { hasFilters } from './common';

export const enum CriteriaType {
  exact = 'exact',
  exclude = 'exclude',
  include = 'include',
}

// Criteria select

export const getCriteriaSelect = ({
  currentCriteria,
  filters,
  isDisabled,
  onCriteriaSelect,
}: {
  currentCriteria?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onCriteriaSelect: (event, selection: SelectWrapperOption) => void;
}) => {
  const selectOptions = getCriteriaSelectOptions();
  const selection = selectOptions.find(option => option.value === currentCriteria);

  return (
    <ToolbarItem>
      <SelectWrapper
        id="exclude-select"
        isDisabled={isDisabled && !hasFilters(filters)}
        onSelect={onCriteriaSelect}
        options={selectOptions}
        selection={selection}
      />
    </ToolbarItem>
  );
};

export const getCriteriaSelectOptions = (): SelectWrapperOption[] => {
  const excludeOptions = [
    { name: intl.formatMessage(messages.excludeValues, { value: 'exact' }), key: CriteriaType.exact },
    { name: intl.formatMessage(messages.excludeValues, { value: 'exclude' }), key: CriteriaType.exclude },
    { name: intl.formatMessage(messages.excludeValues, { value: 'include' }), key: CriteriaType.include },
  ];

  const options: SelectWrapperOption[] = [];
  excludeOptions.map(option => {
    options.push({
      toString: () => option.name,
      value: option.key,
    });
  });
  return options;
};
