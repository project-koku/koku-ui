import { ToolbarItem } from '@patternfly/react-core';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { SelectWrapperOption } from 'routes/components/selectWrapper';
import { SelectWrapper } from 'routes/components/selectWrapper';

import type { Filters } from './common';
import { hasFilters } from './common';

export const enum ExcludeType {
  exact = 'exact',
  exclude = 'exclude',
  include = 'include',
}

// Exclude select

export const getExcludeSelect = ({
  currentExclude,
  filters,
  isDisabled,
  onExcludeSelect,
}: {
  currentExclude?: string;
  filters?: Filters;
  isDisabled?: boolean;
  onExcludeSelect: (event, selection: SelectWrapperOption) => void;
}) => {
  const selectOptions = getExcludeSelectOptions();
  const selection = selectOptions.find(option => option.value === currentExclude);

  return (
    <ToolbarItem>
      <SelectWrapper
        id="exclude-select"
        isDisabled={isDisabled && !hasFilters(filters)}
        onSelect={onExcludeSelect}
        options={selectOptions}
        selection={selection}
      />
    </ToolbarItem>
  );
};

export const getExcludeSelectOptions = (): SelectWrapperOption[] => {
  const excludeOptions = [
    { name: intl.formatMessage(messages.excludeValues, { value: 'exact' }), key: ExcludeType.exact },
    { name: intl.formatMessage(messages.excludeValues, { value: 'exclude' }), key: ExcludeType.exclude },
    { name: intl.formatMessage(messages.excludeValues, { value: 'include' }), key: ExcludeType.include },
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
