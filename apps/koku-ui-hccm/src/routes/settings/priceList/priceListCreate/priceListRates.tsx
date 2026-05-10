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
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { RatesTable, RatesToolbar } from 'routes/settings/priceList/priceListBreakdown/rates';
import { AddRate } from 'routes/settings/priceList/priceListBreakdown/rates/components/add';
import * as queryUtils from 'routes/utils/query';

import { styles } from './priceListRates.styles';

interface PriceListRatesOwnProps {
  canWrite?: boolean;
  onAdd?: (rates: Rate[]) => void;
  onDelete?: (rates: Rate[]) => void;
  onEdit?: (rates: Rate[]) => void;
  priceList: PriceListData;
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

  const [query, setQuery] = useState({ ...baseQuery });

  const getCategories = () => {
    if (priceList) {
      return priceList.rates as any;
    }
    return [];
  };

  const getPagination = (isDisabled = false, isBottom = false) => {
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
        isDispatch={false}
        isLoading={false}
        onDelete={onDelete}
        onEdit={onEdit}
        orderBy={query.order_by}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        priceList={priceList}
      />
    );
  };

  const getToolbar = (categories: PriceListData[]) => {
    return (
      <RatesToolbar
        canWrite={canWrite}
        isDisabled={categories.length === 0}
        isDispatch={false}
        itemsPerPage={categories.length}
        itemsTotal={priceList?.rates?.length ?? 0}
        onAdd={onAdd}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
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

  const categories = getCategories();
  const isDisabled = categories?.length === 0;

  return (
    <>
      {priceList?.rates?.length > 0 ? (
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
              {getTable()}
              <div style={styles.paginationContainer}>{getPagination(isDisabled, true)}</div>
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

export { PriceListRates };
