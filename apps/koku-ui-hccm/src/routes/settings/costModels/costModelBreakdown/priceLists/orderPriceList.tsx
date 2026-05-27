import { Alert, AlertActionCloseButton, Card, CardBody } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import type { Query } from 'api/queries/query';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import * as queryUtils from 'routes/utils/query';

import { NoPriceListState } from './components/state';
import { styles } from './orderPriceList.styles';
import { OrderPriceListContent } from './orderPriceListContent';
import { getFilteredPriceLists, getPaginatedPriceLists } from './utils';

interface OrderPriceListOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  isDispatch?: boolean;
  onAdd?: (priceLists: PriceListDataExt[]) => void;
  onRemove?: (priceLists: PriceListDataExt[]) => void;
  onSave?: (priceLists: PriceListDataExt[]) => void;
  showDraggable?: boolean;
}

export interface PriceListDataExt extends PriceListData {
  priority?: number;
}

export interface OrderPriceListMapProps {
  costModel?: CostModel;
  pageNumber?: number;
  perPage?: number;
  query?: Query;
}

export interface OrderPriceListStateProps {
  priceLists: PriceListDataExt[]; // Price lists without filters and pagination for editing
  priceListsTotal: number; // Total number of filtered (unpaginated) price lists
}

export interface OrderPriceListHandle {
  /** Persists the current selection to the parent via onAdd. Returns the number of selected rows. */
  save: () => void;
}

type OrderPriceListProps = OrderPriceListOwnProps;

export const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    name: 'asc',
  },
};

const OrderPriceList: React.FC<OrderPriceListProps> = ({
  canWrite,
  costModel,
  isDispatch = true,
  onAdd,
  onRemove,
  onSave,
  showDraggable,
}: OrderPriceListProps) => {
  const intl = useIntl();

  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(baseQuery.limit);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [query, setQuery] = useState({ ...baseQuery });

  const { priceLists, priceListsTotal } = useMapToProps({
    costModel,
    pageNumber,
    perPage,
    query,
  });

  const hasFilters = query?.filter_by?.name?.length > 0 || query?.filter_by?.metrics?.length > 0;
  const hasNoPriceLists = priceLists?.length === 0 && !hasFilters;

  // Handlers

  const handleOnAlertClose = () => {
    setIsRecalculating(false);
  };

  const handleOnAdd = (items: PriceListDataExt[]) => {
    setIsRecalculating(true);
    onAdd?.(items);
  };

  const handleOnFilterAdded = filter => {
    const newQuery = queryUtils.handleOnFilterAdded(query, filter);
    setQuery(newQuery);
    setPageNumber(1); // Reset pagination
  };

  const handleOnFilterRemoved = filter => {
    const newQuery = queryUtils.handleOnFilterRemoved(query, filter);
    setQuery(newQuery);
    setPageNumber(1); // Reset pagination
  };

  const handleOnPageNumber = value => {
    setPageNumber(value);
  };

  const handleOnPerPage = value => {
    setPerPage(value);
    setPageNumber(1); // Reset pagination
  };

  const handleOnRemove = (items: PriceListDataExt[]) => {
    setIsRecalculating(true);
    onRemove?.(items);
  };

  const handleOnSave = (items: PriceListDataExt[]) => {
    setIsRecalculating(true);
    onSave?.(items);
  };

  return (
    <>
      {!showDraggable && isRecalculating && (
        <div style={styles.alertContainer}>
          <Alert
            isInline
            actionClose={<AlertActionCloseButton onClose={handleOnAlertClose} />}
            title={intl.formatMessage(messages.recalculateCharges)}
            variant="info"
          >
            <p>{intl.formatMessage(messages.costModelsRecalculateDesc)}</p>
          </Alert>
        </div>
      )}
      {!hasNoPriceLists ? (
        <OrderPriceListContent
          canWrite={canWrite}
          costModel={costModel}
          isDispatch={isDispatch}
          isDisabled={hasNoPriceLists}
          onAdd={handleOnAdd}
          onFilterAdded={handleOnFilterAdded}
          onFilterRemoved={handleOnFilterRemoved}
          onPerPage={handleOnPerPage}
          onPageNumber={handleOnPageNumber}
          onRemove={handleOnRemove}
          onSave={handleOnSave}
          pageNumber={pageNumber}
          perPage={perPage}
          priceLists={priceLists}
          priceListsTotal={priceListsTotal}
          query={query}
        />
      ) : (
        <Card>
          <CardBody>
            <NoPriceListState canWrite={canWrite} costModel={costModel} onAdd={handleOnAdd} />
          </CardBody>
        </Card>
      )}
    </>
  );
};

const useMapToProps = ({ costModel, pageNumber, perPage, query }: OrderPriceListMapProps): OrderPriceListStateProps => {
  // Apply priority sort, filter, and paginate
  const filteredPriceLists = getFilteredPriceLists(costModel?.price_lists, query?.filter_by);
  const paginatedPriceLists = getPaginatedPriceLists(filteredPriceLists, pageNumber, perPage);

  return {
    priceLists: paginatedPriceLists,
    priceListsTotal: filteredPriceLists?.length ?? 0,
  };
};

export { OrderPriceList };
