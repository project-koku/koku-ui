import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  DropdownToggleCheckbox,
  Tooltip,
} from '@patternfly/react-core';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';

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
}) => {
  const numSelected = isAllSelected ? itemsTotal : selectedItems ? selectedItems.length : 0;
  const allSelected = (isAllSelected || numSelected === itemsTotal) && itemsTotal > 0;
  const anySelected = numSelected > 0;
  const someChecked = anySelected ? null : false;
  const isChecked = allSelected ? true : someChecked;

  const dropdownItems = [
    <DropdownItem key="item-1" onClick={() => onBulkSelectClicked('none')}>
      {intl.formatMessage(messages.toolBarBulkSelectNone)}
    </DropdownItem>,
    <DropdownItem key="item-2" onClick={() => onBulkSelectClicked('page')}>
      {intl.formatMessage(messages.toolBarBulkSelectPage, { value: itemsPerPage })}
    </DropdownItem>,
  ];

  if (showSelectAll) {
    dropdownItems.push(
      <DropdownItem key="item-3" onClick={() => onBulkSelectClicked('all')}>
        {intl.formatMessage(messages.toolBarBulkSelectAll, { value: itemsTotal })}
      </DropdownItem>
    );
  }

  const bulkSelect = (
    <Dropdown
      onSelect={onBulkSelect}
      position={DropdownPosition.left}
      toggle={
        <DropdownToggle
          isDisabled={isDisabled || isBulkSelectDisabled || isReadOnly}
          splitButtonItems={[
            <DropdownToggleCheckbox
              id="bulk-select"
              key="bulk-select"
              aria-label={intl.formatMessage(
                anySelected ? messages.toolBarBulkSelectAriaDeselect : messages.toolBarBulkSelectAriaSelect
              )}
              isChecked={isChecked}
              onClick={() => {
                anySelected ? onBulkSelectClicked('none') : onBulkSelectClicked('all');
              }}
            />,
          ]}
          onToggle={onBulkSelectToggle}
        >
          {numSelected !== 0 && (
            <React.Fragment>{intl.formatMessage(messages.selected, { value: numSelected })}</React.Fragment>
          )}
        </DropdownToggle>
      }
      isOpen={isBulkSelectOpen}
      dropdownItems={dropdownItems}
    />
  );
  return isReadOnly ? (
    <Tooltip content={intl.formatMessage(messages.readOnlyPermissions)}>{bulkSelect}</Tooltip>
  ) : (
    bulkSelect
  );
};
