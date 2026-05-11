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
import type { Rate } from 'api/rates';
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
import { usePriceListUpdate } from 'routes/settings/priceList/utils';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceList';

import { styles } from './rates.styles';
import { RatesTable } from './ratesTable';
import { RatesToolbar } from './ratesToolbar';
import { getFilteredRates, getIndexedRates, getPaginatedRates } from './utils';

interface RatesOwnProps {
  canWrite?: boolean;
  onSuccess?: () => void;
}

export interface RatesMapProps {
  pageNumber?: number;
  perPage?: number;
  paginatedPriceList?: PriceListData;
  query?: Query;
}

export interface RatesStateProps {
  priceList: PriceListData; // Price list without filters and pagination for editing
  priceListError?: AxiosError;
  priceListQueryString?: string;
  priceListStatus?: FetchStatus;
  rates: Rate[]; // Filtered and paginated rates
  ratesCount: number; // Total number of filtered (unpaginated) rates
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

  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(baseQuery.limit);
  const [query, setQuery] = useState({ ...baseQuery });

  const { priceList, priceListError, priceListStatus, rates, ratesCount } = useMapToProps({
    pageNumber,
    perPage,
    query,
  });

  const hasFilters = query?.filter_by?.name?.length > 0 || query?.filter_by?.metrics?.length > 0;
  const isDisabled = rates?.length === 0 && !hasFilters;

  // Force update
  const forceUpdate = () => {
    setQuery({ ...query });
  };

  const getPagination = (isBottom = false) => {
    const offset = pageNumber * perPage - perPage;
    const page = Math.trunc(offset / perPage + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
        itemCount={ratesCount}
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
      <RatesTable
        canWrite={canWrite}
        filterBy={query.filter_by}
        isDisabled={isDisabled}
        isLoading={priceListStatus === FetchStatus.inProgress}
        orderBy={query.order_by}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        onSuccess={handleOnSuccess}
        priceList={priceList}
        rates={rates}
      />
    );
  };

  const getToolbar = () => {
    return (
      <RatesToolbar
        canWrite={canWrite}
        isDisabled={isDisabled}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        onSuccess={handleOnSuccess}
        pagination={getPagination()}
        priceList={priceList}
        query={query}
      />
    );
  };

  // Handlers

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

  const handleOnPerPageSelect = value => {
    setPerPage(value);
    setPageNumber(1); // Reset pagination
  };

  const handleOnSetPage = value => {
    setPageNumber(value);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  const handleOnSuccess = () => {
    forceUpdate();
    onSuccess?.();
  };

  if (priceListError) {
    return <NotAvailable />;
  }

  return (
    <>
      {!isDisabled || priceListStatus === FetchStatus.inProgress ? (
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
              {priceListStatus === FetchStatus.inProgress ? (
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

const useMapToProps = ({ pageNumber, perPage, query }: RatesMapProps): RatesStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const { uuid } = useParams();

  // Todo: Update once we have a paginated API
  const priceListQuery = {
    // filter_by: query.filter_by,
    // limit: query.limit,
    // offset: query.offset,
    // order_by: query.order_by,
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

  // Add index,labels, filter, and paginate
  const indexedRates = getIndexedRates(priceList?.rates);
  const filteredRates = getFilteredRates(indexedRates, query?.filter_by);
  const paginatedRates = getPaginatedRates(filteredRates, pageNumber, perPage);

  return {
    priceList,
    priceListError,
    priceListQueryString,
    priceListStatus,
    rates: paginatedRates,
    ratesCount: filteredRates?.length ?? 0,
  };
};

export { Rates };
