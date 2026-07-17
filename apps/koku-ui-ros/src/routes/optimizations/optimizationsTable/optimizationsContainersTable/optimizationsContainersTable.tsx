import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { getQuery } from 'api/queries/query';
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
import { NotAvailable } from 'routes/components/page/notAvailable';
import { NotConfigured } from 'routes/components/page/notConfigured';
import { LoadingState } from 'routes/components/state/loadingState';
import { styles } from 'routes/optimizations/optimizationsBreakdown/optimizationsBreakdown.styles';
import type { RosDetailsQuery } from 'routes/optimizations/optimizationsDetails/optimizationsDetails';
import { getExcludeValuesById, getFilterValuesById } from 'routes/utils/filterBy';
import { getOrderById, getOrderByValue } from 'routes/utils/orderBy';
import * as queryUtils from 'routes/utils/query';
import { getQueryState } from 'routes/utils/queryState';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import type { Interval, OptimizationType } from 'utils/commonTypes';

import { getLinkState } from '../utils';
import { OptimizationsContainersDataTable } from './optimizationsContainersDataTable';
import { OptimizationsContainersToolbar } from './optimizationsContainersToolbar';

interface OptimizationsContainersTableOwnProps {
  breadcrumbLabel?: string; // Breadcrumb label displayed in the page defined by linkPath
  breadcrumbPath?: string; // Breadcrumb path used in the page defined by linkPath
  interval?: Interval;
  isClusterHidden?: boolean; // Hides cluster filter and column
  isProjectHidden?: boolean; // Hides project filter and column
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
  optimizationType?: OptimizationType;
  project?: string; // Project name to filter by
  query?: RosDetailsQuery;
  queryStateName: string; // Name used to store query state
  restoreState?: boolean; // Restore table query from link state on initial page load
}

export interface OptimizationsContainersTableStateProps {
  report: RosReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

export interface OptimizationsContainersTableMapProps {
  project?: string;
  query?: RosQuery;
}

type OptimizationsContainersTableProps = OptimizationsContainersTableOwnProps;

const baseQuery: RosQuery = {
  filter_by: {},
  exclude: {},
  limit: 10,
  offset: 0,
  order_by: {
    last_reported: 'desc',
  },
};

const reportPathsType = RosPathsType.recommendations;
const reportType = RosType.container as any;

const OptimizationsContainersTable: React.FC<OptimizationsContainersTableProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  interval,
  isClusterHidden,
  isProjectHidden,
  linkPath,
  linkState,
  optimizationType,
  project,
  query: parentQueryState,
  queryStateName,
  restoreState,
}) => {
  const intl = useIntl();
  const location = useLocation();

  const [newLinkState, setNewLinkState] = useState();
  const queryState = getQueryState(location, queryStateName);
  const [query, setQuery] = useState(() => {
    if (restoreState === false) {
      return { ...baseQuery };
    }
    return { ...baseQuery, ...queryState?.containers };
  });
  const { report, reportError, reportFetchStatus } = useMapToProps({
    project,
    query,
  });

  // Getters

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
      <OptimizationsContainersDataTable
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        filterBy={query.filter_by}
        interval={interval}
        isClusterHidden={isClusterHidden}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        isProjectHidden={isProjectHidden}
        linkPath={linkPath}
        linkState={newLinkState}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        optimizationType={optimizationType}
        orderBy={query.order_by}
        report={report}
      />
    );
  };

  const getToolbar = () => {
    const itemsPerPage = report?.meta ? report.meta.limit : 0;
    const itemsTotal = report?.meta ? report.meta.count : 0;
    const isDisabled = itemsTotal === 0;

    return (
      <OptimizationsContainersToolbar
        isClusterHidden={isClusterHidden}
        isDisabled={isDisabled}
        isProjectHidden={isProjectHidden}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        pagination={getPagination(isDisabled)}
        query={query}
      />
    );
  };

  // Handlers

  const handleOnFilterAdded = filter => {
    if (!filter || !filter.type) {
      return;
    }
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

  // Effects

  // This table component is used in multiple pages; Optimizations and OCP breakdown. Each table instance has
  // a unique state for when users return to the OCP breakdown and then back to the Optimizations page.
  //
  // Path 1: From OCP details, user navigates to the OCP breakdown (i.e., the "optimizations tab").
  // Within the Optimizations tab, users may navigate to the Optimizations breakdown.
  //
  // Path 2: From Optimizations, user navigates to the Optimizations breakdown and chooses the "project" link.
  // The project link navigates to the OCP breakdown, where users may navigate to the Optimizations breakdown.
  useEffect(() => {
    setNewLinkState(
      getLinkState({
        linkState,
        location,
        query: {
          ...(queryState && queryState), // Save projects state
          ...(parentQueryState && parentQueryState), // Save parent state
          containers: { ...query },
        },
        queryStateName,
      })
    );
  }, [parentQueryState, query]);

  // Render

  const itemsTotal = report?.meta ? report.meta.count : 0;
  const isDisabled = itemsTotal === 0;
  const hasOptimizations = report?.meta && report.meta.count > 0;

  if (reportError) {
    return <NotAvailable title={intl.formatMessage(messages.optimizations)} />;
  }
  if (!query.filter_by && !hasOptimizations && reportFetchStatus === FetchStatus.complete) {
    return <NotConfigured />;
  }
  return (
    <>
      {getToolbar()}
      {reportFetchStatus === FetchStatus.inProgress ? (
        <LoadingState
          body={intl.formatMessage(messages.optimizationsLoadingStateDesc)}
          heading={intl.formatMessage(messages.optimizationsLoadingStateTitle)}
        />
      ) : (
        <>
          {getTable()}
          <div style={styles.paginationContainer}>{getPagination(isDisabled, true)}</div>
        </>
      )}
    </>
  );
};

