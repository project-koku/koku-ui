import type { PriceListData } from 'api/priceList';
import type { OcpQuery } from 'api/queries/ocpQuery';
import type { Rate } from 'api/rates';
import { ResourcePathsType } from 'api/resources/resource';
import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import { AddRate } from 'routes/settings/priceList/components/rates';
import type { Filter } from 'routes/utils/filter';

interface RatesToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onAdd?: (rates: Rate[]) => void;
  onAddSuccess?: () => void;
  onClose?: () => void;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onSuccess?: () => void;
  pagination?: React.ReactNode;
  priceList: PriceListData;
  query?: OcpQuery;
  selectedItems?: SettingsData[];
}

type RatesToolbarProps = RatesToolbarOwnProps;

const RatesToolbar: React.FC<RatesToolbarProps> = ({
  canWrite,
  isAllSelected,
  isDisabled,
  itemsPerPage,
  itemsTotal,
  onAdd,
  onAddSuccess,
  onClose,
  onFilterAdded,
  onFilterRemoved,
  pagination,
  priceList,
  query,
  selectedItems,
}) => {
  const intl = useIntl();

  const getActions = () => {
    return (
      <AddRate
        canWrite={canWrite}
        isDisabled={isDisabled}
        onAdd={onAdd}
        onAddSuccess={onAddSuccess}
        onClose={onClose}
        priceList={priceList}
      />
    );
  };

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
      selectedItems={selectedItems}
      showFilter
    />
  );
};

export { RatesToolbar };
