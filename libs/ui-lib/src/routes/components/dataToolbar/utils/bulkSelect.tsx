import { intl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { Tooltip } from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownList, MenuToggle, MenuToggleCheckbox } from '@patternfly/react-core';
import React from 'react';

import type { ComputedReportItem } from '../../../utils/computedReport/getComputedReportItems';

// Bulk select
export const getBulkSelect = ({
  isAllSelected,
  isBulkSelectDisabled,
  isBulkSelectOpen,
  isDisabled,
  isReadOnly,
  itemsPerPage,
  itemsTotal,
  onBulkSelect,
  onBulkSelectClicked,
  onBulkSelectToggle,
  selectedItems,
  showSelectAll = true,
  showSelectPage = true,
}: {
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isBulkSelectOpen?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelect?: () => void;
  onBulkSelectClicked?: (action: string) => void;
  onBulkSelectToggle?: (isOpen: boolean) => void;
  selectedItems?: ComputedReportItem[];
  showSelectAll?: boolean;
  showSelectPage?: boolean;
}) => {
  const numSelected = isAllSelected ? itemsTotal : selectedItems ? selectedItems.length : 0;
  const allSelected = (isAllSelected || numSelected === itemsTotal) && itemsTotal > 0;
  const anySelected = numSelected > 0;
  const someChecked = anySelected ? null : false;
  const isChecked = allSelected ? true : someChecked;

  const dropdownItems = [
    <DropdownItem key="bulk-select-item-1" onClick={() => onBulkSelectClicked('none')}>
      {intl.formatMessage(messages.toolBarBulkSelectNone)}
    </DropdownItem>,
  ];
  if (showSelectPage) {
    dropdownItems.push(
      <DropdownItem key="bulk-select-item-2" onClick={() => onBulkSelectClicked('page')}>
        {intl.formatMessage(messages.toolBarBulkSelectPage, { value: itemsPerPage })}
      </DropdownItem>
    );
  }
  if (showSelectAll) {
    dropdownItems.push(
      <DropdownItem key="bulk-select-item-3" onClick={() => onBulkSelectClicked('all')}>
        {intl.formatMessage(messages.toolBarBulkSelectAll, { value: itemsTotal })}
      </DropdownItem>
    );
  }

  const handleOnBulkSelectClicked = (checked: boolean) => {
    if (onBulkSelectClicked) {
      onBulkSelectClicked(checked ? 'all' : 'none');
    }
    onBulkSelectToggle(false);
  };

  const toggle = toggleRef => {
    return (
      <MenuToggle
        isDisabled={isDisabled || isBulkSelectDisabled || isReadOnly}
        isExpanded={isBulkSelectOpen}
        onClick={() => onBulkSelectToggle(!isBulkSelectOpen)}
        ref={toggleRef}
        splitButtonItems={[
          <MenuToggleCheckbox
            id={`bulk-select-checkbox`}
            key={`bulk-select-checkbox`}
            aria-label={intl.formatMessage(
              anySelected ? messages.toolBarBulkSelectAriaDeselect : messages.toolBarBulkSelectAriaSelect
            )}
            isChecked={isChecked}
            onChange={handleOnBulkSelectClicked}
          />,
        ]}
      >
        {anySelected ? intl.formatMessage(messages.selected, { value: numSelected }) : null}
      </MenuToggle>
    );
  };

  const bulkSelect = (
    <Dropdown
      id="bulk-select"
      isOpen={isBulkSelectOpen}
      onOpenChange={isOpen => onBulkSelectToggle(isOpen)}
      onSelect={onBulkSelect}
      popperProps={{
        appendTo: () => document.body, // Page scroll workaround https://issues.redhat.com/browse/COST-5320
        position: 'left',
      }}
      toggle={toggle}
    >
      <DropdownList>{dropdownItems}</DropdownList>
    </Dropdown>
  );
  return isReadOnly ? (
    <Tooltip content={intl.formatMessage(messages.readOnlyPermissions)}>{bulkSelect}</Tooltip>
  ) : (
    bulkSelect
  );
};
