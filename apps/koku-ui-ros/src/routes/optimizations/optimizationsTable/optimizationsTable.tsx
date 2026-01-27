import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { getQuery } from 'api/queries/query';
import type { RosQuery } from 'api/queries/rosQuery';
import type { RosReport } from 'api/ros/ros';
import { RosNamespace } from 'api/ros/ros';
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
import { getOrderById, getOrderByValue } from 'routes/utils/orderBy';
import * as queryUtils from 'routes/utils/query';
import { clearQueryState, getQueryState } from 'routes/utils/queryState';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';

import { OptimizationsContainerTable } from './optimizationsContainerTable';
import { OptimizationsProjectTable } from './optimizationsProjectTable';
import { OptimizationsToolbar } from './optimizationsToolbar';

interface OptimizationsTableOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  cluster?: string | string[];
  hideCluster?: boolean;
  hideProject?: boolean;
  isOptimizationsDetails?: boolean;
  linkPath?: string; // Optimizations breakdown link path
  linkState?: any; // Optimizations breakdown link state
  namespace?: RosNamespace;
  project?: string | string[];
  projectPath?: string; // Project path (i.e., OCP details breakdown path)
}

export interface OptimizationsTableStateProps {
  report: RosReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

export interface OptimizationsTableMapProps {
  cluster?: string | string[];
  namespace?: RosNamespace;
  project?: string | string[];
  query?: RosQuery;
}

type OptimizationsTableProps = OptimizationsTableOwnProps;

const baseQuery: RosQuery = {
  limit: 10,
  offset: 0,
  order_by: {
    last_reported: 'desc',
  },
};

const reportType = RosType.ros as any;

const OptimizationsTable: React.FC<OptimizationsTableProps> = ({
  breadcrumbLabel,
  breadcrumbPath,
  cluster,
  hideCluster,
  hideProject,
  isOptimizationsDetails,
  linkPath,
  linkState,
  namespace,
  project,
  projectPath,
}) => {
  const intl = useIntl();
  const location = useLocation();

  const queryState = getQueryState(location, projectPath ? 'optimizations' : 'optimizationsBreakdown');
  const [query, setQuery] = useState({ ...baseQuery, ...(queryState && queryState) });
  const { report, reportError, reportFetchStatus, reportQueryString } = useMapToProps({
    cluster,
    namespace,
    project,
    query,
  });

  // Clear queryState, returned from breakdown page, after query has been initialized
  useEffect(() => {
    clearQueryState(location, 'optimizationsBreakdown');
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
    return namespace === RosNamespace.projects ? (
      <OptimizationsProjectTable
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        filterBy={query.filter_by}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        isOptimizationsDetails={isOptimizationsDetails}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        orderBy={query.order_by}
        query={query}
        report={report}
        reportQueryString={reportQueryString}
        linkPath={linkPath}
        linkState={linkState}
        projectPath={projectPath}
      />
    ) : (
      <OptimizationsContainerTable
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={breadcrumbPath}
        filterBy={query.filter_by}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        isOptimizationsDetails={isOptimizationsDetails}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        orderBy={query.order_by}
        query={query}
        report={report}
        reportQueryString={reportQueryString}
        linkPath={linkPath}
        linkState={linkState}
        projectPath={projectPath}
      />
    );
  };

  const getToolbar = () => {
    const itemsPerPage = report?.meta ? report.meta.limit : 0;
    const itemsTotal = report?.meta ? report.meta.count : 0;
    const isDisabled = itemsTotal === 0;

    return (
      <OptimizationsToolbar
        hideCluster={hideCluster}
        hideProject={hideProject}
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

const useMapToProps = ({
  cluster,
  namespace,
  project,
  query,
}: OptimizationsTableMapProps): OptimizationsTableStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const order_by = getOrderById(query) || getOrderById(baseQuery);
  const order_how = getOrderByValue(query) || getOrderByValue(baseQuery);
  const reportPathsType = namespace === RosNamespace.projects ? RosPathsType.namespaces : RosPathsType.recommendations;

  const reportQuery = {
    ...(cluster && { cluster }), // Flattened cluster filter
    ...(project && { project }), // Flattened project filter
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
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export default OptimizationsTable;
