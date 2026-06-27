import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { getQuery } from 'api/queries/query';
import type { RosQuery } from 'api/queries/rosQuery';
import type { RosReport } from 'api/ros/ros';
import { RosPathsType } from 'api/ros/ros';
import { RosType } from 'api/ros/ros';
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
import { getExcludeById, getFilterById } from 'routes/utils/filterBy';
import { getOrderById, getOrderByValue } from 'routes/utils/orderBy';
import * as queryUtils from 'routes/utils/query';
import { getQueryState } from 'routes/utils/queryState';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import type { Interval, OptimizationType } from 'utils/commonTypes';
import { excludeKey } from 'utils/props';

import { getLinkState } from '../utils';
import { OptimizationsProjectsDataTable } from './optimizationsProjectsDataTable';
import { OptimizationsProjectsToolbar } from './optimizationsProjectsToolbar';

interface OptimizationsProjectsTableOwnProps {
  baseQuery?: RosQuery;
  breadcrumbLabel?: string; // Breadcrumb label displayed in the page defined by linkPath
  breadcrumbPath?: string; // Breadcrumb path used in the page defined by linkPath
  interval?: Interval;
  isClusterHidden?: boolean; // Hides cluster filter and column
  isPaginationHidden?: boolean;
  isToolbarHidden?: boolean;
  linkPath?: string; // Path used by the link displayed in each table row
  linkState?: any; // Link state used by the link displayed in each table row
  optimizationType?: OptimizationType;
  project?: string | string[]; // Project name to filter by for OCP breakdown
  query?: RosDetailsQuery;
  queryStateName: string; // Name used to store query state
}

export interface OptimizationsProjectsTableStateProps {
  report: RosReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

export interface OptimizationsProjectsTableMapProps {
  cluster?: string | string[];
  project?: string | string[];
  query?: RosQuery;
}

type OptimizationsProjectsTableProps = OptimizationsProjectsTableOwnProps;

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
const reportType = RosType.namespace as any;

const OptimizationsProjectsTable: React.FC<OptimizationsProjectsTableProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  interval,
  isClusterHidden,
  isPaginationHidden,
  isToolbarHidden,
  linkPath,
  linkState,
  optimizationType,
  project,
  query: parentQueryState,
  queryStateName,
}) => {
  const intl = useIntl();
  const location = useLocation();

  const [newLinkState, setNewLinkState] = useState();
  const queryState = getQueryState(location, queryStateName);
  const [query, setQuery] = useState({ ...baseQuery, ...(queryState && queryState?.projects) });
  const { report, reportError, reportFetchStatus, reportQueryString } = useMapToProps({
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
      <OptimizationsProjectsDataTable
        breadcrumbLabel={breadcrumbLabel}
        filterBy={query.filter_by}
        interval={interval}
        isClusterHidden={isClusterHidden}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        linkPath={linkPath}
        linkState={newLinkState}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        optimizationType={optimizationType}
        orderBy={query.order_by}
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
      <OptimizationsProjectsToolbar
        isClusterHidden={isClusterHidden}
        isDisabled={isDisabled}
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
    // Only one filter can be applied at a time
    const key = filter.excludeType === 'exact' ? `exact:${filter.type}` : filter.type;
    const tmpQuery = {
      ...query,
      ...(filter.excludeType === excludeKey
        ? {
            exclude: {
              ...query.exclude,
              [key]: undefined,
            },
          }
        : {
            filter_by: {
              ...query.filter_by,
              [key]: undefined,
            },
          }),
    };
    const newQuery = queryUtils.handleOnFilterAdded(tmpQuery, filter);
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
        breadcrumbPath,
        linkState,
        location,
        query: {
          ...(queryState && queryState), // Save containers state
          ...(parentQueryState && parentQueryState), // Save parent state
          projects: { ...query },
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
      {!isToolbarHidden && getToolbar()}
      {reportFetchStatus === FetchStatus.inProgress ? (
        <LoadingState
          body={intl.formatMessage(messages.optimizationsLoadingStateDesc)}
          heading={intl.formatMessage(messages.optimizationsLoadingStateTitle)}
        />
      ) : (
        <>
          {getTable()}
          {!isPaginationHidden && <div style={styles.paginationContainer}>{getPagination(isDisabled, true)}</div>}
        </>
      )}
    </>
  );
};

// For API spec, see https://github.com/RedHatInsights/ros-ocp-backend/blob/main/openapi.json
const useMapToProps = ({
  project,
  query,
}: OptimizationsProjectsTableMapProps): OptimizationsProjectsTableStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const excludeByCluster = getExcludeById(query, 'cluster') || getExcludeById(baseQuery, 'cluster');
  const excludeByProject = getExcludeById(query, 'project') || getExcludeById(baseQuery, 'project');
  const filterByCluster = getFilterById(query, 'cluster') || getFilterById(baseQuery, 'cluster');
  const filterByProject = getFilterById(query, 'project') || getFilterById(baseQuery, 'project');
  const filterByExactCluster = getFilterById(query, 'exact:cluster') || getFilterById(baseQuery, 'exact:cluster');
  const filterByExactProject = getFilterById(query, 'exact:project') || getFilterById(baseQuery, 'exact:project');
  const order_by = getOrderById(query) || getOrderById(baseQuery);
  const order_how = getOrderByValue(query) || getOrderByValue(baseQuery);

  const reportQuery = {
    ...(filterByCluster && { cluster: filterByCluster }), // Flattened cluster filter
    ...(filterByProject && { project: filterByProject }), // Flattened project filter
    ...((filterByExactCluster || filterByExactProject || project) && {
      filter: {
        ...(filterByExactCluster && { 'exact:cluster': filterByExactCluster }), // Flattened exact cluster
        ...(filterByExactProject && { 'exact:project': filterByExactProject }), // Flattened exact project
        ...(project && { 'exact:project': project }), // Flattened exact project for OCP breakdown
      },
    }),
    ...((excludeByCluster || excludeByProject) && {
      exclude: {
        ...(excludeByCluster && { cluster: excludeByCluster }), // Flattened cluster exclude
        ...(excludeByProject && { project: excludeByProject }), // Flattened project exclude
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
  }, [query]);

  return {
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export default OptimizationsProjectsTable;
