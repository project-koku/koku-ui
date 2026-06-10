import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { PriceList, PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { NoPriceListAssignedState } from 'routes/settings/priceLists/priceList/components/state';
import { usePriceListNotifications } from 'routes/settings/priceLists/utils';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceLists';

import { TimelineChart } from './charts';
import { styles } from './priceListContent.styles';
import { PriceListContentTable } from './priceListContentTable';
import { PriceListContentToolbar } from './priceListContentToolbar';

interface PriceListDataExt extends PriceListData {
  priority?: number;
}

interface PriceListContentOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  currency?: string;
  isWizard?: boolean;
  onAdd?: (priceLists: PriceListData[]) => void;
  onDisabled?: (value: boolean) => void;
  priceLists?: PriceListData[];
}

export interface PriceListContentMapProps {
  currency?: string;
  query?: Query;
}

export interface PriceListContentStateProps {
  priceList?: PriceList;
  priceListError?: AxiosError;
  priceListFetchStatus?: FetchStatus;
}

export interface PriceListContentHandle {
  /** Persists the current selection to the parent via onAdd. Returns the number of selected rows. */
  save: () => number;
}

type PriceListContentProps = PriceListContentOwnProps;

const baseQuery: Query = {
  limit: 5,
  offset: 0,
  filter_by: {},
  order_by: {
    name: 'asc',
  },
};

