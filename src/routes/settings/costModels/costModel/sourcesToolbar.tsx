import type { ButtonProps } from '@patternfly/react-core';
import type { PaginationProps } from '@patternfly/react-core';
import {
  Button,
  InputGroup,
  InputGroupItem,
  InputGroupText,
  Pagination,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import React from 'react';
import { ReadOnlyTooltip } from 'routes/settings/costModels/components/readOnlyTooltip';

interface FilterInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const FilterInput: React.FC<FilterInputProps> = ({ id, placeholder = '', value, onChange, onSearch }) => {
  return (
    <InputGroup>
      <InputGroupItem isFill>
        <TextInput
          value={value}
          placeholder={placeholder}
          id={id}
          onChange={(_evt, val) => onChange(val)}
          onKeyPress={(evt: React.KeyboardEvent<HTMLInputElement>) => {
            if (evt.key !== 'Enter' || value === '') {
              return;
            }
            onSearch(evt);
          }}
        />
      </InputGroupItem>
      <InputGroupText style={{ borderLeft: '0' }}>
        <SearchIcon />
      </InputGroupText>
    </InputGroup>
  );
};

interface SourcesToolbarProps {
  actionButtonProps: ButtonProps;
  paginationProps?: PaginationProps;
  filterInputProps: FilterInputProps;
  filter: {
    onRemove: (category: string, chip: string) => void;
    onClearAll: () => void;
    query: { name?: string[] };
    categoryNames: { name?: string };
  };
}

export const SourcesToolbar: React.FC<SourcesToolbarProps> = ({
  filterInputProps,
  paginationProps,
  filter,
  actionButtonProps,
}) => {
  return (
    <Toolbar id="assign-sources-toolbar" clearAllFilters={filter.onClearAll}>
      <ToolbarContent>
        <ToolbarToggleGroup breakpoint="xl" toggleIcon={<FilterIcon />}>
          <ToolbarItem variant="search-filter">
            <ToolbarFilter
              deleteChip={filter.onRemove}
              chips={filter.query.name}
              categoryName={filter.categoryNames.name}
            >
              <FilterInput {...filterInputProps} />
            </ToolbarFilter>
          </ToolbarItem>
        </ToolbarToggleGroup>
        <ToolbarItem>
          <ReadOnlyTooltip isDisabled={actionButtonProps.isDisabled}>
            <Button {...actionButtonProps} />
          </ReadOnlyTooltip>
        </ToolbarItem>
        {paginationProps && (
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
        )}
      </ToolbarContent>
    </Toolbar>
  );
};
