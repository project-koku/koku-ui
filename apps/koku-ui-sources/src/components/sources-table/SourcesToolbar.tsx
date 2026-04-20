import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
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
import type { AvailabilityFilterValue } from 'redux/sources-slice';

interface SourcesToolbarProps {
  count: number;
  page: number;
  perPage: number;
  nameFilter: string;
  typeFilter: string;
  availabilityFilter: AvailabilityFilterValue;
  onNameFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onAvailabilityFilterChange: (value: AvailabilityFilterValue) => void;
  onPageChange: (page: number, perPage: number) => void;
  onAddSource: () => void;
  onClearAllFilters?: () => void;
  canWrite?: boolean;
}

export const SourcesToolbar: React.FC<SourcesToolbarProps> = ({
  count,
  page,
  perPage,
  nameFilter,
  typeFilter,
  availabilityFilter,
  onNameFilterChange,
  onTypeFilterChange,
  onAvailabilityFilterChange,
  onPageChange,
  onAddSource,
  onClearAllFilters,
  canWrite = false,
}) => {
  const intl = useIntl();
  const showTypeFilter = SOURCE_TYPES.length > 1;
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [localNameFilter, setLocalNameFilter] = useState(nameFilter);

  const sourceTypeOptionLabels = useMemo(
    () =>
      SOURCE_TYPES.reduce<Record<string, string>>((acc, st) => {
        acc[st.id] = intl.formatMessage(messages.sourceTypeOCPLabel);
        return acc;
      }, {}),
    [intl]
  );

  useEffect(() => {
    setLocalNameFilter(nameFilter);
  }, [nameFilter]);

  useEffect(() => {
    if (!showTypeFilter && typeFilter) {
      onTypeFilterChange('');
    }
  }, [showTypeFilter, typeFilter, onTypeFilterChange]);

  const handleNameSubmit = useCallback(() => {
    onNameFilterChange(localNameFilter);
  }, [localNameFilter, onNameFilterChange]);

  const handleNameClear = useCallback(() => {
    setLocalNameFilter('');
    onNameFilterChange('');
  }, [onNameFilterChange]);

  const statusMenuToggleLabel = useMemo(() => {
    if (availabilityFilter === 'available') {
      return intl.formatMessage(messages.statusAvailable);
    }
    if (availabilityFilter === 'unavailable') {
      return intl.formatMessage(messages.statusUnavailable);
    }
    return intl.formatMessage(messages.filterByStatus);
  }, [availabilityFilter, intl]);

  const handleStatusRadioChange = useCallback(
    (value: 'available' | 'unavailable') => {
      onAvailabilityFilterChange(value);
      setIsStatusMenuOpen(false);
    },
    [onAvailabilityFilterChange]
  );

  const handleTypeSelect = useCallback(
    (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
      onTypeFilterChange(value === '' ? '' : String(value));
      setIsTypeSelectOpen(false);
    },
    [onTypeFilterChange]
  );

  const nameLabels = useMemo(() => (nameFilter ? [{ key: 'name', node: nameFilter }] : []), [nameFilter]);

  const typeLabels = useMemo(() => {
    if (!typeFilter) {
      return [];
    }
    const st = getSourceTypeById(typeFilter);
    return [{ key: 'type', node: st?.product_name ?? typeFilter }];
  }, [typeFilter]);

  const availabilityLabels = useMemo(() => {
    if (availabilityFilter === 'available') {
      return [{ key: 'availability', node: intl.formatMessage(messages.statusAvailable) }];
    }
    if (availabilityFilter === 'unavailable') {
      return [{ key: 'availability', node: intl.formatMessage(messages.statusUnavailable) }];
    }
    return [];
  }, [availabilityFilter, intl]);

  const hasActiveFilters = Boolean(nameFilter || typeFilter || availabilityFilter);

  return (
    <Toolbar id="sources-toolbar" clearAllFilters={hasActiveFilters ? onClearAllFilters : undefined}>
      <ToolbarContent>
        <ToolbarToggleGroup breakpoint="xl" toggleIcon={<FilterIcon />}>
          <ToolbarGroup variant="filter-group">
            <ToolbarItem>
              <ToolbarFilter
                categoryName={intl.formatMessage(messages.name)}
                labels={nameLabels}
                deleteLabel={() => onNameFilterChange('')}
                deleteLabelGroup={onClearAllFilters}
              >
                <SearchInput
                  aria-label={intl.formatMessage(messages.filterByName)}
                  placeholder={intl.formatMessage(messages.filterByName)}
                  value={localNameFilter}
                  onChange={(_event, value) => setLocalNameFilter(value)}
                  onSearch={handleNameSubmit}
                  onClear={handleNameClear}
                />
              </ToolbarFilter>
            </ToolbarItem>
            {showTypeFilter ? (
              <ToolbarItem>
                <ToolbarFilter
                  categoryName={intl.formatMessage(messages.sourceType)}
                  labels={typeLabels}
                  deleteLabel={() => onTypeFilterChange('')}
                  deleteLabelGroup={onClearAllFilters}
                >
                  <Select
                    toggle={toggleRef => (
                      <MenuToggle
                        ref={toggleRef}
                        onClick={() => setIsTypeSelectOpen(!isTypeSelectOpen)}
                        isExpanded={isTypeSelectOpen}
                      >
                        {typeFilter
                          ? (sourceTypeOptionLabels[typeFilter] ?? typeFilter)
                          : intl.formatMessage(messages.filterStatusAny)}
                      </MenuToggle>
                    )}
                    onSelect={handleTypeSelect}
                    isOpen={isTypeSelectOpen}
                    onOpenChange={setIsTypeSelectOpen}
                    selected={typeFilter || undefined}
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
                </ToolbarFilter>
              </ToolbarItem>
            ) : null}
            <ToolbarItem>
              <ToolbarFilter
                categoryName={intl.formatMessage(messages.status)}
                labels={availabilityLabels}
                deleteLabel={() => onAvailabilityFilterChange('')}
                deleteLabelGroup={onClearAllFilters}
              >
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
                        isChecked={availabilityFilter === 'available'}
                        onChange={() => handleStatusRadioChange('available')}
                      />
                    </DropdownItem>
                    <DropdownItem key="status-unavailable" component="div" onClick={e => e.preventDefault()}>
                      <Radio
                        id="sources-filter-status-unavailable"
                        name="sources-availability-filter"
                        label={intl.formatMessage(messages.statusUnavailable)}
                        isChecked={availabilityFilter === 'unavailable'}
                        onChange={() => handleStatusRadioChange('unavailable')}
                      />
                    </DropdownItem>
                  </DropdownList>
                </Dropdown>
              </ToolbarFilter>
            </ToolbarItem>
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
