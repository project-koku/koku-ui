import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { RosQuery } from 'api/queries/rosQuery';
import { getQuery, parseQuery } from 'api/queries/rosQuery';
import type { RosReport } from 'api/ros/ros';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Loading } from 'routes/state/loading';
import { NoOptimizations } from 'routes/state/noOptimizations';
import { NotAvailable } from 'routes/state/notAvailable';
import { OptimizationsTable, OptimizationsToolbar } from 'routes/views/components/optimizations';
import { handleOnFilterAdded, handleOnFilterRemoved, handleOnSort } from 'routes/views/utils/navHandles';
import { getOrderById, getOrderByValue } from 'routes/views/utils/orderBy';
import { getRouteForQuery } from 'routes/views/utils/query';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import { uiActions } from 'store/ui';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './optimizations.styles';
import { OptimizationsHeader } from './optimizationsHeader';

export interface OptimizationsOwnProps extends RouterComponentProps, WrappedComponentProps {
  // TBD...
}

interface OptimizationsStateProps {
  query: RosQuery;
  report: RosReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

interface OptimizationsDispatchProps {
  closeOptimizationsDrawer: typeof uiActions.closeOptimizationsDrawer;
  fetchRosReport: typeof rosActions.fetchRosReport;
}

interface OptimizationsState {
  // TBD...
}

type OptimizationsProps = OptimizationsStateProps & OptimizationsOwnProps & OptimizationsDispatchProps;

const baseQuery: RosQuery = {
  limit: 10,
  offset: 0,
  order_by: {
    last_reported: 'desc',
  },
};

const reportType = RosType.ros as any;
const reportPathsType = RosPathsType.recommendations as any;

class Optimizations extends React.Component<OptimizationsProps, OptimizationsState> {
  protected defaultState: OptimizationsState = {};
  public state: OptimizationsState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: OptimizationsProps) {
    const { report, reportError, reportQueryString, router } = this.props;

    const newQuery = prevProps.reportQueryString !== reportQueryString;
    const noReport = !report && !reportError;
    const noLocation = !router.location.search;

    if (newQuery || noReport || noLocation) {
      this.updateReport();
    }
  }

  private getPagination = (isDisabled = false, isBottom = false) => {
    const { intl, report } = this.props;

    const count = report && report.meta ? report.meta.count : 0;
    const limit = report && report.meta ? report.meta.limit : baseQuery.limit;
    const offset = report && report.meta ? report.meta.offset : baseQuery.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
        itemCount={count}
        onPerPageSelect={(event, perPage) => this.handleOnPerPageSelect(perPage)}
        onSetPage={(event, pageNumber) => this.handleOnSetPage(pageNumber)}
        page={page}
        perPage={limit}
        titles={{
          paginationTitle: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.openShift),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`exports-pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  private getTable = () => {
    const { query, report, reportFetchStatus, reportQueryString, router } = this.props;

    return (
      <OptimizationsTable
        filterBy={query.filter_by}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSort={(sortType, isSortAscending) => handleOnSort(query, router, sortType, isSortAscending)}
        orderBy={query.order_by}
        report={report}
        reportQueryString={reportQueryString}
      />
    );
  };

  private getToolbar = () => {
    const { query, report, router } = this.props;

    const itemsPerPage = report && report.meta ? report.meta.limit : 0;
    const itemsTotal = report && report.meta ? report.meta.count : 0;
    const isDisabled = itemsTotal === 0;

    return (
      <OptimizationsToolbar
        isDisabled={isDisabled}
        isProject
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onFilterAdded={filter => handleOnFilterAdded(query, router, filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(query, router, filter)}
        pagination={this.getPagination(isDisabled)}
        query={query}
      />
    );
  };

  private handleOnPerPageSelect = (perPage: number) => {
    const { closeOptimizationsDrawer, query, router } = this.props;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      limit: perPage,
    };
    const filteredQuery = getRouteForQuery(newQuery, router.location, true);
    router.navigate(filteredQuery, { replace: true });
    closeOptimizationsDrawer();
  };

  private handleOnSetPage = (pageNumber: number) => {
    const { closeOptimizationsDrawer, query, report, router } = this.props;

    const limit = report && report.meta && report.meta.limit ? report.meta.limit : baseQuery.limit;
    const offset = pageNumber * limit - limit;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      limit,
      offset,
    };
    const filteredQuery = getRouteForQuery(newQuery, router.location);
    router.navigate(filteredQuery, { replace: true });
    closeOptimizationsDrawer();
  };

  private updateReport = () => {
    const { fetchRosReport, reportQueryString } = this.props;
    fetchRosReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const { intl, query, report, reportError, reportFetchStatus } = this.props;

    const itemsTotal = report && report.meta ? report.meta.count : 0;
    const isDisabled = itemsTotal === 0;
    const title = intl.formatMessage(messages.optimizations);
    const hasOptimizations = report && report.meta && report.meta.count > 0;

    if (reportError) {
      return <NotAvailable title={title} />;
    }
    if (!query.filter_by && !hasOptimizations && reportFetchStatus === FetchStatus.complete) {
      return <NoOptimizations title={title} />;
    }
    return (
      <div style={styles.optimizationsContainer}>
        <OptimizationsHeader />
        <div style={styles.content}>
          <div style={styles.toolbarContainer}>{this.getToolbar()}</div>
          {reportFetchStatus === FetchStatus.inProgress ? (
            <Loading />
          ) : (
            <>
              <div style={styles.tableContainer}>{this.getTable()}</div>
              <div style={styles.paginationContainer}>
                <div style={styles.pagination}>{this.getPagination(isDisabled, true)}</div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OptimizationsOwnProps, OptimizationsStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<RosQuery>(router.location.search);
  const order_by = getOrderById(queryFromRoute) || getOrderById(baseQuery);
  const order_how = getOrderByValue(queryFromRoute) || getOrderByValue(baseQuery);

  const query: any = {
    ...baseQuery,
    ...queryFromRoute,
  };
  const reportQuery = {
    ...query.filter_by, // Flattened filter by
    limit: query.limit,
    offset: query.offset,
    order_by, // Flattened order by
    order_how, // Flattened order how
  };

  const reportQueryString = getQuery(reportQuery);
  const report = rosSelectors.selectRos(state, reportPathsType, reportType, reportQueryString);
  const reportError = rosSelectors.selectRosError(state, reportPathsType, reportType, reportQueryString);
  const reportFetchStatus = rosSelectors.selectRosFetchStatus(state, reportPathsType, reportType, reportQueryString);

  return {
    query,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  } as any;
});

const mapDispatchToProps: OptimizationsDispatchProps = {
  closeOptimizationsDrawer: uiActions.closeOptimizationsDrawer,
  fetchRosReport: rosActions.fetchRosReport,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Optimizations)));
