import { Button, ButtonVariant, Switch, ToolbarItem } from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons/dist/esm/icons/export-icon';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import { DataKebab } from 'routes/components/dataToolbar/dataKebab';

// Column management

export const getColumnManagement = ({
  handleColumnManagementClicked,
  isDisabled,
}: {
  handleColumnManagementClicked?: () => void;
  isDisabled?: boolean;
}) => {
  return (
    <ToolbarItem visibility={{ default: 'hidden', '2xl': 'visible', xl: 'visible', lg: 'hidden' }}>
      <Button isDisabled={isDisabled} onClick={handleColumnManagementClicked} variant={ButtonVariant.link}>
        {intl.formatMessage(messages.detailsColumnManagementTitle)}
      </Button>
    </ToolbarItem>
  );
};

// Export button

export const getExportButton = ({
  handleExportClicked,
  isDisabled,
  isExportDisabled,
}: {
  handleExportClicked?: () => void;
  isDisabled?: boolean;
  isExportDisabled?: boolean;
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
        onClick={handleExportClicked}
        variant={ButtonVariant.plain}
      >
        <ExportIcon />
      </Button>
    </ToolbarItem>
  );
};

// Platform costs

export const getPlatformCosts = ({
  handlePlatformCostsChanged,
  isDisabled,
  isPlatformCostsChecked,
}: {
  handlePlatformCostsChanged?: (checked: boolean) => void;
  isDisabled?: boolean;
  isPlatformCostsChecked?: boolean;
}) => {
  return (
    <ToolbarItem visibility={{ default: 'hidden', '2xl': 'visible', xl: 'visible', lg: 'hidden' }}>
      <Switch
        id="platform-costs"
        label={intl.formatMessage(messages.sumPlatformCosts)}
        isChecked={isPlatformCostsChecked}
        isDisabled={isDisabled}
        onChange={handlePlatformCostsChanged}
      />
    </ToolbarItem>
  );
};

// Kebab

export const getKebab = ({
  handleColumnManagementClicked,
  handlePlatformCostsChanged,
  isPlatformCostsChecked,
  showColumnManagement,
  showPlatformCosts,
}: {
  handleColumnManagementClicked?: () => void;
  handlePlatformCostsChanged?: (checked: boolean) => void;
  isPlatformCostsChecked?: boolean;
  showColumnManagement?: boolean;
  showPlatformCosts?: boolean;
}) => {
  const options = [];
  if (showColumnManagement) {
    options.push({
      label: messages.detailsColumnManagementTitle,
      onClick: handleColumnManagementClicked,
    });
  }
  if (showPlatformCosts) {
    options.push({
      label: messages.sumPlatformCosts,
      onClick: () => handlePlatformCostsChanged(!isPlatformCostsChecked),
    });
  }
  return (
    <ToolbarItem visibility={{ xl: 'hidden' }}>
      <DataKebab options={options} />
    </ToolbarItem>
  );
};
