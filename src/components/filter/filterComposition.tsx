import { FormSelect, FormSelectOption, TextInput, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import SelectFilter from './selectFilter';

type FilterKind = 'type' | 'name';
type BufferUpdater = (current: { name: string; value: string }) => void;
interface TypeOption {
  label: string;
  value: string;
}

interface Props extends WithTranslation {
  isSingleOption?: boolean;
  options: TypeOption[];
  id: string;
  query: Query;
  filters: FilterKind[];
  name: string;
  value: string;
  updateFilter: BufferUpdater;
  switchType: (current: { name: string; value: string }) => void;
  onSearch: (newQuery: { [k: string]: string }) => void;
}

interface Query {
  [k: string]: string;
}
interface Filter {
  name: string;
  value: string;
}
type Mutate = (query: Query, filter: Filter) => Query;

const addMultiValue = (query: Query, buffer: Filter) => {
  let newValue = buffer.value;
  if (buffer.name === 'Name') {
    newValue = query[buffer.name] ? [query[buffer.name], buffer.value].join(',') : buffer.value;
  }
  return {
    ...query,
    [buffer.name]: newValue,
  };
};

const searchOnEnter =
  (query: Query, filter: Filter, mutate: Mutate, onSearch: (newQuery: Query) => void) =>
  (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && filter.value) {
      onSearch(mutate(query, filter));
    }
  };
const FilterCompositionBase: React.SFC<Props> = ({
  options,
  id,
  query,
  filters,
  name,
  value,
  updateFilter,
  switchType,
  onSearch,
  isSingleOption = false,
  t,
}) => {
  const filterController =
    name === 'Type' ? (
      <FormSelect
        aria-label={t('filter.type_aria_label')}
        value={name}
        onChange={newValue => onSearch({ name, value: newValue })}
      >
        <FormSelectOption key={`type-option-empty`} value={''} label={t('filter.type_empty')} />
        {options.map(option => (
          <FormSelectOption key={`type-option-${value}`} value={option.value} label={option.label} />
        ))}
      </FormSelect>
    ) : (
      <TextInput
        value={value}
        placeholder={t('source_details.filter.placeholder', {
          value: name.toLowerCase(),
        })}
        id={id}
        onChange={newValue => {
          updateFilter({ name, value: newValue });
        }}
        onKeyPress={searchOnEnter(query, { name, value }, addMultiValue, onSearch)}
      />
    );

  return (
    <>
      <ToolbarGroup>
        <ToolbarItem>
          {!isSingleOption && (
            <SelectFilter
              onSelect={newName => switchType({ name: newName, value: '' })}
              selected={name}
              options={filters.map(filter => ({
                value: filter,
                name: t(`filter.${filter}`),
              }))}
            />
          )}
        </ToolbarItem>
        <ToolbarItem>{filterController}</ToolbarItem>
      </ToolbarGroup>
    </>
  );
};

export default withTranslation()(FilterCompositionBase);
