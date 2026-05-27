import { Card, CardBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { CostModels } from 'api/costModels';
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
import { useCostModelNotifications } from 'routes/settings/costModels/utils';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

import { NoCostModelState } from './components/state';
import { styles } from './costModel.styles';
import { CostModelTable } from './costModelTable';
import { CostModelToolbar } from './costModelToolbar';

interface CostModelOwnProps {
  canWrite?: boolean;
}

export interface CostModelMapProps {
  query?: Query;
}

export interface CostModelStateProps {
  costModels?: CostModels;
  costModelsFetchError?: AxiosError;
  costModelsFetchStatus?: FetchStatus;
}

type CostModelProps = CostModelOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    name: 'asc',
  },
};

const CostModel: React.FC<CostModelProps> = ({ canWrite }) => {
  const intl = useIntl();

  const [query, setQuery] = useState({ ...baseQuery });

  const { costModels, costModelsFetchError, costModelsFetchStatus } = useMapToProps({ query });

  const hasFilters = query?.filter_by?.name?.length > 0 || query?.filter_by?.metrics?.length > 0;
  const hasNoCostModels = costModels?.data?.length === 0 && !hasFilters;

  // Force update
  const forceUpdate = useCallback(() => {
    setQuery(prev => ({ ...prev }));
  }, []);

  const getPagination = (isBottom = false) => {
    const count = costModels?.meta?.count ?? 0;
    const limit = costModels?.meta?.limit ?? baseQuery.limit;
    const offset = costModels?.meta?.offset ?? baseQuery.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={hasNoCostModels}
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
      <CostModelTable
        canWrite={canWrite}
        costModels={costModels}
        filterBy={query.filter_by}
        isDisabled={hasNoCostModels}
        isLoading={costModelsFetchStatus === FetchStatus.inProgress}
        onDelete={handleOnDelete}
        orderBy={query.order_by}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
      />
    );
  };

  const getToolbar = () => {
    return (
      <CostModelToolbar
        canWrite={canWrite}
        isDisabled={hasNoCostModels}
        itemsPerPage={costModels?.meta?.limit ?? baseQuery.limit}
        itemsTotal={costModels?.meta?.count ?? 0}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        pagination={getPagination()}
        query={query}
      />
    );
  };

  const handleOnDelete = () => {
    handleOnSetPage(1);
    forceUpdate();
  };

  const handleOnFilterAdded = filter => {
    const newQuery = queryUtils.handleOnFilterAdded(query, filter, filter.type !== 'source_type');
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
    const newQuery = queryUtils.handleOnSetPage(query, costModels, pageNumber, true);
    setQuery(newQuery);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  if (costModelsFetchError) {
    return <NotAvailable />;
  }
  return (
    <>
      {!hasNoCostModels || costModelsFetchStatus === FetchStatus.inProgress ? (
        <Card>
          <CardBody>
            {intl.formatMessage(messages.costModelsDesc, {
              learnMore: (
                <a href={intl.formatMessage(messages.docsUsingCostModels)} rel="noreferrer" target="_blank">
                  {intl.formatMessage(messages.learnMore)}
                </a>
              ),
            })}
            <div style={styles.tableContainer}>
              {getToolbar()}
              {costModelsFetchStatus === FetchStatus.inProgress ? (
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
        <Card>
          <CardBody>
            <NoCostModelState canWrite={canWrite} />
          </CardBody>
        </Card>
      )}
    </>
  );
};

const useMapToProps = ({ query }: CostModelMapProps): CostModelStateProps => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

  const filterBy = Object.fromEntries(
    Object.entries(query?.filter_by ?? baseQuery.filter_by).map(([key, val]) => [key, (val as string[]).join(',')])
  );

  const orderBy = query?.order_by ?? baseQuery.order_by;
  const sortName = Object.keys(orderBy)[0];
  const ordering = orderBy[sortName] === 'desc' ? `-${sortName}` : sortName;

  const costModelsQuery = {
    ...filterBy,
    ...(ordering && { ordering }),
    limit: query?.limit,
    offset: query?.offset,
  } as Query;

  const costModelsQueryString = getQuery(costModelsQuery);

  const costModels = useSelector((state: RootState) => costModelsSelectors.costModels(state));
  const costModelsFetchError = useSelector((state: RootState) => costModelsSelectors.selectCostModelsFetchError(state));
  const costModelsFetchStatus = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsFetchStatus(state)
  );

  useEffect(() => {
    if (!costModelsFetchError && costModelsFetchStatus !== FetchStatus.inProgress) {
      dispatch(costModelsActions.fetchCostModels(costModelsQueryString));
    }
  }, [costModelsFetchError, costModelsQueryString, dispatch, query]);

  // Notifications
  useCostModelNotifications();

  return {
    costModels,
    costModelsFetchError,
    costModelsFetchStatus,
  };
};

export { CostModel };
