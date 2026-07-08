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
import { AddRate } from 'routes/settings/priceLists/priceListBreakdown/rates/components/add';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceLists';

import { styles } from './rate.styles';
import { RateTable } from './rateTable';
import { RateToolbar } from './rateToolbar';
import { getFilteredRates, getIndexedRates, getPaginatedRates, getSortedRates } from './utils';

interface RateOwnProps {
  canWrite?: boolean;
  onAdd?: (rates: Rate[]) => void;
  onDelete?: (rates: Rate[]) => void;
  onEdit?: (rates: Rate[]) => void;
}

export interface RateMapProps {
  page?: number;
  perPage?: number;
  paginatedPriceList?: PriceListData;
  query?: Query;
}

export interface RateStateProps {
  priceList: PriceListData; // Price list without filters and pagination for editing
  priceListError?: AxiosError;
  priceListFetchStatus?: FetchStatus;
  rates: Rate[]; // Filtered and paginated rates
  ratesCount: number; // Total number of filtered (unpaginated) rates
}

type RateProps = RateOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    name: 'asc',
  },
};

const Rate: React.FC<RateProps> = ({ canWrite, onAdd, onEdit, onDelete }) => {
  const intl = useIntl();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(baseQuery.limit);
  const [query, setQuery] = useState({ ...baseQuery });

  const { priceList, priceListError, priceListFetchStatus, rates, ratesCount } = useMapToProps({
    page,
    perPage,
    query,
  });

  const hasFilters = Object.keys(query?.filter_by ?? {}).some(key => query.filter_by[key]?.length > 0);
  const hasNoRates = rates?.length === 0 && !hasFilters;
  const isLoading = priceListFetchStatus === FetchStatus.inProgress;

  // Getters

  const getPagination = (isBottom = false) => {
    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={hasNoRates}
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
      <RateTable
        canWrite={canWrite}
        filterBy={query.filter_by}
        isDisabled={hasNoRates}
        isLoading={isLoading}
        orderBy={query.order_by}
        onDelete={onDelete}
        onEdit={onEdit}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        priceList={priceList}
        rates={rates}
      />
    );
  };

  const getToolbar = () => {
    return (
      <RateToolbar
        canWrite={canWrite}
        isDisabled={hasNoRates}
        onAdd={onAdd}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
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
    setPage(1); // Reset pagination
  };

  const handleOnFilterRemoved = filter => {
    const newQuery = queryUtils.handleOnFilterRemoved(query, filter);
    setQuery(newQuery);
    setPage(1); // Reset pagination
  };

  const handleOnPerPageSelect = value => {
    setPerPage(value);
    setPage(1); // Reset pagination
  };

  const handleOnSetPage = value => {
    setPage(value);
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

const useMapToProps = ({ page, perPage, query }: RateMapProps): RateStateProps => {
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
  const priceListFetchStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceList, priceListQueryString)
  );

  useEffect(() => {
    if (!priceListError && priceListFetchStatus !== FetchStatus.inProgress && uuid) {
      dispatch(priceListActions.fetchPriceList(PriceListType.priceList, uuid, priceListQueryString));
    }
  }, [dispatch, priceListError, priceListQueryString, uuid]);

  // Add index,labels, filter, and paginate
  const indexedRates = getIndexedRates(priceList?.rates);
  const filteredRates = getFilteredRates(indexedRates, query?.filter_by);
  const sortedRates = getSortedRates(filteredRates, query?.order_by);
  const paginatedRates = getPaginatedRates(sortedRates, page, perPage);

  return {
    priceList,
    priceListError,
    priceListFetchStatus,
    rates: paginatedRates,
    ratesCount: filteredRates?.length ?? 0,
  };
};

export { Rate };
