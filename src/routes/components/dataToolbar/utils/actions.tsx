import { Button, ButtonVariant, Switch, ToolbarItem } from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons/dist/esm/icons/export-icon';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import { DataKebab } from 'routes/components/dataToolbar/dataKebab';

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
      spacer={{
        default: 'spacerNone',
      }}
    >
      <Button
        aria-label="Export data"
        isDisabled={isDisabled || isExportDisabled}
        onClick={onExportClicked}
        variant={ButtonVariant.plain}
      >
        <ExportIcon />
      </Button>
    </ToolbarItem>
  );
};

// Platform costs

export const getPlatformCosts = ({
  isDisabled,
  isPlatformCostsChecked,
  onPlatformCostsChanged,
}: {
  isDisabled?: boolean;
  isPlatformCostsChecked?: boolean;
  onPlatformCostsChanged?: (checked: boolean) => void;
}) => {
  return (
    <ToolbarItem visibility={{ default: 'hidden', '2xl': 'visible', xl: 'visible', lg: 'hidden' }}>
      <Switch
        id="platform-costs"
        label={intl.formatMessage(messages.sumPlatformCosts)}
        isChecked={isPlatformCostsChecked}
        isDisabled={isDisabled}
        onChange={(_evt, checked) => onPlatformCostsChanged(checked)}
      />
    </ToolbarItem>
  );
};

// Kebab

export const getKebab = ({
  isPlatformCostsChecked,
  onColumnManagementClicked,
  onPlatformCostsChanged,
  showColumnManagement,
  showPlatformCosts,
}: {
  isPlatformCostsChecked?: boolean;
  onColumnManagementClicked?: () => void;
  onPlatformCostsChanged?: (checked: boolean) => void;
  showColumnManagement?: boolean;
  showPlatformCosts?: boolean;
}) => {
  const options = [];
  if (showColumnManagement) {
    options.push({
      label: messages.detailsColumnManagementTitle,
      onClick: onColumnManagementClicked,
    });
  }
  if (showPlatformCosts) {
    options.push({
      label: messages.sumPlatformCosts,
      onClick: () => onPlatformCostsChanged(!isPlatformCostsChecked),
    });
  }
  return (
    <ToolbarItem visibility={{ xl: 'hidden' }}>
      <DataKebab options={options} />
    </ToolbarItem>
  );
};
