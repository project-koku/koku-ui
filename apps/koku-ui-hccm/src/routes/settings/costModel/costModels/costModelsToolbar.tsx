import { Button, ButtonVariant } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { Filter } from 'routes/utils/filter';

export const enum GroupType {
  default = 'default',
  platform = 'Platform',
}

interface CostModelsToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onCreate?: () => void;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: OcpQuery;
}

type CostModelsToolbarProps = CostModelsToolbarOwnProps;

const CostModelsToolbar: React.FC<CostModelsToolbarProps> = ({
  canWrite,
  isAllSelected,
  isDisabled,
  itemsPerPage,
  itemsTotal,
  onCreate,
  onFilterAdded,
  onFilterRemoved,
  pagination,
  query,
}) => {
  const intl = useIntl();

  const getActions = () => {
    return (
      <Button isAriaDisabled={!canWrite} onClick={onCreate} variant={ButtonVariant.primary}>
        {intl.formatMessage(messages.costModelsWizardCreateCostModel)}
      </Button>
    );
  };

  const getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const options = [
      {
        ariaLabelKey: 'name',
        key: 'name',
        name: intl.formatMessage(messages.filterByValues, { value: 'name' }),
        placeholderKey: 'name', // place holder key for category input
      },
      {
        ariaLabelKey: 'description',
        key: 'description',
        name: intl.formatMessage(messages.filterByValues, { value: 'description' }),
        placeholderKey: 'description', // place holder key for category input
      },
      {
        ariaLabelKey: 'source_type',
        isMultiSelect: false,
        key: 'source_type',
        name: intl.formatMessage(messages.filterByValues, { value: 'source_type' }),
        placeholderKey: 'source_type', // place holder key for category input
        selectClassName: 'selectOverride', // A selector from routes/components/dataToolbar/dataToolbar.scss
        selectOptions: [
          {
            key: 'aws',
            name: intl.formatMessage(messages.aws),
          },
          {
            key: 'azure',
            name: intl.formatMessage(messages.azure),
          },
          {
            key: 'gcp',
            name: intl.formatMessage(messages.gcp),
          },
          {
            key: 'ocp',
            name: intl.formatMessage(messages.openShift),
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
      isAllSelected={isAllSelected}
      isDisabled={isDisabled}
      isReadOnly={!canWrite}
      itemsPerPage={itemsPerPage}
      itemsTotal={itemsTotal}
      onFilterAdded={onFilterAdded}
      onFilterRemoved={onFilterRemoved}
      pagination={pagination}
      query={query}
      resourcePathsType={ResourcePathsType.ocp}
      showFilter
    />
  );
};

export { CostModelsToolbar };
