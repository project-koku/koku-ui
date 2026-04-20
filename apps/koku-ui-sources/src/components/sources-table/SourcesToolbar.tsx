import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  Icon,
  InputGroup,
  InputGroupItem,
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
import { ArrowRightIcon, FilterIcon } from '@patternfly/react-icons';
import { messages } from 'i18n/messages';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import type { AvailabilityFilterValue } from 'redux/sources-slice';

type ActiveFilterType = 'name' | 'status';

interface SourcesToolbarProps {
  count: number;
  page: number;
  perPage: number;
  nameFilter: string;
  availabilityFilter: AvailabilityFilterValue;
  onNameFilterChange: (value: string) => void;
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
  availabilityFilter,
  onNameFilterChange,
  onAvailabilityFilterChange,
  onPageChange,
  onAddSource,
  onClearAllFilters,
  canWrite = false,
}) => {
  const intl = useIntl();
  const [activeFilterType, setActiveFilterType] = useState<ActiveFilterType>('name');
  const [isFilterTypeOpen, setIsFilterTypeOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [localNameFilter, setLocalNameFilter] = useState(nameFilter);
  const [draftAvailability, setDraftAvailability] = useState<AvailabilityFilterValue>(availabilityFilter);

  useEffect(() => {
    setLocalNameFilter(nameFilter);
  }, [nameFilter]);

  useEffect(() => {
    if (activeFilterType === 'status') {
      setDraftAvailability(availabilityFilter);
    }
  }, [activeFilterType, availabilityFilter]);

  const handleNameSubmit = useCallback(() => {
    onNameFilterChange(localNameFilter);
  }, [localNameFilter, onNameFilterChange]);

  const handleNameClear = useCallback(() => {
    setLocalNameFilter('');
    onNameFilterChange('');
  }, [onNameFilterChange]);

  const handleStatusSubmit = useCallback(() => {
    onAvailabilityFilterChange(draftAvailability);
    setIsStatusMenuOpen(false);
  }, [draftAvailability, onAvailabilityFilterChange]);

  const handleFilterTypeSelect = useCallback(
    (_event: React.MouseEvent | undefined, value: string | number | undefined) => {
      const v = value === 'status' ? 'status' : 'name';
      setActiveFilterType(v);
      setIsFilterTypeOpen(false);
    },
    []
  );

  const filterTypeToggleLabel = useMemo(
    () => (activeFilterType === 'name' ? intl.formatMessage(messages.name) : intl.formatMessage(messages.status)),
    [activeFilterType, intl]
  );

  const nameLabels = useMemo(() => (nameFilter ? [{ key: 'name', node: nameFilter }] : []), [nameFilter]);

  const availabilityLabels = useMemo(() => {
    if (availabilityFilter === 'available') {
      return [{ key: 'availability', node: intl.formatMessage(messages.statusAvailable) }];
    }
    if (availabilityFilter === 'unavailable') {
      return [{ key: 'availability', node: intl.formatMessage(messages.statusUnavailable) }];
    }
    return [];
  }, [availabilityFilter, intl]);

  const hasActiveFilters = Boolean(nameFilter || availabilityFilter);

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
                    onClick={() => setIsFilterTypeOpen(!isFilterTypeOpen)}
                    isExpanded={isFilterTypeOpen}
                    aria-label={intl.formatMessage(messages.toolbarFilterField)}
                    icon={<FilterIcon />}
                  >
                    {filterTypeToggleLabel}
                  </MenuToggle>
                )}
                onSelect={handleFilterTypeSelect}
                isOpen={isFilterTypeOpen}
                onOpenChange={setIsFilterTypeOpen}
                selected={activeFilterType}
              >
                <SelectList>
                  <SelectOption value="name">{intl.formatMessage(messages.name)}</SelectOption>
                  <SelectOption value="status">{intl.formatMessage(messages.status)}</SelectOption>
                </SelectList>
              </Select>
            </ToolbarItem>
            <ToolbarItem>
              <ToolbarFilter
                categoryName={intl.formatMessage(messages.name)}
                labels={nameLabels}
                deleteLabel={() => onNameFilterChange('')}
                deleteLabelGroup={onClearAllFilters}
              >
                {activeFilterType === 'name' ? (
                  <SearchInput
                    aria-label={intl.formatMessage(messages.filterByName)}
                    placeholder={intl.formatMessage(messages.filterByName)}
                    value={localNameFilter}
                    onChange={(_event, value) => setLocalNameFilter(value)}
                    onSearch={handleNameSubmit}
                    onClear={handleNameClear}
                  />
                ) : null}
              </ToolbarFilter>
            </ToolbarItem>
            <ToolbarItem>
              <ToolbarFilter
                categoryName={intl.formatMessage(messages.status)}
                labels={availabilityLabels}
                deleteLabel={() => onAvailabilityFilterChange('')}
                deleteLabelGroup={onClearAllFilters}
              >
                {activeFilterType === 'status' ? (
                  <InputGroup>
                    <InputGroupItem isFill>
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
                            {intl.formatMessage(messages.filterByStatus)}
                          </MenuToggle>
                        )}
                      >
                        <DropdownList role="radiogroup" aria-label={intl.formatMessage(messages.filterStatusGroupAria)}>
                          <DropdownItem key="status-available" component="div" onClick={e => e.preventDefault()}>
                            <Radio
                              id="sources-filter-status-available"
                              name="sources-availability-filter"
                              label={intl.formatMessage(messages.statusAvailable)}
                              isChecked={draftAvailability === 'available'}
                              onChange={() => setDraftAvailability('available')}
                            />
                          </DropdownItem>
                          <DropdownItem key="status-unavailable" component="div" onClick={e => e.preventDefault()}>
                            <Radio
                              id="sources-filter-status-unavailable"
                              name="sources-availability-filter"
                              label={intl.formatMessage(messages.statusUnavailable)}
                              isChecked={draftAvailability === 'unavailable'}
                              onChange={() => setDraftAvailability('unavailable')}
                            />
                          </DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </InputGroupItem>
                    <InputGroupItem>
                      <Button
                        type="submit"
                        variant="control"
                        aria-label={intl.formatMessage(messages.applyAvailabilityFilter)}
                        icon={
                          <Icon shouldMirrorRTL>
                            <ArrowRightIcon />
                          </Icon>
                        }
                        onClick={handleStatusSubmit}
                      />
                    </InputGroupItem>
                  </InputGroup>
                ) : null}
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
