import { Card, CardBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import type { Query } from 'api/queries/query';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { getSourceType } from 'routes/settings/costModels/costModel/utils';
import type { Filter } from 'routes/utils/filter';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

import { TimelineChart } from './components/charts';
import { baseQuery, type PriceListDataExt } from './orderPriceList';
import { styles } from './orderPriceList.styles';
import { OrderPriceListTable } from './orderPriceListTable';
import { OrderPriceListToolbar } from './orderPriceListToolbar';

interface OrderPriceListContentOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  isDisabled?: boolean;
  isDispatch?: boolean;
  isLoading?: boolean;
  isWizardStep?: boolean;
  onAdd?: (priceLists: PriceListDataExt[]) => void;
  onFilterAdded?: (filter: Filter) => void;
  onFilterRemoved?: (filter: Filter | null) => void;
  onPerPage?: (value: number) => void;
  onPageNumber?: (value: number) => void;
  onRemove?: (priceLists: PriceListDataExt[]) => void;
  onSave?: (priceLists: PriceListDataExt[]) => void;
  pageNumber?: number;
  perPage?: number;
  priceLists?: PriceListDataExt[]; // Price lists without filters and pagination for editing
  priceListsTotal?: number; // Total number of filtered (unpaginated) price lists
  query?: Query;
}

interface OrderPriceListContentStateProps {
  costModelsUpdateError?: AxiosError;
  costModelsUpdateStatus?: FetchStatus;
}

export interface OrderPriceListContentHandle {
  save: () => void;
}

type OrderPriceListContentProps = OrderPriceListContentOwnProps;

