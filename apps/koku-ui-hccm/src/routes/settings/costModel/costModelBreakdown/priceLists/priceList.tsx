import { Alert, AlertActionCloseButton, Card, CardBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import type { Query } from 'api/queries/query';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { getSourceType } from 'routes/settings/costModel/costModels/utils';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions } from 'store/costModels';

import { TimelineChart } from './components/charts';
import { NoPriceListState } from './components/state';
import { styles } from './priceList.styles';
import { PriceListTable } from './priceListTable';
import { PriceListToolbar } from './priceListToolbar';
import { getFilteredPriceLists, getPaginatedPriceLists } from './utils';

interface PriceListOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  onAdd?: (priceLists: PriceListDataExt[]) => void;
  onRemove?: (priceLists: PriceListDataExt[]) => void;
  onSave?: (priceLists: PriceListDataExt[]) => void;
}

interface PriceListDataExt extends PriceListData {
  priority?: number;
}

export interface PriceListMapProps {
  costModel?: CostModel;
  pageNumber?: number;
  perPage?: number;
  selectedItems?: PriceListDataExt[];
  query?: Query;
}

export interface PriceListStateProps {
  costModelsError?: AxiosError;
  costModelsStatus?: FetchStatus;
  priceLists: PriceListDataExt[]; // Price lists without filters and pagination for editing
  priceListsError?: AxiosError;
  priceListsStatus?: FetchStatus;
  priceListsTotal: number; // Total number of filtered (unpaginated) price lists
}

type PriceListProps = PriceListOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    name: 'asc',
  },
};

