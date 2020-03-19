import {
  Button,
  ButtonProps,
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
} from '@patternfly/react-core/dist/esm/experimental';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';
import { ReadOnlyTooltip } from './readOnlyTooltip';

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

interface SourcesToolbarProps {
  actionButtonProps: ButtonProps;
  paginationProps: PaginationProps;
  searchInputProps: SearchInputProps;
  filter: {
    onRemove: (category: string, chip: string) => void;
    onClearAll: () => void;
    query: { name?: string[] };
    categoryNames: { name?: string };
  };
}

export const SourcesToolbar: React.SFC<SourcesToolbarProps> = ({
  searchInputProps,
  paginationProps,
  filter,
  actionButtonProps,
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
            categoryName={filter.categoryNames.name}
          >
            <SearchInput {...searchInputProps} />
          </DataToolbarFilter>
        </DataToolbarItem>
        <DataToolbarItem>
          <ReadOnlyTooltip isDisabled={actionButtonProps.isDisabled}>
            <Button {...actionButtonProps} />
          </ReadOnlyTooltip>
        </DataToolbarItem>
        <DataToolbarItem variant="pagination">
          <Pagination {...paginationProps} />
        </DataToolbarItem>
      </DataToolbarContent>
    </DataToolbar>
  );
};
