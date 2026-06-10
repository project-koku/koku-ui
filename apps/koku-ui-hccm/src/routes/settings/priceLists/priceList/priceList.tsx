import { Card, CardBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { PriceList } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { NoPriceListState } from 'routes/settings/priceLists/priceList/components/state';
import { usePriceListNotifications } from 'routes/settings/priceLists/utils';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceLists';

import { styles } from './priceList.styles';
import { PriceListTable } from './priceListTable';
import { PriceListToolbar } from './priceListToolbar';

interface PriceListOwnProps {
  canWrite?: boolean;
}

export interface PriceListMapProps {
  isShowDeprecated?: boolean;
  query?: Query;
}

export interface PriceListStateProps {
  priceList?: PriceList;
  priceListError?: AxiosError;
  priceListFetchStatus?: FetchStatus;
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

const PriceList: React.FC<PriceListProps> = ({ canWrite }) => {
  const intl = useIntl();

  const [isShowDeprecated, setIsShowDeprecated] = useState<boolean>(false);
  const [query, setQuery] = useState({ ...baseQuery });

  const { priceList, priceListError, priceListFetchStatus } = useMapToProps({ isShowDeprecated, query });

  const hasFilters = query?.filter_by?.name?.length > 0 || query?.filter_by?.currency?.length > 0;
  const hasNoPriceLists = (!priceList || priceList?.data?.length === 0) && !hasFilters;

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
      <PriceListTable
        canWrite={canWrite}
        filterBy={query.filter_by}
        isDisabled={priceList?.data?.length === 0}
        isLoading={priceListFetchStatus === FetchStatus.inProgress}
        onDelete={handleOnDelete}
        onDeprecate={forceUpdate}
        onDuplicate={forceUpdate}
        orderBy={query.order_by}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        priceList={priceList}
      />
    );
  };

  const getToolbar = () => {
    return (
      <PriceListToolbar
        canWrite={canWrite}
        isDisabled={hasNoPriceLists}
        isShowDeprecated={isShowDeprecated}
        itemsPerPage={priceList?.meta?.limit ?? baseQuery.limit}
        itemsTotal={priceList?.meta?.count ?? 0}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        onShowDeprecated={handleOnShowDeprecated}
        pagination={getPagination()}
        query={query}
      />
    );
  };

  // Handlers

  const handleOnDelete = () => {
    handleOnSetPage(1);
    forceUpdate();
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

  const handleOnSetPage = pageNumber => {
    const newQuery = queryUtils.handleOnSetPage(query, priceList, pageNumber, true);
    setQuery(newQuery);
  };

  const handleOnShowDeprecated = (checked: boolean) => {
    setIsShowDeprecated(checked);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  if (priceListError) {
    return <NotAvailable />;
  }

  return (
    <>
      {!hasNoPriceLists || priceListFetchStatus === FetchStatus.inProgress ? (
        <Card>
          <CardBody>
            {intl.formatMessage(messages.priceListDesc, {
              learnMore: (
                <a href={intl.formatMessage(messages.docsPriceList)} rel="noreferrer" target="_blank">
                  {intl.formatMessage(messages.learnMore)}
                </a>
              ),
            })}
            <div style={styles.tableContainer}>
              {getToolbar()}
              {priceListFetchStatus === FetchStatus.inProgress ? (
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
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>
            <NoPriceListState canWrite={canWrite} />
          </CardBody>
        </Card>
      )}
    </>
  );
};

const useMapToProps = ({ isShowDeprecated, query }: PriceListMapProps): PriceListStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const priceListQuery = {
    filter: {
      ...(!isShowDeprecated && { enabled: true }),
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

export { PriceList };
