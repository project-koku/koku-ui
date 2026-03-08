import {
  Button,
  MenuToggle,
  Pagination,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from '@patternfly/react-core';
import messages from 'locales/messages';
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';

interface SourcesToolbarProps {
  count: number;
  page: number;
  perPage: number;
  filterValue: string;
  filterColumn: 'name' | 'source_type' | 'availability_status';
  onFilterChange: (value: string) => void;
  onFilterColumnChange: (column: 'name' | 'source_type' | 'availability_status') => void;
  onPageChange: (page: number, perPage: number) => void;
  onAddSource: () => void;
  canWrite?: boolean;
}

const SourcesToolbar: React.FC<SourcesToolbarProps> = ({
  count,
  page,
  perPage,
  filterValue,
  filterColumn,
  onFilterChange,
  onFilterColumnChange,
  onPageChange,
  onAddSource,
  canWrite = false,
}) => {
  const intl = useIntl();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilter, setLocalFilter] = useState(filterValue);

  const filterColumnLabels: Record<string, string> = {
    name: intl.formatMessage(messages.name),
    source_type: intl.formatMessage(messages.sourceType),
    availability_status: intl.formatMessage(messages.status),
  };

  const handleFilterSubmit = useCallback(() => {
    onFilterChange(localFilter);
  }, [localFilter, onFilterChange]);

  const handleFilterClear = useCallback(() => {
    setLocalFilter('');
    onFilterChange('');
  }, [onFilterChange]);

  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>
          <Select
            toggle={toggleRef => (
              <MenuToggle ref={toggleRef} onClick={() => setIsFilterOpen(!isFilterOpen)} isExpanded={isFilterOpen}>
                {filterColumnLabels[filterColumn]}
              </MenuToggle>
            )}
            onSelect={(_event, value) => {
              onFilterColumnChange(value as typeof filterColumn);
              setIsFilterOpen(false);
            }}
            isOpen={isFilterOpen}
            onOpenChange={setIsFilterOpen}
          >
            <SelectList>
              <SelectOption value="name">{intl.formatMessage(messages.name)}</SelectOption>
              <SelectOption value="source_type">{intl.formatMessage(messages.sourceType)}</SelectOption>
              <SelectOption value="availability_status">{intl.formatMessage(messages.status)}</SelectOption>
            </SelectList>
          </Select>
        </ToolbarItem>
        <ToolbarItem>
          <SearchInput
            placeholder={intl.formatMessage(messages.filterByName)}
            value={localFilter}
            onChange={(_event, value) => setLocalFilter(value)}
            onSearch={handleFilterSubmit}
            onClear={handleFilterClear}
          />
        </ToolbarItem>
        <ToolbarGroup align={{ default: 'alignStart' }}>
          <ToolbarItem>
            <Button variant="primary" onClick={onAddSource} isDisabled={!canWrite}>
              {intl.formatMessage(messages.addSource)}
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarItem variant="pagination">
          <Pagination
            itemCount={count}
            page={page}
            perPage={perPage}
            onSetPage={(_event, p) => onPageChange(p, perPage)}
            onPerPageSelect={(_event, pp) => onPageChange(1, pp)}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

export { SourcesToolbar };
