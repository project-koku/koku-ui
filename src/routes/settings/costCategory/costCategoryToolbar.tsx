import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { Filter } from 'routes/utils/filter';

import { styles } from './costCategory.styles';

interface CostCategoryToolbarOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isPrimaryActionDisabled?: boolean;
  isSecondaryActionDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelect(action: string);
  onDisableTags();
  onEnableTags();
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: OcpQuery;
  selectedItems?: SettingsData[];
  showBulkSelectAll?: boolean;
}

type CostCategoryToolbarProps = CostCategoryToolbarOwnProps;

const CostCategoryToolbar: React.FC<CostCategoryToolbarProps> = ({
  canWrite,
  isDisabled,
  isPrimaryActionDisabled,
  isSecondaryActionDisabled,
  itemsPerPage,
  itemsTotal,
  onBulkSelect,
  onDisableTags,
  onEnableTags,
  onFilterAdded,
  onFilterRemoved,
  pagination,
  query,
  selectedItems,
  showBulkSelectAll,
}) => {
  const intl = useIntl();

  const getActions = () => {
    const isAriaDisabled = !canWrite || isDisabled || selectedItems.length === 0;
    const tooltip = intl.formatMessage(!canWrite ? messages.readOnlyPermissions : messages.selectCategories);

    return (
      <>
        <Tooltip content={tooltip}>
          <Button
            isAriaDisabled={isAriaDisabled || isPrimaryActionDisabled}
            key="save"
            onClick={onEnableTags}
            variant={ButtonVariant.primary}
          >
            {intl.formatMessage(messages.enableCategories)}
          </Button>
        </Tooltip>
        <Tooltip content={tooltip}>
          <Button
            isAriaDisabled={isAriaDisabled || isSecondaryActionDisabled}
            key="reset"
            onClick={onDisableTags}
            style={styles.action}
            variant={ButtonVariant.secondary}
          >
            {intl.formatMessage(messages.disableCategories)}
          </Button>
        </Tooltip>
      </>
    );
  };

  const getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const options = [
      {
        ariaLabelKey: 'name',
        placeholderKey: 'name',
        key: 'key',
        name: intl.formatMessage(messages.filterByValues, { value: 'name' }),
      },
      {
        ariaLabelKey: 'status',
        placeholderKey: 'status',
        key: 'enabled',
        name: intl.formatMessage(messages.filterByValues, { value: 'status' }),
        selectOptions: [
          {
            name: intl.formatMessage(messages.enabled),
            key: 'true',
          },
          {
            name: intl.formatMessage(messages.disabled),
            key: 'false',
          },
        ],
      },
    ];
    return options;
  };

  return (
    <BasicToolbar
      actions={getActions()}
      categoryOptions={getCategoryOptions()}
      isDisabled={isDisabled}
      isReadOnly={!canWrite}
      itemsPerPage={itemsPerPage}
      itemsTotal={itemsTotal}
      onBulkSelect={onBulkSelect}
      onFilterAdded={onFilterAdded}
      onFilterRemoved={onFilterRemoved}
      pagination={pagination}
      query={query}
      resourcePathsType={ResourcePathsType.ocp}
      selectedItems={selectedItems}
      showBulkSelect
      showBulkSelectAll={showBulkSelectAll}
      showFilter
    />
  );
};

export { CostCategoryToolbar };
