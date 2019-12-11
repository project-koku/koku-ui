import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AwsQuery, getQuery, parseQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/providersQuery';
import { AxiosError } from 'axios';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { NoProvidersState } from 'components/state/noProvidersState/noProvidersState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { awsReportsActions, awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { awsProvidersQuery, providersSelectors } from 'store/providers';
import {
  ComputedAwsReportItem,
  getIdKeyForGroupBy,
  getUnsortedComputedAwsReportItems,
} from 'utils/getComputedAwsReportItems';
import { styles } from './awsDetails.styles';
import { DetailsHeader } from './detailsHeader';
import { DetailsTable } from './detailsTable';
import { DetailsToolbar } from './detailsToolbar';
import { ExportModal } from './exportModal';

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
  fetchReport: typeof awsReportsActions.fetchReport;
}

interface AwsDetailsState {
  columns: any[];
  isExportModalOpen: boolean;
  rows: any[];
  selectedItems: ComputedAwsReportItem[];
}

type AwsDetailsOwnProps = RouteComponentProps<void> & InjectedTranslateProps;

type AwsDetailsProps = AwsDetailsStateProps &
  AwsDetailsOwnProps &
  AwsDetailsDispatchProps;

const reportType = AwsReportType.cost;

const baseQuery: AwsQuery = {
  delta: 'cost',
  filter: {
    limit: 10,
    offset: 0,
    resolution: 'monthly',
    time_scope_units: 'month',
    time_scope_value: -1,
  },
  group_by: {
    account: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

const tagKey = 'or:tag:';

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

  private getExportModal = (computedItems: ComputedAwsReportItem[]) => {
    const { isExportModalOpen, selectedItems } = this.state;
    const { query } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = this.getGroupByTagKey();

    return (
      <ExportModal
        isAllItems={selectedItems.length === computedItems.length}
        groupBy={groupByTagKey ? `${tagKey}${groupByTagKey}` : groupById}
        isOpen={isExportModalOpen}
        items={selectedItems}
        onClose={this.handleExportModalClose}
        query={query}
      />
    );
  };

  private getFilterFields = (groupById: string): any[] => {
    const { t } = this.props;
    if (groupById === 'account') {
      return [
        {
          id: 'account',
          label: t('aws_details.filter.name'),
          title: t('aws_details.filter.account_select'),
          placeholder: t('aws_details.filter.account_placeholder'),
          filterType: 'text',
        },
      ];
    } else if (groupById === 'service') {
      return [
        {
          id: 'service',
          label: t('aws_details.filter.name'),
          title: t('aws_details.filter.service_select'),
          placeholder: t('aws_details.filter.service_placeholder'),
          filterType: 'text',
        },
      ];
    } else if (groupById === 'region') {
      return [
        {
          id: 'region',
          label: t('aws_details.filter.name'),
          title: t('aws_details.filter.region_select'),
          placeholder: t('aws_details.filter.region_placeholder'),
          filterType: 'text',
        },
      ];
    } else {
      // Default for group by account tags
      return [
        {
          id: 'tag',
          label: t('aws_details.filter.name'),
          title: t('aws_details.filter.tag_select'),
          placeholder: t('aws_details.filter.tag_placeholder'),
          filterType: 'text',
        },
      ];
    }
    return [];
  };

  private getGroupByTagKey = () => {
    const { query } = this.props;
    let groupByTag;

    for (const groupBy of Object.keys(query.group_by)) {
      const tagIndex = groupBy.indexOf(tagKey);
      if (tagIndex !== -1) {
        groupByTag = groupBy.substring(tagIndex + tagKey.length) as any;
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
    // Reset pagination
    if (reset) {
      query.filter = {
        ...query.filter,
        offset: baseQuery.filter.offset,
      };
    }
    return `/aws?${getQuery(query)}`;
  }

  private getTable = () => {
    const { query, report } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = this.getGroupByTagKey();

    return (
      <DetailsTable
        groupBy={groupByTagKey ? `${tagKey}${groupByTagKey}` : groupById}
        onSelected={this.handleSelected}
        onSort={this.handleSort}
        query={query}
        report={report}
      />
    );
  };

  private getToolbar = () => {
    const { selectedItems } = this.state;
    const { query, report, t } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTag = this.getGroupByTagKey();
    const filterFields = this.getFilterFields(groupByTag ? 'tag' : groupById);

    return (
      <DetailsToolbar
        exportText={t('aws_details.export_link')}
        filterFields={filterFields}
        isExportDisabled={selectedItems.length === 0}
        onExportClicked={this.handleExportModalOpen}
        onFilterAdded={this.handleFilterAdded}
        onFilterRemoved={this.handleFilterRemoved}
        pagination={this.getPagination()}
        query={query}
        report={report}
        resultsTotal={report ? report.meta.count : 0}
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

    const groupByTagKey = this.getGroupByTagKey();
    const newFilterType =
      filterType === 'tag' ? `${tagKey}${groupByTagKey}` : filterType;

    if (newQuery.group_by[newFilterType]) {
      if (newQuery.group_by[newFilterType] === '*') {
        newQuery.group_by[newFilterType] = filterValue;
      } else if (!newQuery.group_by[newFilterType].includes(filterValue)) {
        newQuery.group_by[newFilterType] = [
          newQuery.group_by[newFilterType],
          filterValue,
        ];
      }
    } else {
      newQuery.group_by[filterType] = [filterValue];
    }
    const filteredQuery = this.getRouteForQuery(newQuery, true);
    history.replace(filteredQuery);
  };

  private handleFilterRemoved = (filterType: string, filterValue: string) => {
    const { history, query } = this.props;
    const newQuery = { ...JSON.parse(JSON.stringify(query)) };

    const groupByTagKey = this.getGroupByTagKey();
    const newFilterType =
      filterType === 'tag' ? `${tagKey}${groupByTagKey}` : filterType;

    if (filterValue === '') {
      newQuery.group_by = {
        [newFilterType]: '*',
      };
    } else if (!Array.isArray(newQuery.group_by[newFilterType])) {
      newQuery.group_by[newFilterType] = '*';
    } else {
      const index = newQuery.group_by[newFilterType].indexOf(filterValue);
      if (index > -1) {
        newQuery.group_by[newFilterType] = [
          ...query.group_by[newFilterType].slice(0, index),
          ...query.group_by[newFilterType].slice(index + 1),
        ];
      }
    }
    const filteredQuery = this.getRouteForQuery(newQuery, true);
    history.replace(filteredQuery);
  };

  private handleGroupByClick = groupBy => {
    const { history, query } = this.props;
    const groupByKey: keyof AwsQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      group_by: {
        [groupByKey]: '*',
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

  private handleSelected = (selectedItems: ComputedAwsReportItem[]) => {
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
          group_by: query.group_by,
          order_by: { cost: 'desc' },
        })
      );
    } else {
      fetchReport(reportType, queryString);
    }
  };

  public render() {
    const {
      providers,
      providersError,
      providersFetchStatus,
      query,
      report,
      reportError,
    } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTag = this.getGroupByTagKey();

    const computedItems = getUnsortedComputedAwsReportItems({
      report,
      idKey: (groupByTag as any) || groupById,
    });

    const error = providersError || reportError;
    const isLoading = providersFetchStatus === FetchStatus.inProgress;
    const noProviders =
      providers !== undefined &&
      providers.meta !== undefined &&
      providers.meta.count === 0 &&
      providersFetchStatus === FetchStatus.complete;

    return (
      <div className={css(styles.awsDetails)}>
        <DetailsHeader onGroupByClicked={this.handleGroupByClick} />
        {Boolean(error) ? (
          <ErrorState error={error} />
        ) : Boolean(noProviders) ? (
          <NoProvidersState />
        ) : Boolean(isLoading) ? (
          <LoadingState />
        ) : (
          <div className={css(styles.content)}>
            {this.getToolbar()}
            {this.getExportModal(computedItems)}
            <div className={css(styles.tableContainer)}>{this.getTable()}</div>
            <div className={css(styles.paginationContainer)}>
              <div className={css(styles.pagination)}>
                {this.getPagination(true)}
              </div>
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
    group_by: queryFromRoute.group_by || baseQuery.group_by,
    order_by: queryFromRoute.order_by || baseQuery.order_by,
  };
  const queryString = getQuery(query);
  const report = awsReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportError = awsReportsSelectors.selectReportError(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
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
  fetchReport: awsReportsActions.fetchReport,
};

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AwsDetails)
);