const PriceListContent = forwardRef<PriceListContentHandle, PriceListContentProps>(
  ({ canWrite, costModel, currency = costModel?.currency ?? 'USD', isWizard, onAdd, onDisabled, priceLists }, ref) => {
    const intl = useIntl();

    /** Latest save handler for imperative `submit()` — updated in layout effect (not during render). */
    const currentHandlerRef = useRef<() => void>(() => {});

    const [query, setQuery] = useState({ ...baseQuery });
    const [selectedItems, setSelectedItems] = useState<PriceListDataExt[]>(priceLists ?? []);
    const [selectedItemsBaseline, setSelectedItemsBaseline] = useState<PriceListData[]>(priceLists ?? []);

    const selectedItemsRef = useRef<PriceListDataExt[]>(selectedItems);

    useLayoutEffect(() => {
      selectedItemsRef.current = selectedItems;
    }, [selectedItems]);

    useEffect(() => {
      setSelectedItems(priceLists ?? []);
      setSelectedItemsBaseline(priceLists ?? []);
    }, [priceLists]);

    const { priceList, priceListError, priceListFetchStatus } = useMapToProps({ currency, query });

    const isSelectedItemsDirty =
      selectedItems.length !== selectedItemsBaseline.length ||
      selectedItems.some((item, index) => item.uuid !== selectedItemsBaseline[index].uuid);
    const hasNoPriceLists = priceList?.data?.length === 0;
    const hasUnsavedChanges = isSelectedItemsDirty;
    const isLoading = priceListFetchStatus === FetchStatus.inProgress;
    const isSaveDisabled = !hasUnsavedChanges || hasNoPriceLists;

    // Force update
    const forceUpdate = useCallback(() => {
      setQuery(prev => ({ ...prev }));
    }, []);

    const getPagination = (isBottom = false) => {
      const count = priceList?.meta?.count ?? 0;
      const limit = priceList?.meta?.limit ?? baseQuery.limit;
      const offset = priceList?.meta?.offset ?? baseQuery.offset;
      const page = Math.trunc(offset / limit + 1);

      return (
        <Pagination
          isCompact={!isBottom}
          isDisabled={hasNoPriceLists}
          itemCount={count}
          onPerPageSelect={(_event, perPage) => handleOnPerPageSelect(perPage)}
          onSetPage={(_event, pageNumber) => handleOnSetPage(pageNumber)}
          page={page}
          perPage={limit}
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
        <PriceListContentTable
          canWrite={canWrite}
          filterBy={query.filter_by}
          isDisabled={priceList?.data?.length === 0}
          isLoading={isLoading}
          onDelete={handleOnDelete}
          onDeprecate={forceUpdate}
          onDuplicate={forceUpdate}
          orderBy={query.order_by}
          onRemove={handleOnRemove}
          onSelect={handleOnSelect}
          onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
          priceList={priceList}
          selectedItems={selectedItems}
        />
      );
    };

    const getToolbar = () => {
      return (
        <PriceListContentToolbar
          canWrite={canWrite}
          isDisabled={hasNoPriceLists}
          itemsPerPage={priceList?.meta?.limit ?? baseQuery.limit}
          itemsTotal={priceList?.meta?.count ?? 0}
          onBulkSelect={handleOnBulkSelect}
          onFilterAdded={filter => handleOnFilterAdded(filter)}
          onFilterRemoved={filter => handleOnFilterRemoved(filter)}
          onRefresh={forceUpdate}
          pagination={getPagination()}
          query={query}
          selectedItems={selectedItems}
        />
      );
    };

    // Handlers

    const handleOnAdd = () => {
      onAdd?.(selectedItems ?? []);
    };

    const handleOnBulkSelect = (action: string) => {
      if (action === 'none') {
        setSelectedItems([]);
      } else if (action === 'page') {
        const newSelectedItems = [...selectedItems];
        priceList?.data?.map(val => {
          if (!newSelectedItems.some(item => item.uuid === val.uuid)) {
            newSelectedItems.push(val);
          }
        });
        setSelectedItems(newSelectedItems);
      }
    };

    const handleOnDelete = () => {
      handleOnSetPage(1);
      forceUpdate();
    };

    const handleOnRemove = (item: PriceListData) => {
      const newSelectedItems = selectedItems.filter(selectedItem => selectedItem.uuid !== item.uuid);
      setSelectedItems(newSelectedItems);
    };

    const handleOnFilterAdded = filter => {
      const newQuery = queryUtils.handleOnFilterAdded(query, filter);
      setQuery(newQuery);
    };

    const handleOnFilterRemoved = filter => {
      const newQuery = queryUtils.handleOnFilterRemoved(query, filter);
      setQuery(newQuery);
    };

    const handleOnPerPageSelect = perPage => {
      const newQuery = queryUtils.handleOnPerPageSelect(query, perPage, true);
      setQuery(newQuery);
    };

    const handleOnResetClick = () => {
      setSelectedItems(selectedItemsBaseline);
    };

    const handleOnSelect = (items: PriceListData[], isSelected: boolean = false) => {
      let newItems = [...selectedItems];
      if (items && items.length > 0) {
        if (isSelected) {
          items.map(item => newItems.push({ ...item, priority: newItems.length + 1 }));
        } else {
          items.map(item => {
            newItems = newItems.filter(val => val.uuid !== item.uuid);
          });

          // Reprioritize items
          newItems = newItems.map((item, index) => ({ ...item, priority: index + 1 }));
        }
      }
      setSelectedItems(newItems);
    };

    const handleOnSetPage = pageNumber => {
      const newQuery = queryUtils.handleOnSetPage(query, priceList, pageNumber, true);
      setQuery(newQuery);
    };

    const handleOnSort = (sortType, isSortAscending) => {
      const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
      setQuery(newQuery);
    };

    // Effects

    useEffect(() => {
      onDisabled?.(isSaveDisabled);
    }, [isSaveDisabled]);

    useEffect(() => {
      if (costModel) {
        const newSelectedItems = [...(costModel?.price_lists ?? [])];
        setSelectedItems(newSelectedItems);
        setSelectedItemsBaseline(newSelectedItems);
      }
    }, [costModel]);

    useImperativeHandle(
      ref,
      (): PriceListContentHandle => ({
        save: (): number => {
          const count = selectedItemsRef.current.length;
          currentHandlerRef.current();
          return count;
        },
      }),
      []
    );

    useLayoutEffect(() => {
      currentHandlerRef.current = handleOnAdd;
    });

    if (priceListError) {
      return <NotAvailable />;
    }

    return (
      <>
        {!hasNoPriceLists || isLoading ? (
          <>
            <TimelineChart
              isReset
              onResetClick={handleOnResetClick}
              priceLists={[...selectedItems].sort((a, b) => b.priority - a.priority)}
            />
            <div style={styles.tableContainer}>
              {getToolbar()}
              {intl.formatMessage(isWizard ? messages.assignPriceListsWizardDesc : messages.assignPriceListsDesc)}
              {isLoading ? (
                <LoadingState
                  body={intl.formatMessage(messages.priceListLoadingStateDesc)}
                  heading={intl.formatMessage(messages.priceListLoadingStateTitle)}
                />
              ) : (
                <>
                  {getTable()}
                  <div style={styles.paginationContainer}>{getPagination(true)}</div>
                </>
              )}
            </div>
          </>
        ) : (
          <NoPriceListAssignedState canWrite={canWrite} isWizard={isWizard} />
        )}
      </>
    );
  }
);

const useMapToProps = ({ currency = 'USD', query }: PriceListContentMapProps): PriceListContentStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const priceListQuery = {
    filter: {
      currency,
      enabled: true, // Don't show deprecated price lists
    },
    filter_by: query.filter_by,
    limit: query.limit,
    offset: query.offset,
    order_by: query.order_by,
  };
  const priceListQueryString = getQuery(priceListQuery);
  const priceList = useSelector((state: RootState) =>
    priceListSelectors.selectPriceList(state, PriceListType.priceList, priceListQueryString)
  );
  const priceListError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceList, priceListQueryString)
  );
  const priceListFetchStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceList, priceListQueryString)
  );

  useEffect(() => {
    if (!priceListError && priceListFetchStatus !== FetchStatus.inProgress) {
      dispatch(priceListActions.fetchPriceList(PriceListType.priceList, undefined, priceListQueryString));
    }
  }, [dispatch, priceListError, priceListQueryString, query]);

  // Notifications
  usePriceListNotifications();

  return {
    priceList,
    priceListError,
    priceListFetchStatus,
  };
};

export { PriceListContent };
