import { intl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant, Switch, ToolbarItem } from '@patternfly/react-core';
import { ExportIcon } from '@patternfly/react-icons/dist/esm/icons/export-icon';
import React from 'react';

import { DropdownWrapper } from '../../dropdownWrapper';
import { styles } from '../dataToolbar.styles';

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
    <ToolbarItem
      visibility={{ default: 'hidden', '2xl': 'visible', xl: 'visible', lg: 'hidden' }}
      style={styles.platformCosts}
    >
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
  const items = [];
  if (showColumnManagement) {
    items.push({
      onClick: onColumnManagementClicked,
      toString: () => intl.formatMessage(messages.detailsColumnManagementTitle),
    });
  }
  if (showPlatformCosts) {
    items.push({
      onClick: () => onPlatformCostsChanged(!isPlatformCostsChecked),
      toString: () => intl.formatMessage(messages.sumPlatformCosts),
    });
  }
  return (
    <ToolbarItem visibility={{ xl: 'hidden' }}>
      <DropdownWrapper isKebab items={items} />
    </ToolbarItem>
  );
};
