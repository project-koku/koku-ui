import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  Icon,
  MenuToggle,
  Pagination,
  PaginationVariant,
  Radio,
  SearchInput,
  Select,
  SelectList,
  SelectOption,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  ToolbarItemVariant,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { getSourceTypeById, SOURCE_TYPES } from 'apis/source-types';
import { messages } from 'i18n/messages';
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
        : filterValue === 'unavailable'
          ? intl.formatMessage(messages.statusUnavailable)
          : filterValue;
    default:
      return filterValue;
  }
};

export const SourcesToolbar: React.FC<SourcesToolbarProps> = ({
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
  const showTypeFilterColumn = SOURCE_TYPES.length > 1;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [localFilter, setLocalFilter] = useState(filterValue);

  const filterColumnLabels: Record<string, string> = {
    name: intl.formatMessage(messages.name),
    source_type: intl.formatMessage(messages.sourceType),
    availability_status: intl.formatMessage(messages.status),
  };

  const sourceTypeOptionLabels = useMemo(
    () =>
      SOURCE_TYPES.reduce<Record<string, string>>((acc, st) => {
        acc[st.id] = intl.formatMessage(messages.sourceTypeOCPLabel);
        return acc;
      }, {}),
    [intl]
  );

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

  useEffect(() => {
    if (!isStatusFilter) {
      setIsStatusMenuOpen(false);
    }
  }, [isStatusFilter]);

  const statusMenuToggleLabel = useMemo(() => {
    if (!isStatusFilter) {
      return '';
    }
    if (filterValue === 'available') {
      return intl.formatMessage(messages.statusAvailable);
    }
    if (filterValue === 'unavailable') {
      return intl.formatMessage(messages.statusUnavailable);
    }
    return intl.formatMessage(messages.filterByStatus);
  }, [filterValue, intl, isStatusFilter]);

  const handleStatusRadioChange = useCallback(
    (value: 'available' | 'unavailable') => {
      onFilterChange(value);
      setIsStatusMenuOpen(false);
    },
    [onFilterChange]
  );

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
    <Toolbar id="sources-toolbar" clearAllFilters={hasActiveFilters ? onClearAllFilters : undefined}>
      <ToolbarContent>
        <ToolbarToggleGroup breakpoint="xl" toggleIcon={<FilterIcon />}>
          <ToolbarGroup variant="filter-group">
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
                  <SelectOption key="name" value="name">
                    {intl.formatMessage(messages.name)}
                  </SelectOption>
                  {showTypeFilterColumn ? (
                    <SelectOption key="source_type" value="source_type">
                      {intl.formatMessage(messages.sourceType)}
                    </SelectOption>
                  ) : null}
                  <SelectOption key="availability_status" value="availability_status">
                    {intl.formatMessage(messages.status)}
                  </SelectOption>
                </SelectList>
              </Select>
            </ToolbarItem>
            <ToolbarFilter
              categoryName={filterColumnLabels[filterColumn]}
              labels={chips}
              deleteLabel={handleDeleteChip}
              deleteLabelGroup={onClearAllFilters}
            >
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
                      <SelectOption key="type-any" value="">
                        {intl.formatMessage(messages.filterStatusAny)}
                      </SelectOption>
                      {SOURCE_TYPES.map(st => (
                        <SelectOption key={st.id} value={st.id}>
                          {sourceTypeOptionLabels[st.id]}
                        </SelectOption>
                      ))}
                    </SelectList>
                  </Select>
                ) : isStatusFilter ? (
                  <Dropdown
                    isOpen={isStatusMenuOpen}
                    onOpenChange={setIsStatusMenuOpen}
                    toggle={toggleRef => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                        isExpanded={isStatusMenuOpen}
                        aria-label={intl.formatMessage(messages.filterByStatus)}
                      >
                        {statusMenuToggleLabel}
                      </MenuToggle>
                    )}
                  >
                    <DropdownList role="radiogroup" aria-label={intl.formatMessage(messages.filterStatusGroupAria)}>
                      <DropdownItem key="status-available" component="div" onClick={e => e.preventDefault()}>
                        <Radio
                          id="sources-filter-status-available"
                          name="sources-availability-filter"
                          label={intl.formatMessage(messages.statusAvailable)}
                          isChecked={filterValue === 'available'}
                          onChange={() => handleStatusRadioChange('available')}
                        />
                      </DropdownItem>
                      <DropdownItem key="status-unavailable" component="div" onClick={e => e.preventDefault()}>
                        <Radio
                          id="sources-filter-status-unavailable"
                          name="sources-availability-filter"
                          label={intl.formatMessage(messages.statusUnavailable)}
                          isChecked={filterValue === 'unavailable'}
                          onChange={() => handleStatusRadioChange('unavailable')}
                        />
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                ) : (
                  <SearchInput
                    aria-label={searchPlaceholder}
                    placeholder={searchPlaceholder}
                    value={localFilter}
                    onChange={(_event, value) => setLocalFilter(value)}
                    onSearch={handleFilterSubmit}
                    onClear={handleFilterClear}
                  />
                )}
              </ToolbarItem>
            </ToolbarFilter>
          </ToolbarGroup>
        </ToolbarToggleGroup>
        <ToolbarGroup>
          <ToolbarItem>
            <Button variant="primary" onClick={onAddSource} isDisabled={!canWrite}>
              {intl.formatMessage(messages.addSource)}
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarItem variant={ToolbarItemVariant.pagination}>
          <Pagination
            isCompact
            itemCount={count}
            page={page}
            perPage={perPage}
            variant={PaginationVariant.top}
            onSetPage={(_event, p) => onPageChange(p, perPage)}
            onPerPageSelect={(_event, pp) => onPageChange(1, pp)}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

SourcesToolbar.displayName = 'SourcesToolbar';