const OrderPriceListContent = forwardRef<OrderPriceListContentHandle, OrderPriceListContentProps>(
  (
    {
      canWrite,
      costModel,
      isDispatch = true,
      isDisabled,
      isLoading,
      isWizardStep,
      onAdd,
      onFilterAdded,
      onFilterRemoved,
      onPerPage,
      onPageNumber,
      onRemove,
      onSave,
      pageNumber,
      perPage,
      priceLists,
      priceListsTotal,
      query,
    },
    ref
  ) => {
    const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
    const intl = useIntl();

    /** Latest save handler for imperative `submit()` — updated in layout effect (not during render). */
    const currentHandlerRef = useRef<() => void>(() => {});

    const [isDraggable, setIsDraggable] = useState(isWizardStep ?? false);
    const [isFinish, setIsFinish] = useState(false);
    const [orderedPriceLists, setOrderedPriceLists] = useState<PriceListDataExt[]>(priceLists ?? []);
    const [orderedPriceListsBaseline, setOrderedPriceListsBaseline] = useState<PriceListDataExt[]>(priceLists ?? []);
    const [payload, setPayload] = useState<PriceListDataExt[]>([]);
    const [selectedItems, setSelectedItems] = useState<PriceListDataExt[]>([]);
    const [selectedItemsBaseline] = useState<PriceListDataExt[]>([]);

    const isSelectedItemsDirty =
      selectedItems.length !== selectedItemsBaseline.length ||
      selectedItems.some((item, index) => item.uuid !== selectedItemsBaseline[index].uuid);
    const isOrderedPriceListsDirty = orderedPriceLists.some(
      (item, index) => item.priority !== orderedPriceListsBaseline?.[index]?.priority
    );

    const { costModelsUpdateError, costModelsUpdateStatus } = useMapToProps();

    // Getters

    const getContent = () => {
      return (
        <div style={styles.tableContainer}>
          {isWizardStep ? intl.formatMessage(messages.assignedPriceListsDesc) : getToolbar()}
          {isLoading ? (
            <LoadingState
              body={intl.formatMessage(messages.priceListLoadingStateDesc)}
              heading={intl.formatMessage(messages.priceListLoadingStateTitle)}
            />
          ) : (
            <>
              {getTable()}
              {!isDraggable && <div style={styles.paginationContainer}>{getPagination(true)}</div>}
            </>
          )}
        </div>
      );
    };

    const getPagination = (isBottom = false) => {
      const offset = pageNumber * perPage - perPage;
      const page = Math.trunc(offset / perPage + 1);

      return (
        <Pagination
          isCompact={!isBottom}
          isDisabled={isDisabled}
          itemCount={priceListsTotal}
          onPerPageSelect={(_event, value) => onPerPage?.(value)}
          onSetPage={(_event, value) => onPageNumber?.(value)}
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
        <OrderPriceListTable
          canWrite={canWrite}
          costModel={costModel}
          filterBy={query?.filter_by}
          isDisabled={isDisabled}
          isDraggable={isDraggable}
          isLoading={isLoading}
          isSelectable={!isWizardStep}
          orderBy={query?.order_by}
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
        <OrderPriceListToolbar
          canWrite={canWrite}
          costModel={costModel}
          isDisabled={isDisabled}
          isDraggable={isDraggable}
          isOrderDisabled={orderedPriceLists?.length < 2}
          isRemoveDisabled={!isSelectedItemsDirty || selectedItems.length === 0}
          isSaveDisabled={!isOrderedPriceListsDirty}
          onAdd={handleOnAdd}
          onBulkSelect={handleOnBulkSelect}
          onFilterAdded={filter => onFilterAdded(filter)}
          onFilterRemoved={filter => onFilterRemoved(filter)}
          onOrderClick={handleOnOrderClick}
          onRemove={handleOnRemove}
          onSaveClick={handleOnSave}
          pagination={!isDraggable ? getPagination() : undefined}
          query={query}
          selectedItems={selectedItems}
        />
      );
    };

    // Handlers

    const handleOnAdd = (items: PriceListDataExt[]) => {
      onPageNumber?.(1);
      onAdd?.(items);
    };

    const handleOnBulkSelect = (action: string) => {
      if (action === 'none') {
        setSelectedItems([]);
      } else if (action === 'page') {
        const newSelectedItems = [...selectedItems];
        orderedPriceLists?.map(val => {
          if (!newSelectedItems.some(item => item.uuid === val.uuid)) {
            newSelectedItems.push(val);
          }
        });
        setSelectedItems(newSelectedItems);
      }
    };

    const handleOnDrop = (uuids: string[]) => {
      const newPriceLists = [];
      uuids.forEach(uuid => {
        const item = orderedPriceLists.find(val => val.uuid === uuid);
        if (item) {
          newPriceLists.push(item);
        }
      });
      setOrderedPriceLists(newPriceLists);
    };

    const handleOnOrderClick = () => {
      setIsDraggable(!isDraggable);
      if (isDraggable) {
        setOrderedPriceLists(orderedPriceListsBaseline);
        onPerPage?.(baseQuery?.limit);
      } else {
        onFilterRemoved?.(null); // Clear filters
        onPerPage?.(1000); // Set to max per page
      }
    };

    const handleOnRemove = (items: PriceListDataExt[]) => {
      setSelectedItems([]);
      onPageNumber?.(1);

      const removeUuids = new Set(items.map(item => item.uuid));
      setOrderedPriceLists(prev => prev.filter(item => !removeUuids.has(item.uuid)));
      setOrderedPriceListsBaseline(prev => prev.filter(item => !removeUuids.has(item.uuid)));

      onRemove?.(items);
    };

    const handleOnSave = () => {
      setOrderedPriceListsBaseline([...orderedPriceLists]);

      if (costModelsUpdateStatus !== FetchStatus.inProgress) {
        const itemsWithPriority = orderedPriceLists.map((item, index) => ({
          uuid: item.uuid,
          name: item.name,
          priority: index + 1,
        }));
        setPayload(itemsWithPriority);

        if (costModel?.uuid && isDispatch) {
          setIsFinish(true);
          setIsDraggable(false);

          const uuids = itemsWithPriority.map(item => item.uuid) ?? [];

          dispatch(
            costModelsActions.updateCostModel(costModel?.uuid, {
              ...(costModel ?? {}),
              price_lists: undefined,
              price_list_uuids: uuids,
              source_type: getSourceType(costModel?.source_type),
            })
          );
        } else {
          onSave?.(itemsWithPriority);
        }
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

    // Effects

    useImperativeHandle(
      ref,
      () => ({
        save: () => {
          currentHandlerRef.current();
        },
      }),
      []
    );

    useLayoutEffect(() => {
      currentHandlerRef.current = handleOnSave;
    });

    useEffect(() => {
      setOrderedPriceLists(priceLists ?? []);
      setOrderedPriceListsBaseline(priceLists ?? []);
    }, [priceLists]);

    useEffect(() => {
      if (isFinish && costModelsUpdateStatus === FetchStatus.complete) {
        setIsFinish(false);

        if (!costModelsUpdateError) {
          onSave?.(payload);
        }
      }
    }, [isFinish, costModel, costModelsUpdateError, costModelsUpdateStatus, onSave, payload]);

    if (costModelsUpdateError) {
      return <NotAvailable />;
    }

    return (
      <>
        <TimelineChart priceLists={[...(orderedPriceLists ?? [])].reverse()} />
        {isWizardStep ? (
          getContent()
        ) : (
          <Card>
            <CardBody>{getContent()}</CardBody>
          </Card>
        )}
      </>
    );
  }
);

const useMapToProps = (): OrderPriceListContentStateProps => {
  const costModelsUpdateError = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsUpdateError(state)
  );
  const costModelsUpdateStatus = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsUpdateStatus(state)
  );

  return {
    costModelsUpdateError,
    costModelsUpdateStatus,
  };
};

export { OrderPriceListContent };
