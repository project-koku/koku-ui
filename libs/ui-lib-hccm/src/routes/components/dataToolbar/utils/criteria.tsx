import { intl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { ToolbarItem } from '@patternfly/react-core';
import React from 'react';

import type { SelectWrapperOption } from '../../selectWrapper';
import { SelectWrapper } from '../../selectWrapper';
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
  showExact,
}: {
  currentCriteria?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onCriteriaSelect: (event, selection: SelectWrapperOption) => void;
  showExact: boolean;
}) => {
  const selectOptions = getCriteriaSelectOptions(showExact);
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

export const getCriteriaSelectOptions = (showExact): SelectWrapperOption[] => {
  const excludeOptions = [
    { name: intl.formatMessage(messages.criteriaValues, { value: 'exclude' }), key: CriteriaType.exclude },
    { name: intl.formatMessage(messages.criteriaValues, { value: 'include' }), key: CriteriaType.include },
  ];

  if (showExact) {
    excludeOptions.unshift({
      name: intl.formatMessage(messages.criteriaValues, { value: 'exact' }),
      key: CriteriaType.exact,
    });
  }

  const options: SelectWrapperOption[] = [];
  excludeOptions.map(option => {
    options.push({
      toString: () => option.name,
      value: option.key,
    });
  });
  return options;
};
