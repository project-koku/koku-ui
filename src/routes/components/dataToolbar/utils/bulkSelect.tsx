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
  handleOnBulkSelect,
  handleOnBulkSelectClicked,
  handleOnBulkSelectToggle,
  isAllSelected,
  isBulkSelectDisabled,
  isBulkSelectOpen,
  isDisabled,
  isReadOnly,
  itemsPerPage,
  itemsTotal,
  selectedItems,
  showSelectAll = true,
}: {
  handleOnBulkSelect?: () => void;
  handleOnBulkSelectClicked?: (action: string) => void;
  handleOnBulkSelectToggle?: (isOpen: boolean) => void;
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isBulkSelectOpen?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  selectedItems?: ComputedReportItem[];
  showSelectAll?: boolean;
}) => {
  const numSelected = isAllSelected ? itemsTotal : selectedItems ? selectedItems.length : 0;
  const allSelected = (isAllSelected || numSelected === itemsTotal) && itemsTotal > 0;
  const anySelected = numSelected > 0;
  const someChecked = anySelected ? null : false;
  const isChecked = allSelected ? true : someChecked;

  const dropdownItems = [
    <DropdownItem key="item-1" onClick={() => handleOnBulkSelectClicked('none')}>
      {intl.formatMessage(messages.toolBarBulkSelectNone)}
    </DropdownItem>,
    <DropdownItem key="item-2" onClick={() => handleOnBulkSelectClicked('page')}>
      {intl.formatMessage(messages.toolBarBulkSelectPage, { value: itemsPerPage })}
    </DropdownItem>,
  ];

  if (showSelectAll) {
    dropdownItems.push(
      <DropdownItem key="item-3" onClick={() => handleOnBulkSelectClicked('all')}>
        {intl.formatMessage(messages.toolBarBulkSelectAll, { value: itemsTotal })}
      </DropdownItem>
    );
  }

  const bulkSelect = (
    <Dropdown
      onSelect={handleOnBulkSelect}
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
                anySelected ? handleOnBulkSelectClicked('none') : handleOnBulkSelectClicked('all');
              }}
            />,
          ]}
          onToggle={handleOnBulkSelectToggle}
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
