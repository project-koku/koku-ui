import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { RosQuery } from 'api/queries/rosQuery';
import { getQuery, parseQuery } from 'api/queries/rosQuery';
import type { RecommendationReport } from 'api/ros/recommendations';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Loading } from 'routes/state/loading';
import { NotAvailable } from 'routes/state/notAvailable';
import {
  handleFilterAdded,
  handleFilterRemoved,
  handlePerPageSelect,
  handleSetPage,
  handleSort,
} from 'routes/views/utils/handles';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { rosActions } from 'store/ros';
import { rosSelectors } from 'store/ros';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { getGroupById, getGroupByValue } from '../utils/groupBy';
import { styles } from './recommendations.styles';
import { RecommendationsHeader } from './recommendationsHeader';
import { RecommendationsTable } from './recommendationsTable';
import { RecommendationsToolbar } from './recommendationsToolbar';

interface RecommendationsStateProps {
  groupBy?: string;
  query: RosQuery;
  report: RecommendationReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

interface RecommendationsDispatchProps {
  fetchRosReport: typeof rosActions.fetchRosReport;
}

interface RecommendationsState {
  columns: any[];
  rows: any[];
}

type RecommendationsOwnProps = RouterComponentProps & WrappedComponentProps;

type RecommendationsProps = RecommendationsStateProps & RecommendationsOwnProps & RecommendationsDispatchProps;

const baseQuery: RosQuery = {
  exclude: {},
  filter: {},
  filter_by: {},
  limit: 10,
  offset: 0,
  order_by: {
    cost: 'desc',
  },
};

const reportType = RosType.ros as any;
const reportPathsType = RosPathsType.recommendation as any;

class Recommendations extends React.Component<RecommendationsProps, RecommendationsState> {
  protected defaultState: RecommendationsState = {
    columns: [],
    rows: [],
  };
  public state: RecommendationsState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: RecommendationsProps) {
    const { report, reportError, reportQueryString, router } = this.props;

    const newQuery = prevProps.reportQueryString !== reportQueryString;
    const noReport = !report && !reportError;
    const noLocation = !router.location.search;

    if (newQuery || noReport || noLocation) {
      this.updateReport();
    }
  }

  private getPagination = (isDisabled = false, isBottom = false) => {
    const { intl, query, report, router } = this.props;

    const count = report && report.meta ? report.meta.count : 0;
    const limit = report && report.meta ? report.meta.limit : baseQuery.limit;
    const offset = report && report.meta ? report.meta.offset : baseQuery.offset;
    const page = offset / limit + 1;

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
        itemCount={count}
        onPerPageSelect={(event, perPage) => handlePerPageSelect(query, router, perPage)}
        onSetPage={(event, pageNumber) => handleSetPage(query, router, report, pageNumber)}
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
      <RecommendationsTable
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
      <RecommendationsToolbar
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

  private updateReport = () => {
    const { fetchRosReport, reportQueryString } = this.props;
    fetchRosReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const { groupBy, intl, report, reportError, reportFetchStatus } = this.props;

    const itemsTotal = report && report.meta ? report.meta.count : 0;
    const isDisabled = itemsTotal === 0;
    const isStandalone = groupBy === undefined;
    const title = intl.formatMessage(messages.ocpDetailsTitle);

    // Note: Providers are fetched via the AccountSettings component used by all routes
    if (reportError) {
      return <NotAvailable title={title} />;
    }
    return (
      <div style={styles.recommendationsContainer}>
        {isStandalone ? (
          <>
            <RecommendationsHeader />
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
          </>
        ) : (
          <>
            {this.getToolbar()}
            {reportFetchStatus === FetchStatus.inProgress ? (
              <Loading />
            ) : (
              <>
                {this.getTable()}
                <div style={styles.pagination}>{this.getPagination(isDisabled, true)}</div>
              </>
            )}
          </>
        )}
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<RecommendationsOwnProps, RecommendationsStateProps>(
  (state, { router }) => {
    const queryFromRoute = parseQuery<RosQuery>(router.location.search);
    const groupBy = getGroupById(queryFromRoute);
    const groupByValue = getGroupByValue(queryFromRoute);

    const query = {
      // Todo: remove when API is available
      // filter: {
      //   ...baseQuery.filter,
      //   ...queryFromRoute.filter,
      // },
      ...(groupBy && {
        [groupBy]: groupByValue, // project filter
      }),
      // exclude: queryFromRoute.exclude || baseQuery.exclude,
      filter_by: queryFromRoute.filter_by || baseQuery.filter_by,
      limit: queryFromRoute.limit || baseQuery.limit,
      offset: queryFromRoute.offset || baseQuery.offset,
      // order_by: queryFromRoute.order_by || baseQuery.order_by,
    };
    const reportQueryString = getQuery({
      ...query,
    });
    const report = rosSelectors.selectRos(state, reportPathsType, reportType, reportQueryString);
    const reportError = rosSelectors.selectRosError(state, reportPathsType, reportType, reportQueryString);
    const reportFetchStatus = rosSelectors.selectRosFetchStatus(state, reportPathsType, reportType, reportQueryString);

    return {
      groupBy: queryFromRoute.group_by,
      query,
      report,
      reportError,
      reportFetchStatus,
      reportQueryString,
    } as any;
  }
);

const mapDispatchToProps: RecommendationsDispatchProps = {
  fetchRosReport: rosActions.fetchRosReport,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Recommendations)));
