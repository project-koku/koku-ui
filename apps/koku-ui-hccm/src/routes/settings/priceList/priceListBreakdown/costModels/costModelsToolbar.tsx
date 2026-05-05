import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { Filter } from 'routes/utils/filter';

interface CostModelsToolbarOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  query?: OcpQuery;
}

type CostModelsToolbarProps = CostModelsToolbarOwnProps;

const CostModelsToolbar: React.FC<CostModelsToolbarProps> = ({
  canWrite,
  isDisabled,
  itemsTotal,
  onFilterAdded,
  onFilterRemoved,
  query,
}) => {
  const intl = useIntl();

  const getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const options = [
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
    <BasicToolbar
      categoryOptions={getCategoryOptions()}
      isDisabled={isDisabled}
      isReadOnly={!canWrite}
      itemsTotal={itemsTotal}
      onFilterAdded={onFilterAdded}
      onFilterRemoved={onFilterRemoved}
      query={query}
      resourcePathsType={ResourcePathsType.ocp}
      showFilter
    />
  );
};

export { CostModelsToolbar };
