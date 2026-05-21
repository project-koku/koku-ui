import { Button, ButtonVariant } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import { AddPriceListAction } from 'routes/settings/costModel/costModelBreakdown/priceLists/components/actions';
import type { Filter } from 'routes/utils/filter';

import { PriceListActions } from './components/actions/priceListActions';

interface PriceListToolbarOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isDraggable?: boolean;
  isOrderDisabled?: boolean;
  isRemoveDisabled?: boolean;
  isSaveDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onAdd?: (priceLists: PriceListData[]) => void;
  onBulkSelect?: (action: string) => void;
  onClose?: () => void;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onOrderClick?: () => void;
  onRemove?: (priceLists: PriceListData[]) => void;
  onSaveClick?: () => void;
  pagination?: React.ReactNode;
  query?: OcpQuery;
  selectedItems?: SettingsData[];
}

type PriceListToolbarProps = PriceListToolbarOwnProps;

const PriceListToolbar: React.FC<PriceListToolbarProps> = ({
  canWrite,
  costModel,
  isAllSelected,
  isDisabled,
  isDraggable,
  isOrderDisabled,
  isRemoveDisabled,
  isSaveDisabled,
  itemsPerPage,
  itemsTotal,
  onAdd,
  onBulkSelect,
  onFilterAdded,
  onFilterRemoved,
  onOrderClick,
  onRemove,
  onSaveClick,
  pagination,
  query,
  selectedItems,
}) => {
  const intl = useIntl();

  const getActions = () => {
    const isAriaDisabled = !canWrite || isDisabled;

    return (
      <>
        {isDraggable ? (
          <Button isAriaDisabled={isAriaDisabled || isSaveDisabled} onClick={onSaveClick} variant={ButtonVariant.link}>
            {intl.formatMessage(messages.saveOrdering)}
          </Button>
        ) : (
          <AddPriceListAction canWrite={canWrite} costModel={costModel} isDisabled={isDisabled} onAdd={onAdd} />
        )}
        <Button isAriaDisabled={isAriaDisabled || isOrderDisabled} onClick={onOrderClick} variant={ButtonVariant.link}>
          {intl.formatMessage(isDraggable ? messages.cancelOrdering : messages.orderPriceLists)}
        </Button>
        <PriceListActions
          canWrite={canWrite}
          costModel={costModel}
          isDisabled={isRemoveDisabled || isDisabled}
          onRemove={onRemove}
          selectedItems={selectedItems}
        />
      </>
    );
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
      {isDraggable && <p>{intl.formatMessage(messages.priceListDragRowsDesc)}</p>}
    </>
  );
};

export { PriceListToolbar };
