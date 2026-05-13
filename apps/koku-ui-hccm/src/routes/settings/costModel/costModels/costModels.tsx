import { Card, CardBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { CostModels } from 'api/costModels';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { routes } from 'routes';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { formatPath } from 'utils/paths';

import { styles } from './costModels.styles';
import { CostModelsTable } from './costModelsTable';
import { CostModelsToolbar } from './costModelsToolbar';

interface CostModelsOwnProps {
  canWrite?: boolean;
}

export interface CostModelsMapProps {
  query?: Query;
}

export interface CostModelsStateProps {
  costModels?: CostModels;
  costModelsError?: AxiosError;
  costModelsStatus?: FetchStatus;
}

type CostModelsProps = CostModelsOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    updated_timestamp: 'desc',
  },
};

const CostModels: React.FC<CostModelsProps> = ({ canWrite }) => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const [query, setQuery] = useState({ ...baseQuery });

  const { costModels, costModelsError, costModelsStatus } = useMapToProps({ query });

  const isDisabled = costModels?.data?.length === 0;

  // Force update
  const forceUpdate = () => {
    setQuery({ ...query });
  };

  const getPagination = (isBottom = false) => {
    const count = costModels?.meta?.count ?? 0;
    const limit = costModels?.meta?.limit ?? baseQuery.limit;
    const offset = costModels?.meta?.offset ?? baseQuery.offset;
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
      <CostModelsTable
        canWrite={canWrite}
        costModels={costModels}
        filterBy={query.filter_by}
        isDisabled={costModels?.data?.length === 0}
        isLoading={costModelsStatus === FetchStatus.inProgress}
        onDelete={forceUpdate}
        orderBy={query.order_by}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
      />
    );
  };

  const getToolbar = () => {
    return (
      <CostModelsToolbar
        canWrite={canWrite}
        isDisabled={isDisabled}
        itemsPerPage={costModels?.meta?.limit ?? baseQuery.limit}
        itemsTotal={costModels?.meta?.count ?? 0}
        onCreate={handleOnCreate}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        pagination={getPagination()}
        query={query}
      />
    );
  };

  const handleOnCreate = () => {
    navigate(formatPath(routes.costModelCreate.path), {
      replace: true,
      state: {
        ...(location?.state || {}),
      },
    });
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

  if (costModelsError) {
    return <NotAvailable />;
  }
  return (
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
          {costModelsStatus === FetchStatus.inProgress ? (
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
  );
};

const useMapToProps = ({ query }: CostModelsMapProps): CostModelsStateProps => {
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
  const costModelsError = useSelector((state: RootState) => costModelsSelectors.error(state));
  const costModelsStatus = useSelector((state: RootState) => costModelsSelectors.status(state));

  useEffect(() => {
    if (!costModelsError && costModelsStatus !== FetchStatus.inProgress) {
      dispatch(costModelsActions.fetchCostModels(costModelsQueryString));
    }
  }, [query]);

  return {
    costModels,
    costModelsError,
    costModelsStatus,
  };
};

export { CostModels };
