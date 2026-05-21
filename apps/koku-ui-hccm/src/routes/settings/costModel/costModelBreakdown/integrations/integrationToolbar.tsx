import type { CostModel } from 'api/costModels';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { Filter } from 'routes/utils/filter';

import { AddIntegrationAction } from './components/actions';

interface IntegrationToolbarOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onAdd?: (uuids: string[]) => void;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: OcpQuery;
}

type IntegrationToolbarProps = IntegrationToolbarOwnProps;

const IntegrationToolbar: React.FC<IntegrationToolbarProps> = ({
  canWrite,
  costModel,
  isDisabled,
  itemsPerPage,
  itemsTotal,
  onAdd,
  onFilterAdded,
  onFilterRemoved,
  pagination,
  query,
}) => {
  const intl = useIntl();

  const getActions = () => {
    return <AddIntegrationAction canWrite={canWrite} costModel={costModel} onAdd={onAdd} />;
  };

  const getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const options: ToolbarChipGroupExt[] = [
      {
        ariaLabelKey: 'name',
        placeholderKey: 'name',
        key: 'name',
        name: intl.formatMessage(messages.filterByValues, { value: 'name' }),
      },
    ];
    return options;
  };

  return (
    <>
      <BasicToolbar
        actions={getActions()}
        categoryOptions={getCategoryOptions()}
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
    </>
  );
};

export { IntegrationToolbar };
