import { PageSection, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
import type { RosQuery } from 'api/queries/rosQuery';
import type { RosReport } from 'api/ros/ros';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { routes } from 'routes';
import { OptimizationsTable, OptimizationsToolbar } from 'routes/components/optimizations';
import { Loading } from 'routes/components/page/loading';
import { NoOptimizations } from 'routes/components/page/noOptimizations';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import { getOrderById, getOrderByValue } from 'routes/utils/orderBy';
import * as queryUtils from 'routes/utils/query';
import { clearQueryState, getQueryState } from 'routes/utils/queryState';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import { formatPath } from 'utils/paths';

import { styles } from './optimizationsDetails.styles';
import { OptimizationsDetailsHeader } from './optimizationsDetailsHeader';

interface OptimizationsDetailsOwnProps {
  // TBD...
}

export interface OptimizationsDetailsStateProps {
  groupBy?: string;
  report: RosReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

export interface OptimizationsDetailsMapProps {
  query?: RosQuery;
}

type OptimizationsDetailsProps = OptimizationsDetailsOwnProps;

const baseQuery: RosQuery = {
  limit: 10,
  offset: 0,
  order_by: {
    last_reported: 'desc',
  },
};

const reportType = RosType.ros as any;
const reportPathsType = RosPathsType.recommendations as any;

const OptimizationsDetails: React.FC<OptimizationsDetailsProps> = () => {
  const intl = useIntl();
  const location = useLocation();

  const queryState = getQueryState(location, 'optimizations');
  const [query, setQuery] = useState({ ...baseQuery, ...(queryState && queryState) });
  const { groupBy, report, reportError, reportFetchStatus, reportQueryString } = useMapToProps({
    query,
  });

  // Clear queryState, returned from breakdown page, after query has been initialized
  useEffect(() => {
    clearQueryState(location, 'optimizations');
  }, [reportQueryString]);

  const getPagination = (isDisabled = false, isBottom = false) => {
    const count = report?.meta ? report.meta.count : 0;
    const limit = report?.meta ? report.meta.limit : baseQuery.limit;
    const offset = report?.meta ? report.meta.offset : baseQuery.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
        itemCount={count}
        onPerPageSelect={(event, perPage) => handleOnPerPageSelect(perPage)}
        onSetPage={(event, pageNumber) => handleOnSetPage(pageNumber)}
        page={page}
        perPage={limit}
        titles={{
          paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.openShift),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`exports-pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  const getTable = () => {
    return (
      <OptimizationsTable
        basePath={formatPath(routes.optimizationsBreakdown.path)}
        breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizations)}
        breadcrumbPath={formatPath(`${routes.optimizationsDetails.path}${location.search}`)}
        filterBy={query.filter_by}
        groupBy={groupBy}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        orderBy={query.order_by}
        query={query}
        report={report}
        reportQueryString={reportQueryString}
      />
    );
  };

  const getToolbar = () => {
    const itemsPerPage = report?.meta ? report.meta.limit : 0;
    const itemsTotal = report?.meta ? report.meta.count : 0;
    const isDisabled = itemsTotal === 0;

    return (
      <OptimizationsToolbar
        isDisabled={isDisabled}
        isProject
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        pagination={getPagination(isDisabled)}
        query={query}
      />
    );
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
    const newQuery = queryUtils.handleOnSetPage(query, report, pageNumber, true);
    setQuery(newQuery);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  const itemsTotal = report?.meta ? report.meta.count : 0;
  const isDisabled = itemsTotal === 0;
  const title = intl.formatMessage(messages.optimizations);
  const hasOptimizations = report?.meta && report.meta.count > 0;

  if (reportError) {
    return <NotAvailable title={title} />;
  }
  if (!query.filter_by && !hasOptimizations && reportFetchStatus === FetchStatus.complete) {
    return <NoOptimizations />;
  }
  return (
    <div style={styles.container}>
      <OptimizationsDetailsHeader />
      <PageSection isFilled>
        {getToolbar()}
        {reportFetchStatus === FetchStatus.inProgress ? (
          <Loading
            body={intl.formatMessage(messages.optimizationsLoadingStateDesc)}
            heading={intl.formatMessage(messages.optimizationsLoadingStateTitle)}
          />
        ) : (
          <>
            {getTable()}
            <div style={styles.pagination}>{getPagination(isDisabled, true)}</div>
          </>
        )}
      </PageSection>
    </div>
  );
};

const useQueryFromRoute = () => {
  const location = useLocation();
  return parseQuery<Query>(location.search);
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = ({ query }: OptimizationsDetailsMapProps): OptimizationsDetailsStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const queryFromRoute = useQueryFromRoute();

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);
  const order_by = getOrderById(query) || getOrderById(baseQuery);
  const order_how = getOrderByValue(query) || getOrderByValue(baseQuery);

  const reportQuery = {
    ...(groupBy && {
      [groupBy]: groupByValue, // Flattened project filter
    }),
    ...query.filter_by, // Flattened filter by
    limit: query.limit,
    offset: query.offset,
    order_by, // Flattened order by
    order_how, // Flattened order how
  };
  const reportQueryString = getQuery(reportQuery);
  const report = useSelector((state: RootState) =>
    rosSelectors.selectRos(state, reportPathsType, reportType, reportQueryString)
  );
  const reportFetchStatus = useSelector((state: RootState) =>
    rosSelectors.selectRosFetchStatus(state, reportPathsType, reportType, reportQueryString)
  );
  const reportError = useSelector((state: RootState) =>
    rosSelectors.selectRosError(state, reportPathsType, reportType, reportQueryString)
  );

  useEffect(() => {
    if (!reportError && reportFetchStatus !== FetchStatus.inProgress) {
      dispatch(rosActions.fetchRosReport(reportPathsType, reportType, reportQueryString));
    }
  }, [query]);

  return {
    groupBy,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export default OptimizationsDetails;
