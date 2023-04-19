import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { getQuery, parseQuery } from 'api/queries/query';
import type { RosQuery } from 'api/queries/rosQuery';
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
import { styles } from 'routes/views/optimizations/optimizations.styles';
import { getGroupById, getGroupByValue } from 'routes/views/utils/groupBy';
import { handleFilterAdded, handleFilterRemoved, handleSort } from 'routes/views/utils/handles';
import { getOrderById, getOrderByValue } from 'routes/views/utils/orderBy';
import { getRouteForQuery } from 'routes/views/utils/query';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

export interface OptimizationsBreakdownOwnProps extends RouterComponentProps, WrappedComponentProps {
  // TBD...
}

interface OptimizationsBreakdownStateProps {
  query: RosQuery;
  report: RosReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

interface OptimizationsBreakdownDispatchProps {
  fetchRosReport: typeof rosActions.fetchRosReport;
}

interface OptimizationsBreakdownState {
  columns: any[];
  rows: any[];
}

type OptimizationsBreakdownProps = OptimizationsBreakdownStateProps &
  OptimizationsBreakdownOwnProps &
  OptimizationsBreakdownDispatchProps;

const baseQuery: RosQuery = {
  limit: 10,
  offset: 0,
  order_by: {
    last_reported: 'desc',
  },
};

const reportType = RosType.ros as any;
const reportPathsType = RosPathsType.recommendations as any;

class OptimizationsBreakdownBase extends React.Component<OptimizationsBreakdownProps, OptimizationsBreakdownState> {
  protected defaultState: OptimizationsBreakdownState = {
    columns: [],
    rows: [],
  };
  public state: OptimizationsBreakdownState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: OptimizationsBreakdownProps) {
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
        onPerPageSelect={(event, perPage) => this.handlePerPageSelect(perPage)}
        onSetPage={(event, pageNumber) => this.handleSetPage(pageNumber)}
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
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSort={(sortType, isSortAscending) => handleSort(query, router, sortType, isSortAscending)}
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
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onFilterAdded={filter => handleFilterAdded(query, router, filter)}
        onFilterRemoved={filter => handleFilterRemoved(query, router, filter)}
        pagination={this.getPagination(isDisabled)}
        query={query}
      />
    );
  };

  private handlePerPageSelect = (perPage: number) => {
    const { query, router } = this.props;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      limit: perPage,
    };
    const filteredQuery = getRouteForQuery(newQuery, router.location, true);
    router.navigate(filteredQuery, { replace: true });
  };

  private handleSetPage = (pageNumber: number) => {
    const { query, report, router } = this.props;

    const limit = report && report.meta && report.meta.limit ? report.meta.limit : baseQuery.limit;
    const offset = pageNumber * limit - 1;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      limit,
      offset,
    };
    const filteredQuery = getRouteForQuery(newQuery, router.location);
    router.navigate(filteredQuery, { replace: true });
  };

  private updateReport = () => {
    const { fetchRosReport, reportQueryString } = this.props;
    fetchRosReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const { intl, report, reportError, reportFetchStatus } = this.props;

    const itemsTotal = report && report.meta ? report.meta.count : 0;
    const isDisabled = itemsTotal === 0;
    const title = intl.formatMessage(messages.optimizations);
    const hasOptimizations = report && report.meta && report.meta.count > 0;

    if (reportError) {
      return <NotAvailable title={title} />;
    }
    if (!hasOptimizations && reportFetchStatus === FetchStatus.complete) {
      return <NoOptimizations />;
    }
    return (
      <div style={styles.optimizationsContainer}>
        {this.getToolbar()}
        {reportFetchStatus === FetchStatus.inProgress ? (
          <Loading />
        ) : (
          <>
            {this.getTable()}
            <div style={styles.pagination}>{this.getPagination(isDisabled, true)}</div>
          </>
        )}
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OptimizationsBreakdownOwnProps, OptimizationsBreakdownStateProps>(
  (state, { router }) => {
    const queryFromRoute = parseQuery<RosQuery>(router.location.search);

    const groupBy = getGroupById(queryFromRoute);
    const groupByValue = getGroupByValue(queryFromRoute);
    const order_by = getOrderById(queryFromRoute) || getOrderById(baseQuery);
    const order_how = getOrderByValue(queryFromRoute) || getOrderByValue(baseQuery);

    const query: any = {
      ...baseQuery,
      ...queryFromRoute,
    };
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
  }
);

const mapDispatchToProps: OptimizationsBreakdownDispatchProps = {
  fetchRosReport: rosActions.fetchRosReport,
};

const OptimizationsBreakdown = injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(OptimizationsBreakdownBase))
);

export { OptimizationsBreakdown };
