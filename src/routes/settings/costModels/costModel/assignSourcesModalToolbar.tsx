import type { PaginationProps } from '@patternfly/react-core';
import { SearchInput } from '@patternfly/react-core';
import {
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

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
      aria-label={placeholder}
      id={id}
      onChange={(_evt, val) => onChange(val)}
      onClear={() => onChange('')}
      onSearch={onSearch}
      placeholder={placeholder}
      value={value}
    />
  );
};

interface AssignSourcesToolbarBaseProps extends WrappedComponentProps {
  paginationProps: PaginationProps;
  filterInputProps: Omit<FilterInputProps, 'placeholder'>;
  filter: {
    onRemove: (category: string, chip: string) => void;
    onClearAll: () => void;
    query: { name?: string[] };
  };
}

export const AssignSourcesToolbarBase: React.FC<AssignSourcesToolbarBaseProps> = ({
  filterInputProps,
  intl,
  paginationProps,
  filter,
}) => {
  return (
    <Toolbar id="assign-sources-modal-toolbar" clearAllFilters={filter.onClearAll}>
      <ToolbarContent>
        <ToolbarToggleGroup breakpoint="xl" toggleIcon={<FilterIcon />}>
          <ToolbarItem>
            <ToolbarFilter deleteLabel={filter.onRemove} labels={filter.query.name} categoryName="name">
              <FilterInput
                placeholder={intl.formatMessage(messages.costModelsFilterPlaceholder)}
                {...filterInputProps}
              />
            </ToolbarFilter>
          </ToolbarItem>
        </ToolbarToggleGroup>
        <ToolbarItem variant="pagination">
          <Pagination
            isCompact={paginationProps.isCompact}
            itemCount={paginationProps.itemCount}
            page={paginationProps.page}
            perPage={paginationProps.perPage}
            titles={{
              paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
                title: intl.formatMessage(messages.costModelsAssignSourcesParen),
                placement: 'top',
              }),
            }}
            onSetPage={paginationProps.onSetPage}
            onPerPageSelect={paginationProps.onPerPageSelect}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

export const AssignSourcesToolbar = injectIntl(AssignSourcesToolbarBase);
