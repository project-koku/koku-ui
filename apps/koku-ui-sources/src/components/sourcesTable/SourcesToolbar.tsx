import {
  Button,
  Icon,
  MenuToggle,
  Pagination,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { getSourceTypeById, SOURCE_TYPES_INTEGRATIONS_UI } from 'api/sourceTypes';
import messages from 'locales/messages';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  onClearAllFilters?: () => void;
  canWrite?: boolean;
}

const getFilterChipDisplayValue = (
  filterColumn: 'name' | 'source_type' | 'availability_status',
  filterValue: string,
  intl: ReturnType<typeof useIntl>
): string => {
  if (!filterValue) {
    return '';
  }
  switch (filterColumn) {
    case 'name':
      return filterValue;
    case 'source_type': {
      const st = getSourceTypeById(filterValue);
      return st?.product_name ?? filterValue;
    }
    case 'availability_status':
      return filterValue === 'available'
        ? intl.formatMessage(messages.statusAvailable)
        : filterValue === 'paused'
          ? intl.formatMessage(messages.statusPaused)
          : filterValue === 'unavailable'
            ? intl.formatMessage(messages.statusUnavailable)
            : filterValue;
    default:
      return filterValue;
  }
};

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
  onClearAllFilters,
  canWrite = false,
}) => {
  const intl = useIntl();
  const showTypeFilterColumn = SOURCE_TYPES_INTEGRATIONS_UI.length > 1;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusSelectOpen, setIsStatusSelectOpen] = useState(false);
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const [localFilter, setLocalFilter] = useState(filterValue);

  const filterColumnLabels: Record<string, string> = {
    name: intl.formatMessage(messages.name),
    source_type: intl.formatMessage(messages.sourceType),
    availability_status: intl.formatMessage(messages.status),
  };

  const sourceTypeOptionLabels: Record<string, string> = {
    OCP: intl.formatMessage(messages.sourceTypeOCPLabel),
    AWS: intl.formatMessage(messages.sourceTypeAWSLabel),
    Azure: intl.formatMessage(messages.sourceTypeAzureLabel),
    GCP: intl.formatMessage(messages.sourceTypeGCPLabel),
  };

  const searchPlaceholder =
    filterColumn === 'source_type'
      ? intl.formatMessage(messages.filterByType)
      : filterColumn === 'availability_status'
        ? intl.formatMessage(messages.filterByStatus)
        : intl.formatMessage(messages.filterByName);

  useEffect(() => {
    setLocalFilter(filterValue);
  }, [filterValue, filterColumn]);

  useEffect(() => {
    if (!showTypeFilterColumn && filterColumn === 'source_type') {
      onFilterColumnChange('name');
      onFilterChange('');
    }
  }, [showTypeFilterColumn, filterColumn, onFilterColumnChange, onFilterChange]);

  const handleFilterSubmit = useCallback(() => {
    onFilterChange(localFilter);
  }, [localFilter, onFilterChange]);

  const handleFilterClear = useCallback(() => {
    setLocalFilter('');
    onFilterChange('');
  }, [onFilterChange]);

  const isStatusFilter = filterColumn === 'availability_status';
  const isTypeFilter = filterColumn === 'source_type';

  const handleTypeSelect = useCallback(
    (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
      onFilterChange(value === '' ? '' : String(value));
      setIsTypeSelectOpen(false);
    },
    [onFilterChange]
  );

  const chips = useMemo(() => {
    if (!filterValue) {
      return [];
    }
    const displayValue = getFilterChipDisplayValue(filterColumn, filterValue, intl);
    return [{ key: filterColumn, node: displayValue }];
  }, [filterColumn, filterValue, intl]);

  const handleDeleteChip = useCallback(() => {
    onFilterColumnChange('name');
    onFilterChange('');
  }, [onFilterColumnChange, onFilterChange]);

  const hasActiveFilters = filterValue !== '';

  return (
    <Toolbar
      id="sources-toolbar"
      className="pf-m-toggle-group-container"
      collapseListedFiltersBreakpoint="xl"
      clearAllFilters={hasActiveFilters ? onClearAllFilters : undefined}
    >
      <ToolbarContent>
        <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
          <ToolbarFilter
            categoryName={filterColumnLabels[filterColumn]}
            labels={chips}
            deleteLabel={handleDeleteChip}
            deleteLabelGroup={onClearAllFilters}
          >
            <ToolbarItem>
              <Select
                toggle={toggleRef => (
                  <MenuToggle
                    ref={toggleRef}
                    icon={
                      <Icon>
                        <FilterIcon />
                      </Icon>
                    }
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    isExpanded={isFilterOpen}
                  >
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
                  {showTypeFilterColumn ? (
                    <SelectOption value="source_type">{intl.formatMessage(messages.sourceType)}</SelectOption>
                  ) : null}
                  <SelectOption value="availability_status">{intl.formatMessage(messages.status)}</SelectOption>
                </SelectList>
              </Select>
            </ToolbarItem>
            <ToolbarItem>
              {isTypeFilter ? (
                <Select
                  toggle={toggleRef => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsTypeSelectOpen(!isTypeSelectOpen)}
                      isExpanded={isTypeSelectOpen}
                    >
                      {filterValue
                        ? (sourceTypeOptionLabels[filterValue] ?? filterValue)
                        : intl.formatMessage(messages.filterStatusAny)}
                    </MenuToggle>
                  )}
                  onSelect={handleTypeSelect}
                  isOpen={isTypeSelectOpen}
                  onOpenChange={setIsTypeSelectOpen}
                  selected={filterValue || undefined}
                >
                  <SelectList>
                    <SelectOption value="">{intl.formatMessage(messages.filterStatusAny)}</SelectOption>
                    {SOURCE_TYPES_INTEGRATIONS_UI.map(st => (
                      <SelectOption key={st.id} value={st.id}>
                        {sourceTypeOptionLabels[st.id]}
                      </SelectOption>
                    ))}
                  </SelectList>
                </Select>
              ) : isStatusFilter ? (
                <Select
                  toggle={toggleRef => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setIsStatusSelectOpen(!isStatusSelectOpen)}
                      isExpanded={isStatusSelectOpen}
                    >
                      {filterValue === ''
                        ? intl.formatMessage(messages.filterStatusAny)
                        : filterValue === 'available'
                          ? intl.formatMessage(messages.statusAvailable)
                          : filterValue === 'paused'
                            ? intl.formatMessage(messages.statusPaused)
                            : filterValue === 'unavailable'
                              ? intl.formatMessage(messages.statusUnavailable)
                              : intl.formatMessage(messages.filterStatusAny)}
                    </MenuToggle>
                  )}
                  onSelect={(_event, value) => {
                    onFilterChange((value as string) ?? '');
                    setIsStatusSelectOpen(false);
                  }}
                  isOpen={isStatusSelectOpen}
                  onOpenChange={setIsStatusSelectOpen}
                  selected={filterValue === '' ? undefined : filterValue}
                >
                  <SelectList>
                    <SelectOption value="">{intl.formatMessage(messages.filterStatusAny)}</SelectOption>
                    <SelectOption value="available">{intl.formatMessage(messages.statusAvailable)}</SelectOption>
                    <SelectOption value="paused">{intl.formatMessage(messages.statusPaused)}</SelectOption>
                    <SelectOption value="unavailable">{intl.formatMessage(messages.statusUnavailable)}</SelectOption>
                  </SelectList>
                </Select>
              ) : (
                <SearchInput
                  placeholder={searchPlaceholder}
                  value={localFilter}
                  onChange={(_event, value) => setLocalFilter(value)}
                  onSearch={handleFilterSubmit}
                  onClear={handleFilterClear}
                />
              )}
            </ToolbarItem>
          </ToolbarFilter>
        </ToolbarToggleGroup>
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
