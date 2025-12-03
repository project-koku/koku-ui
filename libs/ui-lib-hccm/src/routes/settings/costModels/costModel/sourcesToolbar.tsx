import type { ButtonProps, PaginationProps } from '@patternfly/react-core';
import { SearchInput } from '@patternfly/react-core';
import {
  Button,
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import React from 'react';

import { ReadOnlyTooltip } from '../components/readOnlyTooltip';

interface FilterInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (event, value: string) => void;
  placeholder?: string;
}

const FilterInput: React.FC<FilterInputProps> = ({ id, placeholder = '', value, onChange, onSearch }) => {
  return (
    <SearchInput
      id={id}
      onChange={(_evt, val) => onChange(val)}
      onClear={() => onChange('')}
      onSearch={onSearch}
      placeholder={placeholder}
      value={value}
    />
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
          <ToolbarItem>
            <ToolbarFilter
              deleteLabel={filter.onRemove}
              labels={filter.query.name}
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
