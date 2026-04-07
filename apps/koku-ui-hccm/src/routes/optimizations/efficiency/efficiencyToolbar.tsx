import type { ToolbarLabelGroup } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import type { ResourcePathsType } from 'api/resources/resource';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { DataToolbar } from 'routes/components/dataToolbar';
import type { Filter } from 'routes/utils/filter';

interface EfficiencyToolbarOwnProps {
  isDisabled?: boolean;
  groupBy?: string;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  query?: OcpQuery;
  resourcePathsType?: ResourcePathsType;
}

type EfficiencyToolbarProps = EfficiencyToolbarOwnProps;

const EfficiencyToolbar: React.FC<EfficiencyToolbarProps> = ({
  isDisabled,
  groupBy,
  onFilterAdded,
  onFilterRemoved,
  query,
  resourcePathsType,
}: EfficiencyToolbarProps) => {
  const intl = useIntl();

  const getCategoryOptions = (): ToolbarLabelGroup[] => {
    const options = [
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }),
        key: 'cluster',
        resourceKey: 'cluster_alias',
      },
      // { name: intl.formatMessage(messages.filterByValues, { value: 'node' }), key: 'node' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'project' }), key: 'project' },
    ];

    return options;
  };

  return (
    <DataToolbar
      categoryOptions={getCategoryOptions()}
      groupBy={groupBy}
      isDisabled={isDisabled}
      onFilterAdded={onFilterAdded}
      onFilterRemoved={onFilterRemoved}
      query={query}
      resourcePathsType={resourcePathsType}
      showCriteria
      showFilter
    />
  );
};

export { EfficiencyToolbar };
