import {
  Button,
  ButtonProps,
  InputGroup,
  InputGroupText,
  Pagination,
  PaginationProps,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarItem,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons/dist/js/icons/search-icon';
import React from 'react';

import { ReadOnlyTooltip } from '../components/readOnlyTooltip';

interface SearchInputProps {
  id: string;
  value: string;
  onChange: (value: string, event: React.FormEvent<HTMLInputElement>) => void;
  onSearch: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput: React.SFC<SearchInputProps> = ({ id, placeholder = '', value, onChange, onSearch }) => {
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
    <Toolbar id="assign-sources-toolbar" clearAllFilters={filter.onClearAll}>
      <ToolbarContent>
        <ToolbarItem variant="search-filter">
          <ToolbarFilter
            deleteChip={filter.onRemove}
            chips={filter.query.name}
            categoryName={filter.categoryNames.name}
          >
            <SearchInput {...searchInputProps} />
          </ToolbarFilter>
        </ToolbarItem>
        <ToolbarItem>
          <ReadOnlyTooltip isDisabled={actionButtonProps.isDisabled}>
            <Button {...actionButtonProps} />
          </ReadOnlyTooltip>
        </ToolbarItem>
        <ToolbarItem variant="pagination">
          <Pagination
            isCompact={paginationProps.isCompact}
            itemCount={paginationProps.itemCount}
            page={paginationProps.page}
            perPage={paginationProps.perPage}
            onSetPage={paginationProps.onSetPage}
            onPerPageSelect={paginationProps.onPerPageSelect}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};