const PriceList: React.FC<PriceListProps> = ({ canWrite, costModel, onAdd, onRemove, onSave }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(baseQuery.limit);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [selectedItems, setSelectedItems] = useState<PriceListDataExt[]>([]);
  const [selectedItemsBaseline] = useState<PriceListDataExt[]>([]);
  const [query, setQuery] = useState({ ...baseQuery });

  const { costModelsError, costModelsStatus, priceLists, priceListsError, priceListsStatus, priceListsTotal } =
    useMapToProps({
      costModel,
      pageNumber,
      perPage,
      selectedItems,
      query,
    });

  const hasFilters = query?.filter_by?.name?.length > 0 || query?.filter_by?.metrics?.length > 0;
  const hasNoPriceLists = priceLists?.length === 0 && !hasFilters;
  const isLoading = priceListsStatus === FetchStatus.inProgress;

  const [orderedPriceLists, setOrderedPriceLists] = useState<PriceListDataExt[]>(priceLists ?? []);
  const [unorderedPriceLists, setUnorderedPriceLists] = useState<PriceListDataExt[]>(priceLists ?? []);

  const isSelectedItemsDirty =
    selectedItems.length !== selectedItemsBaseline.length ||
    selectedItems.some((item, index) => item.uuid !== selectedItemsBaseline[index].uuid);
  const isOrderedPriceListsDirty = orderedPriceLists.some(
    (item, index) => item.priority !== priceLists[index].priority
  );

  // Getters

  const getPagination = (isBottom = false) => {
    const offset = pageNumber * perPage - perPage;
    const page = Math.trunc(offset / perPage + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={hasNoPriceLists}
        itemCount={priceListsTotal}
        onPerPageSelect={(_event, value) => handleOnPerPageSelect(value)}
        onSetPage={(_event, value) => handleOnSetPage(value)}
        page={page}
        perPage={perPage}
        titles={{
          paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.openShift),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  const getTable = () => {
    return (
      <PriceListTable
        canWrite={canWrite}
        costModel={costModel}
        filterBy={query.filter_by}
        isDisabled={hasNoPriceLists}
        isDraggable={isDraggable}
        isLoading={isLoading}
        orderBy={query.order_by}
        onDrop={handleOnDrop}
        onRemove={handleOnRemove}
        onSelect={handleOnSelect}
        priceLists={orderedPriceLists}
        selectedItems={selectedItems}
      />
    );
  };

  const getToolbar = () => {
    return (
      <PriceListToolbar
        canWrite={canWrite}
        costModel={costModel}
        isDisabled={hasNoPriceLists}
        isDraggable={isDraggable}
        isOrderDisabled={costModel?.price_lists?.length === 0} // Todo: set to 1 after testing
        isRemoveDisabled={!isSelectedItemsDirty || selectedItems.length === 0}
        isSaveDisabled={!isOrderedPriceListsDirty}
        onAdd={handleOnAdd}
        onBulkSelect={handleOnBulkSelect}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        onOrderClick={handleOnOrderClick}
        onRemove={handleOnRemove}
        onSaveClick={handleOnSaveClick}
        pagination={getPagination()}
        query={query}
        selectedItems={selectedItems}
      />
    );
  };

  // Handlers

  const handleOnAlertClose = () => {
    setIsRecalculating(false);
  };

  const handleOnAdd = (items: PriceListDataExt[]) => {
    setIsRecalculating(true);
    setPageNumber(1);
    onAdd?.(items);
  };

  const handleOnBulkSelect = (action: string) => {
    if (action === 'none') {
      setSelectedItems([]);
    } else if (action === 'page') {
      const newSelectedItems = [...selectedItems];
      priceLists?.map(val => {
        if (!newSelectedItems.find(item => item.uuid === val.uuid)) {
          newSelectedItems.push(val);
        }
      });
      setSelectedItems(newSelectedItems);
    }
  };

  const handleOnDrop = (uuids: string[]) => {
    const newPriceLists = [];
    uuids.forEach(uuid => {
      const item = priceLists.find(val => val.uuid === uuid);
      if (item) {
        newPriceLists.push(item);
      }
    });
    setOrderedPriceLists(newPriceLists);
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

  const handleOnOrderClick = () => {
    setIsDraggable(!isDraggable);
    if (isDraggable) {
      setOrderedPriceLists(unorderedPriceLists);
    }
  };

  const handleOnPerPageSelect = value => {
    setPerPage(value);
    setPageNumber(1); // Reset pagination
  };

  const handleOnRemove = (items: PriceListDataExt[]) => {
    setIsRecalculating(true);
    setPageNumber(1);
    onRemove?.(items);
  };

  const handleOnSaveClick = () => {
    setIsRecalculating(true);
    setUnorderedPriceLists(orderedPriceLists);

    if (costModelsStatus !== FetchStatus.inProgress) {
      setIsFinish(true);
      setIsDraggable(false);

      dispatch(
        costModelsActions.updateCostModel(costModel?.uuid, {
          ...(costModel ?? {}),
          price_lists: orderedPriceLists.map((item, index) => ({
            uuid: item.uuid,
            name: item.name,
            priority: index + 1,
          })),
          source_type: getSourceType(costModel?.source_type),
        })
      );
    }
  };

  const handleOnSelect = (items: PriceListData[], isSelected: boolean = false) => {
    let newItems = [...selectedItems];
    if (items && items.length > 0) {
      if (isSelected) {
        items.map(item => newItems.push(item));
      } else {
        items.map(item => {
          newItems = newItems.filter(val => val.uuid !== item.uuid);
        });
      }
    }
    setSelectedItems(newItems);
  };

  const handleOnSetPage = value => {
    setPageNumber(value);
  };

  // Effects

  useEffect(() => {
    if (isFinish && costModelsStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!costModelsError) {
        onSave?.(orderedPriceLists);
      }
    }
  }, [isFinish, costModel, costModelsError, costModelsStatus, onSave, orderedPriceLists]);

  if (priceListsError) {
    return <NotAvailable />;
  }

  return (
    <>
      {isRecalculating && (
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
      {!hasNoPriceLists || isLoading ? (
        <>
          <TimelineChart priceLists={[...priceLists].sort((a, b) => b.priority - a.priority)} />
          <Card>
            <CardBody>
              <div style={styles.tableContainer}>
                {getToolbar()}
                {isLoading ? (
                  <LoadingState />
                ) : (
                  <>
                    {getTable()}
                    <div style={styles.paginationContainer}>{getPagination(true)}</div>
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        </>
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

const useMapToProps = ({
  costModel,
  pageNumber,
  perPage,
  selectedItems,
  query,
}: PriceListMapProps): PriceListStateProps => {
  const costModelsError = useSelector((state: RootState) => state.costModels.update.error);
  const costModelsStatus = useSelector((state: RootState) => state.costModels.update.status);

  // Apply priority sort, filter, and paginate
  const sortedPriceLists =
    (selectedItems?.length ? selectedItems : costModel?.price_lists)?.sort((a, b) => a.priority - b.priority) ?? [];
  const filteredPriceLists = getFilteredPriceLists(sortedPriceLists, query?.filter_by);
  const paginatedPriceLists = getPaginatedPriceLists(filteredPriceLists, pageNumber, perPage);

  const test = [
    {
      effective_end_date: '2026-04-30',
      effective_start_date: '2026-03-01',
      name: 'TEST prices',
      priority: 1,
      uuid: '69384708-087f-4013-88dd-a38157473f47',
    },
    {
      effective_end_date: '2026-05-31',
      effective_start_date: '2026-04-01',
      name: 'currency demo prices',
      priority: 2,
      uuid: 'c5e5093d-3dd8-4070-af13-6f63e863e8eb',
    },
    {
      effective_end_date: '2026-06-30',
      effective_start_date: '2026-05-01',
      name: 'dnakabaa-invalid-json-path prices',
      priority: 3,
      uuid: 'b81c45ee-2c94-47aa-842d-09bb2cc80042',
    },
    {
      effective_end_date: '2026-07-31',
      effective_start_date: '2026-06-01',
      name: 'ee prices',
      priority: 4,
      uuid: '4e4e855e-9e3f-4e86-9fcd-f44d269494e7',
    },
  ];
  return {
    costModelsError,
    costModelsStatus,
    priceLists: test ? test.sort((a, b) => a.priority - b.priority) : paginatedPriceLists,
    priceListsTotal: filteredPriceLists?.length ?? 0,
  };
};

export { PriceList };
