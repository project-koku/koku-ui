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
import { AddRate } from 'routes/settings/priceList/priceListBreakdown/rates/components/add';
import type { Filter } from 'routes/utils/filter';

interface RatesToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isDispatch?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onAdd?: (rates: Rate[]) => void;
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
  isDispatch,
  itemsPerPage,
  itemsTotal,
  onAdd,
  onClose,
  onFilterAdded,
  onFilterRemoved,
  onSuccess,
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
        isDispatch={isDispatch}
        onAdd={onAdd}
        onClose={onClose}
        onSuccess={onSuccess}
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
