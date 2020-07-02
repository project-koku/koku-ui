import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import {
  AwsQuery,
  getQuery,
  getQueryRoute,
  parseQuery,
} from 'api/queries/awsQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { orgUnitIdPrefix, tagKeyPrefix } from 'api/queries/query';
import { AwsReport } from 'api/reports/awsReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { NoProvidersState } from 'components/state/noProvidersState/noProvidersState';
import { ExportModal } from 'pages/details/components/export/exportModal';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { awsProvidersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedAwsReportItems';
import {
  ComputedReportItem,
  getUnsortedComputedReportItems,
} from 'utils/computedReport/getComputedReportItems';
import { styles } from './awsDetails.styles';
import { DetailsHeader } from './detailsHeader';
import { DetailsTable } from './detailsTable';
import { DetailsToolbar } from './detailsToolbar';

interface AwsDetailsStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  query: AwsQuery;
  queryString: string;
  report: AwsReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
}

interface AwsDetailsDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface AwsDetailsState {
  columns: any[];
  isExportModalOpen: boolean;
  rows: any[];
  selectedItems: ComputedReportItem[];
}

type AwsDetailsOwnProps = RouteComponentProps<void> & InjectedTranslateProps;

type AwsDetailsProps = AwsDetailsStateProps &
  AwsDetailsOwnProps &
  AwsDetailsDispatchProps;

