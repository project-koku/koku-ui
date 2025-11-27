import type { OcpQuery } from '@koku-ui/api/queries/ocpQuery';
import { ResourcePathsType } from '@koku-ui/api/resources/resource';
import type { SettingsData } from '@koku-ui/api/settings';
import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import React from 'react';
import { useIntl } from 'react-intl';

import { BasicToolbar } from '../../components/dataToolbar';
import type { ToolbarChipGroupExt } from '../../components/dataToolbar/utils/common';
import type { Filter } from '../../utils/filter';
import { styles } from './platformProjects.styles';

export const enum GroupType {
  default = 'default',
  platform = 'Platform',
}

interface PlatformProjectsToolbarOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isPrimaryActionDisabled?: boolean;
  isSecondaryActionDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onAdd();
  onBulkSelect(action: string);
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onRemove();
  pagination?: React.ReactNode;
  query?: OcpQuery;
  selectedItems?: SettingsData[];
  showBulkSelectAll?: boolean;
}

type PlatformProjectsToolbarProps = PlatformProjectsToolbarOwnProps;

const PlatformProjectsToolbar: React.FC<PlatformProjectsToolbarProps> = ({
  canWrite,
  isDisabled,
  isPrimaryActionDisabled,
  isSecondaryActionDisabled,
  itemsPerPage,
  itemsTotal,
  onAdd,
  onBulkSelect,
  onFilterAdded,
  onFilterRemoved,
  onRemove,
  pagination,
  query,
  selectedItems,
  showBulkSelectAll,
}) => {
  const intl = useIntl();

  const getActions = () => {
    const isAriaDisabled = !canWrite || isDisabled || selectedItems.length === 0;
    const tooltip = intl.formatMessage(!canWrite ? messages.readOnlyPermissions : messages.selectProjects);

    return (
      <>
        <Tooltip content={tooltip}>
          <Button
            isAriaDisabled={isAriaDisabled || isPrimaryActionDisabled}
            key="save"
            onClick={onAdd}
            variant={ButtonVariant.primary}
          >
            {intl.formatMessage(messages.addProjects)}
          </Button>
        </Tooltip>
        <Tooltip content={tooltip}>
          <Button
            isAriaDisabled={isAriaDisabled || isSecondaryActionDisabled}
            key="reset"
            onClick={onRemove}
            style={styles.action}
            variant={ButtonVariant.secondary}
          >
            {intl.formatMessage(messages.removeProjects)}
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
        key: 'project',
        name: intl.formatMessage(messages.filterByValues, { value: 'name' }),
      },
      {
        ariaLabelKey: 'group',
        placeholderKey: 'group',
        key: 'group',
        name: intl.formatMessage(messages.filterByValues, { value: 'group' }),
        selectOptions: [
          {
            name: intl.formatMessage(messages.platform),
            key: GroupType.platform,
          },
        ],
      },
      {
        ariaLabelKey: 'cluster',
        placeholderKey: 'cluster',
        key: 'cluster',
        name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }),
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

export { PlatformProjectsToolbar };
