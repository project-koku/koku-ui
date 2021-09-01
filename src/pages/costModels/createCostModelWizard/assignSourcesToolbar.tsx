import {
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
import { SearchIcon } from '@patternfly/react-icons/dist/esm/icons/search-icon';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Omit } from 'react-redux';

interface FilterInputProps {
  id: string;
  value: string;
  onChange: (value: string, event: React.FormEvent<HTMLInputElement>) => void;
  onSearch: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const FilterInput: React.SFC<FilterInputProps> = ({ id, placeholder = '', value, onChange, onSearch }) => {
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

interface AssignSourcesToolbarBaseProps extends WrappedComponentProps {
  paginationProps: PaginationProps;
  filterInputProps: Omit<FilterInputProps, 'placeholder'>;
  filter: {
    onRemove: (category: string, chip: string) => void;
    onClearAll: () => void;
    query: { name?: string[] };
  };
}

export const AssignSourcesToolbarBase: React.SFC<AssignSourcesToolbarBaseProps> = ({
  intl,
  filterInputProps,
  paginationProps,
  filter,
}) => {
  return (
    <Toolbar id="assign-sources-toolbar" clearAllFilters={filter.onClearAll}>
      <ToolbarContent>
        <ToolbarItem variant="search-filter">
          <ToolbarFilter deleteChip={filter.onRemove} chips={filter.query.name} categoryName="name">
            <FilterInput placeholder={intl.formatMessage(messages.CostModelsFilterPlaceholder)} {...filterInputProps} />
          </ToolbarFilter>
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

export const AssignSourcesToolbar = injectIntl(AssignSourcesToolbarBase);
