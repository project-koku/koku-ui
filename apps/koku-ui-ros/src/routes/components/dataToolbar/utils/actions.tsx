import { Button, ButtonVariant, ToolbarItem } from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons/dist/esm/icons/export-icon';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';

// Column management

export const getColumnManagement = ({
  isDisabled,
  onColumnManagementClicked,
}: {
  isDisabled?: boolean;
  onColumnManagementClicked?: () => void;
}) => {
  return (
    <ToolbarItem visibility={{ default: 'hidden', '2xl': 'visible', xl: 'visible', lg: 'hidden' }}>
      <Button isDisabled={isDisabled} onClick={onColumnManagementClicked} variant={ButtonVariant.link}>
        {intl.formatMessage(messages.detailsColumnManagementTitle)}
      </Button>
    </ToolbarItem>
  );
};

// Export button

export const getExportButton = ({
  isDisabled,
  isExportDisabled,
  onExportClicked,
}: {
  isDisabled?: boolean;
  isExportDisabled?: boolean;
  onExportClicked?: () => void;
}) => {
  return (
    <ToolbarItem
      gap={{
        default: 'gapNone',
      }}
    >
      <Button
        icon={<ExportIcon />}
        aria-label="Export data"
        isDisabled={isDisabled || isExportDisabled}
        onClick={onExportClicked}
        variant={ButtonVariant.plain}
      ></Button>
    </ToolbarItem>
  );
};

// Kebab

export const getKebab = ({
  onColumnManagementClicked,
  showColumnManagement,
}: {
  onColumnManagementClicked?: () => void;
  showColumnManagement?: boolean;
}) => {
  const items = [];
  if (showColumnManagement) {
    items.push({
      onClick: onColumnManagementClicked,
      toString: () => intl.formatMessage(messages.detailsColumnManagementTitle),
    });
  }
  return (
    <ToolbarItem visibility={{ xl: 'hidden' }}>
      <DropdownWrapper isKebab items={items} />
    </ToolbarItem>
  );
};
