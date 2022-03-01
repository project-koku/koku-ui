import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { getQuery, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import Loading from 'pages/state/loading';
import { addQueryFilter, removeQueryFilter } from 'pages/views/utils/query';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';

import { styles } from './exports.styles';
import { ExportsTable } from './exportsTable';
import { ExportsToolbar } from './exportsToolbar';

interface ExportsContentOwnProps {
  onClose();
}

interface ExportsContentStateProps {
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
}

interface ExportsContentDispatchProps {
  // TBD...
}

interface ExportsContentState {
  query?: Query;
}

type ExportsContentProps = ExportsContentOwnProps &
  ExportsContentStateProps &
  ExportsContentDispatchProps &
  WrappedComponentProps;

const baseQuery: Query = {
  filter: {
    limit: 10,
    offset: 0,
  },
  order_by: {
    name: 'desc',
  },
};

class ExportsContentBase extends React.Component<ExportsContentProps> {
  protected defaultState: ExportsContentState = {
    query: baseQuery,
  };
  public state: ExportsContentState = { ...this.defaultState };

  private getPagination = (isBottom: boolean = false) => {
    const { report } = this.props;

    const count = report && report.meta ? report.meta.count : 0;
    const limit =
      report && report.meta && report.meta.filter && report.meta.filter.limit
        ? report.meta.filter.limit
        : baseQuery.filter.limit;
    const offset =
      report && report.meta && report.meta.filter && report.meta.filter.offset
        ? report.meta.filter.offset
        : baseQuery.filter.offset;
    const page = offset / limit + 1;

    return (
      <Pagination
        isCompact={!isBottom}
        itemCount={count}
        onPerPageSelect={this.handlePerPageSelect}
        onSetPage={this.handleSetPage}
        page={page}
        perPage={limit}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId="`pagination${isBottom ? '-bottom' : ''}`"
      />
    );
  };

  private getTable = () => {
    const { onClose, report, reportFetchStatus } = this.props;
    const { query } = this.state;

    return (
      <ExportsTable
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onClose={onClose}
        onSort={this.handleOnSort}
        query={query}
        report={report}
      />
    );
  };

  private handleFilterAdded = (filterType: string, filterValue: string) => {
    const { query } = this.state;

    const filteredQuery = addQueryFilter(query, filterType, filterValue);
    this.setState({ query: filteredQuery }, () => {
      // Fetch
    });
  };

  private handleFilterRemoved = (filterType: string, filterValue: string) => {
    const { query } = this.state;

    const filteredQuery = removeQueryFilter(query, filterType, filterValue);

    this.setState({ query: filteredQuery }, () => {
      // Fetch
    });
  };

  private handleOnSort = (sortType: string, isSortAscending: boolean) => {
    const { query } = this.state;

    const newQuery = { ...JSON.parse(JSON.stringify(query)) };
    newQuery.order_by = {};
    newQuery.order_by[sortType] = isSortAscending ? 'asc' : 'desc';

    this.setState({ query: newQuery }, () => {
      // Fetch
    });
  };

  private handlePerPageSelect = (_event, perPage) => {
    const { query } = this.state;

    const newQuery = { ...JSON.parse(JSON.stringify(query)) };
    newQuery.filter = {
      ...query.filter,
      limit: perPage,
    };

    this.setState({ query: newQuery }, () => {
      // Fetch
    });
  };

  private handleSetPage = (event, pageNumber) => {
    const { report } = this.props;
    const { query } = this.state;

    const limit =
      report && report.meta && report.meta.filter && report.meta.filter.limit
        ? report.meta.filter.limit
        : baseQuery.filter.limit;
    const offset = pageNumber * limit - limit;

    const newQuery = { ...JSON.parse(JSON.stringify(query)) };
    newQuery.filter = {
      ...query.filter,
      offset,
    };

    this.setState({ query: newQuery }, () => {
      // Fetch
    });
  };

  public render() {
    const { intl, reportFetchStatus } = this.props;

    return (
      <>
        {intl.formatMessage(messages.ExportsDesc)}
        <div style={styles.content}>
          <ExportsToolbar
            onFilterAdded={this.handleFilterAdded}
            onFilterRemoved={this.handleFilterRemoved}
            pagination={this.getPagination()}
          />
          {reportFetchStatus === FetchStatus.inProgress ? (
            <Loading />
          ) : (
            <>
              <div>{this.getTable()}</div>
              <div style={styles.pagination}>{this.getPagination(true)}</div>
            </>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExportsContentOwnProps, ExportsContentStateProps>(state => {
  const query = {
    filter: {
      ...baseQuery.filter,
    },
    filter_by: baseQuery.filter_by,
    order_by: baseQuery.order_by,
  };

  // Todo: Temp report until APIs are available
  const reportType = ReportType.cost;
  const reportPathsType = ReportPathsType.ocp;

  const queryString = getQuery(query);
  // const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);

  // Todo: For testing
  const report = {
    meta: {
      count: 11,
      filter: {
        limit: 10,
        offset: 0,
      },
      order_by: {
        cost_total: 'desc',
      },
    },
    data: [
      {
        name: 'OpenShift grouped by Project',
        created: '2022-01-17 13:25:07',
        expires: '2022-01-24',
        status: 'pending',
      },
      {
        name: 'Amazon Web Services grouped by Account',
        created: '2022-01-17 13:24:23',
        expires: '2022-01-24',
        status: 'running',
      },
      {
        name: 'OpenShift grouped by Cluster',
        created: '2022-01-16 13:23:08',
        expires: '2022-01-23',
        status: 'completed',
      },
      {
        name: 'Microsoft Azure grouped by Account',
        created: '2022-01-16 13:18:22',
        expires: '2022-01-23',
        status: 'failed',
      },
      {
        name: 'Google Cloud Platform grouped by Service',
        created: '2022-01-14 09:05:23',
        expires: '2022-01-23',
        status: 'completed',
      },
      {
        name: 'Explorer - OpenShift grouped by Cluster',
        created: '2022-01-14 08:38:42',
        expires: '2022-01-23',
        status: 'completed',
      },
    ],
  } as any;

  return {
    report,
    reportError,
    reportFetchStatus,
  };
});

const mapDispatchToProps: ExportsContentDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const ExportsContent = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ExportsContentBase));

export { ExportsContent };
