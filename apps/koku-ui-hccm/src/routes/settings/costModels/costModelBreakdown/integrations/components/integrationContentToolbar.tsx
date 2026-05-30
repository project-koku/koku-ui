import type { Provider } from 'api/providers';
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

interface IntegrationContentToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelect(action: string): void;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: OcpQuery;
  selectedItems?: Provider[];
}

type IntegrationContentToolbarProps = IntegrationContentToolbarOwnProps;

const IntegrationContentToolbar: React.FC<IntegrationContentToolbarProps> = ({
  canWrite = true,
  isAllSelected,
  isDisabled,
  itemsPerPage,
  itemsTotal,
  onBulkSelect,
  onFilterAdded,
  onFilterRemoved,
  pagination,
  query,
  selectedItems,
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
      isAllSelected={isAllSelected}
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
      showBulkSelectAll={false}
      showBulkSelectPage
      showFilter
    />
  );
};

export { IntegrationContentToolbar };
