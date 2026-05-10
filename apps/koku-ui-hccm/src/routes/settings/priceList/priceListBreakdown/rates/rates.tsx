import {
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { AddRate } from 'routes/settings/priceList/priceListBreakdown/rates/components/add';
import { usePriceListUpdate } from 'routes/settings/priceList/utils/hooks';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceList';

import { styles } from './rates.styles';
import { RatesTable } from './ratesTable';
import { RatesToolbar } from './ratesToolbar';

interface RatesOwnProps {
  canWrite?: boolean;
  onSuccess?: () => void;
}

export interface RatesMapProps {
  query?: Query;
}

export interface RatesStateProps {
  priceList?: PriceListData;
  priceListError?: AxiosError;
  priceListQueryString?: string;
  priceListStatus?: FetchStatus;
}

type RatesProps = RatesOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    name: 'asc',
  },
};

const Rates: React.FC<RatesProps> = ({ canWrite, onSuccess }) => {
  const intl = useIntl();

  const [query, setQuery] = useState({ ...baseQuery });

  const { priceList, priceListError, priceListStatus } = useMapToProps({ query });

  // Force update
  const forceUpdate = () => {
    setQuery({ ...query });
  };

  const getCategories = () => {
    if (priceList) {
      return priceList.rates as any;
    }
    return [];
  };

  const getPagination = (isDisabled = false, isBottom = false) => {
    // TODO: update once we have a paginated API
    const count = 1; // priceList?.meta ? priceList.meta.count : 0;
    const limit = 10; // priceList?.meta ? priceList.meta.limit : baseQuery.limit;
    const offset = 0; // priceList?.meta ? priceList.meta.offset : baseQuery.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
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
      <RatesTable
        canWrite={canWrite}
        filterBy={query.filter_by}
        isDisabled={categories.length === 0}
        isLoading={priceListStatus === FetchStatus.inProgress}
        orderBy={query.order_by}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        onSuccess={handleOnSuccess}
        priceList={priceList}
      />
    );
  };

  const getToolbar = (categories: PriceListData[]) => {
    const itemsTotal = 0; // priceList?.meta ? priceList.meta.count : 0;

    return (
      <RatesToolbar
        canWrite={canWrite}
        isDisabled={categories.length === 0}
        itemsPerPage={categories.length}
        itemsTotal={itemsTotal}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        onSuccess={handleOnSuccess}
        pagination={getPagination(categories.length === 0)}
        priceList={priceList}
        query={query}
      />
    );
  };

  // Handlers

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

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  const handleOnSuccess = () => {
    forceUpdate();
    onSuccess?.();
  };

  const categories = getCategories();
  const isDisabled = categories?.length === 0;

  if (priceListError) {
    return <NotAvailable />;
  }

  return (
    <>
      {priceList?.rates?.length > 0 || priceListStatus === FetchStatus.inProgress ? (
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
              {getToolbar(categories)}
              {priceListStatus === FetchStatus.inProgress ? (
                <LoadingState />
              ) : (
                <>
                  {getTable()}
                  <div style={styles.paginationContainer}>{getPagination(isDisabled, true)}</div>
                </>
              )}
            </div>
          </CardBody>
        </Card>
      ) : (
        <EmptyState titleText={intl.formatMessage(messages.priceListEmptyRates)}>
          <EmptyStateBody>
            {intl.formatMessage(messages.priceListEmptyRatesDesc, { currency: priceList?.currency ?? 'USD' })}
          </EmptyStateBody>
          <EmptyStateFooter>
            <AddRate canWrite={canWrite} onSuccess={forceUpdate} priceList={priceList} />
          </EmptyStateFooter>
        </EmptyState>
      )}
    </>
  );
};

const useMapToProps = ({ query }: RatesMapProps): RatesStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const { uuid } = useParams();

  const priceListQuery = {
    filter_by: query.filter_by,
    limit: query.limit,
    offset: query.offset,
    order_by: query.order_by,
  };
  const priceListQueryString = getQuery(priceListQuery);
  const priceList = useSelector((state: RootState) =>
    priceListSelectors.selectPriceList(state, PriceListType.priceList, priceListQueryString)
  ) as PriceListData;
  const priceListError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceList, priceListQueryString)
  );
  const priceListStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListStatus(state, PriceListType.priceList, priceListQueryString)
  );

  // Notifications
  const { status: priceListUpdateStatus } = usePriceListUpdate({
    isNotificationEnabled: false,
    priceListType: PriceListType.priceListUpdate,
  });

  useEffect(() => {
    if (
      !priceListError &&
      priceListStatus !== FetchStatus.inProgress &&
      priceListStatus !== FetchStatus.complete &&
      priceListUpdateStatus !== FetchStatus.inProgress &&
      priceListUpdateStatus !== FetchStatus.complete
    ) {
      dispatch(priceListActions.fetchPriceList(PriceListType.priceList, uuid, priceListQueryString));
    }
  }, [query]);

  return {
    priceList,
    priceListError,
    priceListQueryString,
    priceListStatus,
  };
};

export { Rates };
