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
import type { Query } from 'api/queries/query';
import type { Rate } from 'api/rates';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { RatesTable, RatesToolbar } from 'routes/settings/priceList/priceListBreakdown/rates';
import { AddRate } from 'routes/settings/priceList/priceListBreakdown/rates/components/add';
import {
  getFilteredRates,
  getIndexedRates,
  getLabeledRates,
  getPaginatedRates,
} from 'routes/settings/priceList/priceListBreakdown/rates/utils';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { metricsActions, metricsSelectors } from 'store/metrics';

import { styles } from './priceListRates.styles';

interface PriceListRatesOwnProps {
  canWrite?: boolean;
  onAdd?: (rates: Rate[]) => void;
  onDelete?: (rates: Rate[]) => void;
  onEdit?: (rates: Rate[]) => void;
  priceList: PriceListData; // Price list without filters and pagination for editing
}

export interface PriceListRatesMapProps {
  pageNumber?: number;
  perPage?: number;
  priceList: PriceListData; // Price list without filters and pagination for editing
  query?: Query;
}

interface PriceListRatesStateProps {
  rates: Rate[]; // Filtered and paginated rates
  ratesCount: number; // Total number of filtered (unpaginated) rates
}

type PriceListRatesProps = PriceListRatesOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    name: 'asc',
  },
};

const PriceListRates: React.FC<PriceListRatesProps> = ({ canWrite, onAdd, onDelete, onEdit, priceList }) => {
  const intl = useIntl();

  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(baseQuery.limit);
  const [query, setQuery] = useState({ ...baseQuery });

  const { rates, ratesCount } = useMapToProps({
    pageNumber,
    perPage,
    priceList,
    query,
  });

  const hasFilters = query?.filter_by?.name?.length > 0 || query?.filter_by?.metrics?.length > 0;
  const isDisabled = rates?.length === 0 && !hasFilters;

  const getPagination = (isBottom = false) => {
    // TODO: update once we have a paginated API
    // const count = priceList?.meta ? priceList.meta.count : 0;
    // const limit = priceList?.meta ? priceList.meta.limit : baseQuery.limit;
    // const offset = priceList?.meta ? priceList.meta.offset : baseQuery.offset;
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
        isDispatch={false}
        isLoading={false}
        onDelete={onDelete}
        onEdit={onEdit}
        orderBy={query.order_by}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        rates={rates}
        priceList={priceList}
      />
    );
  };

  const getToolbar = () => {
    return (
      <RatesToolbar
        canWrite={canWrite}
        isDisabled={isDisabled}
        isDispatch={false}
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

  return (
    <>
      {!isDisabled ? (
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
              {getTable()}
              <div style={styles.paginationContainer}>{getPagination(true)}</div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <EmptyState titleText={intl.formatMessage(messages.priceListEmptyRates)}>
          <EmptyStateBody>
            {intl.formatMessage(messages.priceListEmptyRatesDesc, { currency: priceList?.currency ?? 'USD' })}
          </EmptyStateBody>
          <EmptyStateFooter>
            <AddRate isDispatch={false} canWrite={canWrite} onAdd={onAdd} priceList={priceList} />
          </EmptyStateFooter>
        </EmptyState>
      )}
    </>
  );
};

const useMapToProps = ({ pageNumber, perPage, priceList, query }: PriceListRatesMapProps): PriceListRatesStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  // Fetch metrics
  const metricsHashByName = useSelector((state: RootState) => metricsSelectors.metricsByName(state));
  const metricsHashStatus = useSelector((state: RootState) => metricsSelectors.status(state));

  useEffect(() => {
    if (metricsHashStatus !== FetchStatus.inProgress && metricsHashStatus !== FetchStatus.complete) {
      dispatch(metricsActions.fetchMetrics());
    }
  }, [metricsHashStatus]);

  // Add index,labels, filter, and paginate
  const labeledRates = getLabeledRates(priceList?.rates, metricsHashByName);
  const indexedRates = getIndexedRates(labeledRates);
  const filteredRates = getFilteredRates(indexedRates, query?.filter_by);
  const paginatedRates = getPaginatedRates(filteredRates, pageNumber, perPage);

  return {
    rates: paginatedRates,
    ratesCount: filteredRates?.length ?? 0,
  };
};

export { PriceListRates };
