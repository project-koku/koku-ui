import {
  InputGroup,
  InputGroupText,
  Pagination,
  PaginationProps,
  TextInput,
} from '@patternfly/react-core';
import {
  DataToolbar,
  DataToolbarContent,
  DataToolbarFilter,
  DataToolbarItem,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { Omit } from 'react-redux';

interface SearchInputProps {
  id: string;
  value: string;
  onChange: (value: string, event: React.FormEvent<HTMLInputElement>) => void;
  onSearch: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput: React.SFC<SearchInputProps> = ({
  id,
  placeholder = '',
  value,
  onChange,
  onSearch,
}) => {
  return (
    <InputGroup>
      <TextInput
        value={value}
        placeholder={placeholder}
        id={id}
        onChange={onChange}
        onKeyPress={(evt: React.KeyboardEvent<HTMLInputElement>) => {
          if (evt.key !== 'Enter' || value === '') {
            return;
          }
          onSearch(evt);
        }}
      />
      <InputGroupText style={{ borderLeft: '0' }}>
        <SearchIcon />
      </InputGroupText>
    </InputGroup>
  );
};

interface AssignSourcesToolbarBaseProps extends InjectedTranslateProps {
  paginationProps: PaginationProps;
  searchInputProps: Omit<SearchInputProps, 'placeholder'>;
  filter: {
    onRemove: (category: string, chip: string) => void;
    onClearAll: () => void;
    query: { name?: string[] };
  };
}

export const AssignSourcesToolbarBase: React.SFC<AssignSourcesToolbarBaseProps> = ({
  t,
  searchInputProps,
  paginationProps,
  filter,
}) => {
  return (
    <DataToolbar
      id="assign-sources-toolbar"
      clearAllFilters={filter.onClearAll}
    >
      <DataToolbarContent>
        <DataToolbarItem variant="search-filter">
          <DataToolbarFilter
            deleteChip={filter.onRemove}
            chips={filter.query.name}
            categoryName="name"
          >
            <SearchInput
              placeholder={t(
                'cost_models_wizard.source_table.filter_placeholder'
              )}
              {...searchInputProps}
            />
          </DataToolbarFilter>
        </DataToolbarItem>
        <DataToolbarItem variant="pagination">
          <Pagination {...paginationProps} />
        </DataToolbarItem>
      </DataToolbarContent>
    </DataToolbar>
  );
};

export const AssignSourcesToolbar = translate()(AssignSourcesToolbarBase);
