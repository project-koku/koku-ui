import {
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';
import type { PriceList, PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { Rate } from 'api/rates';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { AddRate } from 'routes/settings/priceLists/priceListBreakdown/rates/components/add';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceLists';

import { styles } from './rate.styles';
import { RateTable } from './rateTable';
import { RateToolbar } from './rateToolbar';

interface RateApiOwnProps {
  canWrite?: boolean;
  onAdd?: (rates: Rate[]) => void;
  onDelete?: (rates: Rate[]) => void;
  onEdit?: (rates: Rate[]) => void;
  priceList: PriceListData;
}

export interface RateApiMapProps {
  query?: Query;
}

export interface RateApiStateProps {
  priceListRates: PriceList;
  priceListRatesError?: AxiosError;
  priceListRatesFetchStatus?: FetchStatus;
}

type RateApiProps = RateApiOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    name: 'asc',
  },
};

const RateApi: React.FC<RateApiProps> = ({ canWrite, onAdd, onEdit, onDelete, priceList }) => {
  const intl = useIntl();

  const [query, setQuery] = useState({ ...baseQuery });

  const { priceListRates, priceListRatesError, priceListRatesFetchStatus } = useMapToProps({
    query,
  });

  const hasFilters = Object.keys(query?.filter_by ?? {}).some(key => query.filter_by[key]?.length > 0);
  const hasNoRates = priceListRates?.data?.length === 0 && !hasFilters;
  const isLoading = priceListRatesFetchStatus === FetchStatus.inProgress;

  // Force update
  const forceUpdate = useCallback(() => {
    setQuery(prev => ({ ...prev }));
  }, []);

  // Getters

  const getPagination = (isBottom = false) => {
    const count = priceListRates?.meta ? priceListRates.meta.count : 0;
    const limit = priceListRates?.meta?.limit ? priceListRates.meta.limit : baseQuery.limit;
    const offset = priceListRates?.meta?.offset ? priceListRates.meta.offset : baseQuery.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={hasNoRates}
        itemCount={count}
        onPerPageSelect={(_event, value) => handleOnPerPageSelect(value)}
        onSetPage={(_event, value) => handleOnSetPage(value)}
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
      <RateTable
        canWrite={canWrite}
        filterBy={query.filter_by}
        isDisabled={hasNoRates}
        isLoading={isLoading}
        orderBy={query.order_by}
        onDelete={handleOnDelete}
        onEdit={handleOnEdit}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        priceList={priceList}
        rates={priceListRates?.data}
      />
    );
  };

  const getToolbar = () => {
    return (
      <RateToolbar
        canWrite={canWrite}
        isDisabled={hasNoRates}
        onAdd={handleOnAdd}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        pagination={getPagination()}
        priceList={priceList}
        query={query}
      />
    );
  };

  // Handlers

  const handleOnAdd = (rates: Rate[]) => {
    forceUpdate();
    onAdd?.(rates);
  };

  const handleOnEdit = (rates: Rate[]) => {
    forceUpdate();
    onEdit?.(rates);
  };

  const handleOnDelete = (rates: Rate[]) => {
    forceUpdate();
    onDelete?.(rates);
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

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  if (priceListRatesError) {
    return <NotAvailable />;
  }
  return (
    <>
      {!hasNoRates || isLoading ? (
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
              {isLoading ? (
                <LoadingState
                  body={intl.formatMessage(messages.priceListRatesLoadingStateDesc)}
                  heading={intl.formatMessage(messages.priceListRatesLoadingStateTitle)}
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
        <EmptyState titleText={intl.formatMessage(messages.priceListEmptyRates)}>
          <EmptyStateBody>
            {intl.formatMessage(messages.priceListEmptyRatesDesc, { currency: priceList?.currency ?? 'USD' })}
          </EmptyStateBody>
          <EmptyStateFooter>
            <AddRate canWrite={canWrite} onAdd={onAdd} priceList={priceList} />
          </EmptyStateFooter>
        </EmptyState>
      )}
    </>
  );
};

const useMapToProps = ({ query }: RateApiMapProps): RateApiStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const { uuid } = useParams();

  // Todo: Update once we have a paginated API
  const priceListRatesQuery = {
    filter_by: query.filter_by,
    limit: query.limit,
    offset: query.offset,
    order_by: query.order_by,
  };
  const priceListRatesQueryString = getQuery(priceListRatesQuery);
  const priceListRates = useSelector((state: RootState) =>
    priceListSelectors.selectPriceList(state, PriceListType.priceListRates, priceListRatesQueryString)
  ) as PriceList;
  const priceListRatesError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceListRates, priceListRatesQueryString)
  );
  const priceListRatesFetchStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceListRates, priceListRatesQueryString)
  );

  useEffect(() => {
    if (!priceListRatesError && priceListRatesFetchStatus !== FetchStatus.inProgress && uuid) {
      dispatch(priceListActions.fetchPriceList(PriceListType.priceListRates, uuid, priceListRatesQueryString));
    }
  }, [dispatch, priceListRatesError, priceListRatesQueryString, query, uuid]);

  return {
    priceListRates,
    priceListRatesError,
    priceListRatesFetchStatus,
  };
};

export { RateApi };
