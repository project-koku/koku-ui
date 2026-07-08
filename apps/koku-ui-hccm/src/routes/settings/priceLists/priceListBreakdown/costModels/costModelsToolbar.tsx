import type { OcpQuery } from 'api/queries/ocpQuery';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { Filter } from 'routes/utils/filter';

interface CostModelsToolbarOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  query?: OcpQuery;
}

type CostModelsToolbarProps = CostModelsToolbarOwnProps;

const CostModelsToolbar: React.FC<CostModelsToolbarProps> = ({
  canWrite,
  isDisabled,
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
      onFilterAdded={onFilterAdded}
      onFilterRemoved={onFilterRemoved}
      query={query}
      showFilter
      useActiveFilters
    />
  );
};

export { CostModelsToolbar };