const baseQuery: AwsQuery = {
  delta: 'cost',
  filter: {
    limit: 10,
    offset: 0,
    resolution: 'monthly',
    time_scope_units: 'month',
    time_scope_value: -1,
  },
  filter_by: {},
  group_by: {
    account: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.aws;

class AwsDetails extends React.Component<AwsDetailsProps> {
  protected defaultState: AwsDetailsState = {
    columns: [],
    isExportModalOpen: false,
    rows: [],
    selectedItems: [],
  };
  public state: AwsDetailsState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleExportModalClose = this.handleExportModalClose.bind(this);
    this.handleExportModalOpen = this.handleExportModalOpen.bind(this);
    this.handleFilterAdded = this.handleFilterAdded.bind(this);
    this.handleFilterRemoved = this.handleFilterRemoved.bind(this);
    this.handlePerPageSelect = this.handlePerPageSelect.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.handleSetPage = this.handleSetPage.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(
    prevProps: AwsDetailsProps,
    prevState: AwsDetailsState
  ) {
    const { location, report, reportError, queryString } = this.props;
    const { selectedItems } = this.state;

    const newQuery = prevProps.queryString !== queryString;
    const noReport = !report && !reportError;
    const noLocation = !location.search;
    const newItems = prevState.selectedItems !== selectedItems;

    if (newQuery || noReport || noLocation || newItems) {
      this.updateReport();
    }
  }

  private getExportModal = (computedItems: ComputedReportItem[]) => {
    const { isExportModalOpen, selectedItems } = this.state;
    const { query } = this.props;

    return (
      <ExportModal
        isAllItems={selectedItems.length === computedItems.length}
        groupBy={this.getGroupById()}
        isOpen={isExportModalOpen}
        items={selectedItems}
        onClose={this.handleExportModalClose}
        query={query}
        reportPathsType={reportPathsType}
      />
    );
  };

  private getGroupById = () => {
    const { query } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = this.getGroupByTagKey();
    const groupByOrg = this.getGroupByOrg();
    let groupBy: string = groupById;

    if (groupByOrg) {
      groupBy = 'account';
    } else if (groupByTagKey) {
      groupBy = `${tagKeyPrefix}${groupByTagKey}`;
    }
    return groupBy;
  };

  private getGroupByOrg = () => {
    const { query } = this.props;
    let groupByOrg;

    for (const groupBy of Object.keys(query.group_by)) {
      const index = groupBy.indexOf(orgUnitIdPrefix);
      if (index !== -1) {
        groupByOrg = query.group_by[orgUnitIdPrefix];
        break;
      }
    }
    return groupByOrg;
  };

  private getGroupByTagKey = () => {
    const { query } = this.props;
    let groupByTag;

    for (const groupBy of Object.keys(query.group_by)) {
      const index = groupBy.indexOf(tagKeyPrefix);
      if (index !== -1) {
        groupByTag = groupBy.substring(index + tagKeyPrefix.length) as any;
        break;
      }
    }
    return groupByTag;
  };

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
        isCompact
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

  private getRouteForQuery(query: AwsQuery, reset: boolean = false) {
    const { history } = this.props;

    // Reset pagination
    if (reset) {
      query.filter = {
        ...query.filter,
        offset: baseQuery.filter.offset,
      };
    }
    return `${history.location.pathname}?${getQueryRoute(query)}`;
  }

  private getTable = () => {
    const { query, report } = this.props;

    return (
      <DetailsTable
        groupBy={this.getGroupById()}
        onSelected={this.handleSelected}
        onSort={this.handleSort}
        query={query}
        report={report}
      />
    );
  };

  private getToolbar = () => {
    const { selectedItems } = this.state;
    const { query, report } = this.props;

    return (
      <DetailsToolbar
        groupBy={this.getGroupById()}
        isExportDisabled={selectedItems.length === 0}
        onExportClicked={this.handleExportModalOpen}
        onFilterAdded={this.handleFilterAdded}
        onFilterRemoved={this.handleFilterRemoved}
        pagination={this.getPagination()}
        query={query}
        report={report}
      />
    );
  };

  public handleExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  public handleExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  private handleFilterAdded = (filterType: string, filterValue: string) => {
    const { history, query } = this.props;
    const newQuery = { ...JSON.parse(JSON.stringify(query)) };

    // Filter by * won't generate a new request if group_by * already exists
    if (filterValue === '*' && newQuery.group_by[filterType] === '*') {
      return;
    }

    if (newQuery.filter_by[filterType]) {
      let found = false;
      const filters = newQuery.filter_by[filterType];
      if (!Array.isArray(filters)) {
        found = filterValue === newQuery.filter_by[filterType];
      } else {
        for (const filter of filters) {
          if (filter === filterValue) {
            found = true;
            break;
          }
        }
      }
      if (!found) {
        newQuery.filter_by[filterType] = [
          newQuery.filter_by[filterType],
          filterValue,
        ];
      }
    } else {
      newQuery.filter_by[filterType] = [filterValue];
    }
    const filteredQuery = this.getRouteForQuery(newQuery, true);
    history.replace(filteredQuery);
  };

  private handleFilterRemoved = (filterType: string, filterValue: string) => {
    const { history, query } = this.props;
    const newQuery = { ...JSON.parse(JSON.stringify(query)) };

    if (filterType === null) {
      newQuery.filter_by = undefined; // Clear all
    } else if (filterValue === null) {
      newQuery.filter_by[filterType] = undefined; // Clear all values
    } else if (Array.isArray(newQuery.filter_by[filterType])) {
      const index = newQuery.filter_by[filterType].indexOf(filterValue);
      if (index > -1) {
        newQuery.filter_by[filterType] = [
          ...query.filter_by[filterType].slice(0, index),
          ...query.filter_by[filterType].slice(index + 1),
        ];
      }
    } else {
      newQuery.filter_by[filterType] = undefined;
    }
    const filteredQuery = this.getRouteForQuery(newQuery, true);
    history.replace(filteredQuery);
  };

  private handleGroupByClick = groupBy => {
    const { history, query } = this.props;
    let groupByKey = groupBy;
    let value = '*';

    // Check for for org units
    const index = groupBy.indexOf(orgUnitIdPrefix);
    if (index !== -1) {
      groupByKey = orgUnitIdPrefix.substring(0, orgUnitIdPrefix.length);
      value = groupBy.slice(orgUnitIdPrefix.length);
    }

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      filter_by: undefined,
      group_by: {
        [groupByKey]: value,
      },
      order_by: { cost: 'desc' },
    };
    history.replace(this.getRouteForQuery(newQuery, true));
    this.setState({ selectedItems: [] });
  };

  private handlePerPageSelect = (_event, perPage) => {
    const { history, query } = this.props;
    const newQuery = { ...JSON.parse(JSON.stringify(query)) };
    newQuery.filter = {
      ...query.filter,
      limit: perPage,
    };
    const filteredQuery = this.getRouteForQuery(newQuery, true);
    history.replace(filteredQuery);
  };

  private handleSelected = (selectedItems: ComputedReportItem[]) => {
    this.setState({ selectedItems });
  };

  private handleSetPage = (event, pageNumber) => {
    const { history, query, report } = this.props;

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
    const filteredQuery = this.getRouteForQuery(newQuery);
    history.replace(filteredQuery);
  };

  private handleSort = (sortType: string, isSortAscending: boolean) => {
    const { history, query } = this.props;
    const newQuery = { ...JSON.parse(JSON.stringify(query)) };
    newQuery.order_by = {};
    newQuery.order_by[sortType] = isSortAscending ? 'asc' : 'desc';
    const filteredQuery = this.getRouteForQuery(newQuery);
    history.replace(filteredQuery);
  };

  private updateReport = () => {
    const { query, location, fetchReport, history, queryString } = this.props;
    if (!location.search) {
      history.replace(
        this.getRouteForQuery({
          filter_by: query.filter_by,
          group_by: query.group_by,
          order_by: { cost: 'desc' },
        })
      );
    } else {
      fetchReport(reportPathsType, reportType, queryString);
    }
  };

  public render() {
    const {
      providers,
      providersError,
      providersFetchStatus,
      report,
      reportError,
    } = this.props;

    const groupById = this.getGroupById();
    const groupByTag = this.getGroupByTagKey();

    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: (groupByTag as any) || groupById,
    });

    const error = providersError || reportError;
    const isLoading = providersFetchStatus === FetchStatus.inProgress;
    const noProviders =
      providers &&
      providers.meta &&
      providers.meta.count === 0 &&
      providersFetchStatus === FetchStatus.complete;

    return (
      <div style={styles.awsDetails}>
        <DetailsHeader
          groupBy={groupById}
          onGroupByClicked={this.handleGroupByClick}
          report={report}
        />
        {Boolean(error) ? (
          <ErrorState error={error} />
        ) : Boolean(noProviders) ? (
          <NoProvidersState />
        ) : Boolean(isLoading) ? (
          <LoadingState />
        ) : (
          <div style={styles.content}>
            {this.getToolbar()}
            {this.getExportModal(computedItems)}
            <div style={styles.tableContainer}>{this.getTable()}</div>
            <div style={styles.paginationContainer}>
              <div style={styles.pagination}>{this.getPagination(true)}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  AwsDetailsOwnProps,
  AwsDetailsStateProps
>((state, props) => {
  const queryFromRoute = parseQuery<AwsQuery>(location.search);
  const query = {
    delta: 'cost',
    filter: {
      ...baseQuery.filter,
      ...queryFromRoute.filter,
    },
    filter_by: queryFromRoute.filter_by || baseQuery.filter_by,
    group_by: queryFromRoute.group_by || baseQuery.group_by,
    order_by: queryFromRoute.order_by || baseQuery.order_by,
  };
  const queryString = getQuery(query);
  const report = reportSelectors.selectReport(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  const reportError = reportSelectors.selectReportError(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    queryString
  );

  const providersQueryString = getProvidersQuery(awsProvidersQuery);
  const providers = providersSelectors.selectProviders(
    state,
    ProviderType.aws,
    providersQueryString
  );
  const providersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.aws,
    providersQueryString
  );
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.aws,
    providersQueryString
  );

  return {
    providers,
    providersError,
    providersFetchStatus,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,

    // Testing...
    //
    // providers: {
    //   meta: {
    //     count: 0,
    //   },
    // } as any,
    // providersError: {
    //   response: {
    //     // status: 401
    //     status: 500
    //   }
    // } as any,
    // providersFetchStatus: FetchStatus.inProgress,
  };
});

const mapDispatchToProps: AwsDetailsDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(AwsDetails)
);
