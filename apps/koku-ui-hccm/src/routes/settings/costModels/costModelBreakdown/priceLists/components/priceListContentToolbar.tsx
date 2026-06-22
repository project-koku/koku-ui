import { Button, ButtonVariant } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import { CreatePriceListAction } from 'routes/settings/priceLists/priceListCreate/components/actions';
import type { Filter } from 'routes/utils/filter';

export const enum GroupType {
  default = 'default',
  platform = 'Platform',
}

interface PriceListContentToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelect(action: string): void;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onRefresh(): void;
  pagination?: React.ReactNode;
  query?: OcpQuery;
  selectedItems?: PriceListData[];
}

type PriceListContentToolbarProps = PriceListContentToolbarOwnProps;

const PriceListContentToolbar: React.FC<PriceListContentToolbarProps> = ({
  canWrite = true,
  isAllSelected,
  isDisabled,
  itemsPerPage,
  itemsTotal,
  onBulkSelect,
  onFilterAdded,
  onFilterRemoved,
  onRefresh,
  pagination,
  query,
  selectedItems,
}) => {
  const intl = useIntl();

  const getActions = () => {
    return (
      <>
        <CreatePriceListAction canWrite={canWrite} isDisabled={isDisabled} isSecondary />
        <Button
          aria-label={intl.formatMessage(messages.priceListRefresh)}
          iconPosition="right"
          isAriaDisabled={!canWrite || isDisabled}
          onClick={onRefresh}
          variant={ButtonVariant.link}
        >
          {intl.formatMessage(messages.priceListRefresh)}
        </Button>
      </>
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

export { PriceListContentToolbar };