// For API spec, see https://github.com/RedHatInsights/ros-ocp-backend/blob/main/openapi.json
const useMapToProps = ({
  project,
  query,
}: OptimizationsContainersTableMapProps): OptimizationsContainersTableStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const excludeByCluster = getExcludeValuesById(query, 'cluster') || getExcludeValuesById(baseQuery, 'cluster');
  const excludeByContainer = getExcludeValuesById(query, 'container') || getExcludeValuesById(baseQuery, 'container');
  const excludeByProject = getExcludeValuesById(query, 'project') || getExcludeValuesById(baseQuery, 'project');
  const excludeByWorkload = getExcludeValuesById(query, 'workload') || getExcludeValuesById(baseQuery, 'workload');
  const excludeByWorkloadType =
    getExcludeValuesById(query, 'workload_type') || getExcludeValuesById(baseQuery, 'workload_type');

  const filterByCluster = getFilterValuesById(query, 'cluster') || getFilterValuesById(baseQuery, 'cluster');
  const filterByContainer = getFilterValuesById(query, 'container') || getFilterValuesById(baseQuery, 'container');
  const filterByProject = getFilterValuesById(query, 'project') || getFilterValuesById(baseQuery, 'project');
  const filterByWorkload = getFilterValuesById(query, 'workload') || getFilterValuesById(baseQuery, 'workload');
  const filterByWorkloadType =
    getFilterValuesById(query, 'workload_type') || getFilterValuesById(baseQuery, 'workload_type');

  const filterByExactCluster =
    getFilterValuesById(query, 'exact:cluster') || getFilterValuesById(baseQuery, 'exact:cluster');
  const filterByExactContainer =
    getFilterValuesById(query, 'exact:container') || getFilterValuesById(baseQuery, 'exact:container');
  const filterByExactProject =
    getFilterValuesById(query, 'exact:project') || getFilterValuesById(baseQuery, 'exact:project');
  const filterByExactWorkload =
    getFilterValuesById(query, 'exact:workload') || getFilterValuesById(baseQuery, 'exact:workload');
  const filterByExactWorkloadType =
    getFilterValuesById(query, 'exact:workload_type') || getFilterValuesById(baseQuery, 'exact:workload_type');

  const order_by = getOrderById(query) || getOrderById(baseQuery);
  const order_how = getOrderByValue(query) || getOrderByValue(baseQuery);

  const reportQuery = {
    ...(filterByCluster && { cluster: filterByCluster }), // Flattened cluster filter
    ...(filterByContainer && { container: filterByContainer }), // Flattened container filter
    ...(filterByProject && { project: filterByProject }), // Flattened project filter
    ...(filterByWorkload && { workload: filterByWorkload }), // Flattened workload filter
    ...(filterByWorkloadType && { workload_type: filterByWorkloadType }), // Flattened workload type filter
    ...((filterByExactCluster ||
      filterByExactContainer ||
      filterByExactProject ||
      filterByExactWorkload ||
      filterByExactWorkloadType ||
      project) && {
      filter: {
        ...(filterByExactCluster && { 'exact:cluster': filterByExactCluster }), // Flattened exact cluster
        ...(filterByExactContainer && { 'exact:container': filterByExactContainer }), // Flattened exact container
        ...(filterByExactProject && { 'exact:project': filterByExactProject }), // Flattened exact project
        ...(filterByExactWorkload && { 'exact:workload': filterByExactWorkload }), // Flattened exact workload
        ...(filterByExactWorkloadType && { 'exact:workload_type': filterByExactWorkloadType }), // Flattened exact workload type
        ...(project && { 'exact:project': project }), // Flattened exact project for OCP breakdown
      },
    }),
    ...((excludeByCluster || excludeByContainer || excludeByProject || excludeByWorkload || excludeByWorkloadType) && {
      exclude: {
        ...(excludeByCluster && { cluster: excludeByCluster }), // Flattened cluster exclude
        ...(excludeByContainer && { container: excludeByContainer }), // Flattened container exclude
        ...(excludeByProject && { project: excludeByProject }), // Flattened project exclude
        ...(excludeByWorkload && { workload: excludeByWorkload }), // Flattened workload exclude
        ...(excludeByWorkloadType && { workload_type: excludeByWorkloadType }), // Flattened workload type exclude
      },
    }),
    'cpu-unit': 'cores',
    limit: query.limit,
    'memory-unit': 'MiB',
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
  }, [project, query]);

  return {
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export default OptimizationsContainersTable;
