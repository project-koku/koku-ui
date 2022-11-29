import 'routes/views/details/components/dataTable/dataTable.scss';

import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import type { AwsQuery } from 'api/queries/awsQuery';
import { getQuery, parseQuery } from 'api/queries/awsQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { orgUnitIdKey, tagPrefix } from 'api/queries/query';
import type { AwsReport } from 'api/reports/awsReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Loading } from 'routes/state/loading';
import { NoData } from 'routes/state/noData';
import { NoProviders } from 'routes/state/noProviders';
import { NotAvailable } from 'routes/state/notAvailable';
import { ExportModal } from 'routes/views/components/export';
import { getGroupByOrgValue, getGroupByTagKey } from 'routes/views/utils/groupBy';
import { filterProviders, hasCurrentMonthData } from 'routes/views/utils/providers';
import {
  getRouteForQuery,
  handleCostTypeSelected,
  handleCurrencySelected,
  handleFilterAdded,
  handleFilterRemoved,
  handlePerPageSelect,
  handleSetPage,
  handleSort,
} from 'routes/views/utils/queryUpdate';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedAwsReportItems';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import type { CostTypes } from 'utils/costType';
import { getCostType } from 'utils/costType';
import { getCurrency } from 'utils/localStorage';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './awsDetails.styles';
import { DetailsHeader } from './detailsHeader';
import { DetailsTable } from './detailsTable';
import { DetailsToolbar } from './detailsToolbar';

interface AwsDetailsStateProps {
  costType: CostTypes;
  currency?: string;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  query: AwsQuery;
  report: AwsReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

interface AwsDetailsDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface AwsDetailsState {
  columns: any[];
  isAllSelected: boolean;
  isExportModalOpen: boolean;
  rows: any[];
  selectedItems: ComputedReportItem[];
}

type AwsDetailsOwnProps = RouterComponentProps & WrappedComponentProps;

type AwsDetailsProps = AwsDetailsStateProps & AwsDetailsOwnProps & AwsDetailsDispatchProps;

const baseQuery: AwsQuery = {
  delta: 'cost',
  filter: {
    limit: 10,
    offset: 0,
    resolution: 'monthly',
    time_scope_units: 'month',
    time_scope_value: -1,
  },
  exclude: {},
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
    isAllSelected: false,
    isExportModalOpen: false,
    rows: [],
    selectedItems: [],
  };
  public state: AwsDetailsState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleBulkSelected = this.handleBulkSelected.bind(this);
    this.handleExportModalClose = this.handleExportModalClose.bind(this);
    this.handleExportModalOpen = this.handleExportModalOpen.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
  }

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: AwsDetailsProps, prevState: AwsDetailsState) {
    const { report, reportError, reportQueryString, router } = this.props;
    const { selectedItems } = this.state;

    const newQuery = prevProps.reportQueryString !== reportQueryString;
    const noReport = !report && !reportError;
    const noLocation = !router.location.search;
    const newItems = prevState.selectedItems !== selectedItems;

    if (newQuery || noReport || noLocation || newItems) {
      this.updateReport();
    }
  }

  private getComputedItems = () => {
    const { query, report } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);

    const groupBy = (groupByTagKey as any) || groupById;

    return getUnsortedComputedReportItems({
      report,
      idKey: groupBy === orgUnitIdKey ? 'org_entities' : groupBy,
    });
  };

  private getExportModal = (computedItems: ComputedReportItem[]) => {
    const { query, report, reportQueryString } = this.props;
    const { isAllSelected, isExportModalOpen, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);
    const itemsTotal = report && report.meta ? report.meta.count : 0;

    // Omit items labeled 'no-project'
    const items = [];
    selectedItems.map(item => {
      if (!(item.label === `no-${groupById}` || item.label === `no-${groupByTagKey}`)) {
        items.push(item);
      }
    });
    return (
      <ExportModal
        count={isAllSelected ? itemsTotal : items.length}
        isAllItems={(isAllSelected || selectedItems.length === itemsTotal) && computedItems.length > 0}
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        isOpen={isExportModalOpen}
        items={items}
        onClose={this.handleExportModalClose}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
      />
    );
  };

  private getPagination = (isBottom: boolean = false) => {
    const { intl, query, router, report } = this.props;

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
        onPerPageSelect={(event, perPage) => handlePerPageSelect(query, router, perPage)}
        onSetPage={(event, pageNumber) => handleSetPage(query, router, report, pageNumber)}
        page={page}
        perPage={limit}
        titles={{
          paginationTitle: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.aws),
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
    const { isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);
    const groupByOrg = getGroupByOrgValue(query);

    return (
      <DetailsTable
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        groupByTagKey={groupByTagKey}
        groupByOrg={groupByOrg}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSelected={this.handleSelected}
        onSort={(sortType, isSortAscending) => handleSort(query, router, sortType, isSortAscending)}
        report={report}
        reportQueryString={reportQueryString}
        selectedItems={selectedItems}
      />
    );
  };

  private getToolbar = (computedItems: ComputedReportItem[]) => {
    const { query, router, report } = this.props;
    const { isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);
    const itemsTotal = report && report.meta ? report.meta.count : 0;

    return (
      <DetailsToolbar
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        isAllSelected={isAllSelected}
        isExportDisabled={computedItems.length === 0 || (!isAllSelected && selectedItems.length === 0)}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onBulkSelected={this.handleBulkSelected}
        onExportClicked={this.handleExportModalOpen}
        onFilterAdded={filter => handleFilterAdded(query, router, filter)}
        onFilterRemoved={filter => handleFilterRemoved(query, router, filter)}
        pagination={this.getPagination()}
        query={query}
        selectedItems={selectedItems}
      />
    );
  };

  private handleBulkSelected = (action: string) => {
    const { isAllSelected } = this.state;

    if (action === 'none') {
      this.setState({ isAllSelected: false, selectedItems: [] });
    } else if (action === 'page') {
      this.setState({
        isAllSelected: false,
        selectedItems: this.getComputedItems(),
      });
    } else if (action === 'all') {
      this.setState({ isAllSelected: !isAllSelected, selectedItems: [] });
    }
  };

  public handleExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  public handleExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  private handleGroupBySelected = groupBy => {
    const { query, router } = this.props;

    let groupByKey = groupBy;
    let value = '*';

    // Check for org units
    const index = groupBy.indexOf(orgUnitIdKey);
    if (index !== -1) {
      groupByKey = orgUnitIdKey.substring(0, orgUnitIdKey.length);
      value = groupBy.slice(orgUnitIdKey.length);
    }

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      // filter_by: undefined, // Preserve filter -- see https://issues.redhat.com/browse/COST-1090
      group_by: {
        [groupByKey]: value,
      },
      order_by: { cost: 'desc' },
    };
    this.setState({ isAllSelected: false, selectedItems: [] }, () => {
      router.navigate(getRouteForQuery(newQuery, router.location, true), { replace: true });
    });
  };

  private handleSelected = (items: ComputedReportItem[], isSelected: boolean = false) => {
    const { isAllSelected, selectedItems } = this.state;

    let newItems = [...(isAllSelected ? this.getComputedItems() : selectedItems)];
    if (items && items.length > 0) {
      if (isSelected) {
        items.map(item => newItems.push(item));
      } else {
        items.map(item => {
          newItems = newItems.filter(val => val.id !== item.id);
        });
      }
    }
    this.setState({ isAllSelected: false, selectedItems: newItems });
  };

  private updateReport = () => {
    const { fetchReport, query, reportQueryString, router } = this.props;
    if (!router.location.search) {
      router.navigate(
        getRouteForQuery(
          {
            exclude: query ? query.exclude : undefined,
            filter_by: query ? query.filter_by : undefined,
            group_by: query ? query.group_by : undefined,
            order_by: { cost: 'desc' },
          },
          router.location
        ),
        {
          replace: true,
        }
      );
    } else {
      fetchReport(reportPathsType, reportType, reportQueryString);
    }
  };

  public render() {
    const {
      costType,
      currency,
      intl,
      providers,
      providersFetchStatus,
      query,
      report,
      reportError,
      reportFetchStatus,
      router,
    } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const computedItems = this.getComputedItems();
    const title = intl.formatMessage(messages.awsDetailsTitle);

    // Note: Providers are fetched via the AccountSettings component used by all routes
    if (reportError) {
      return <NotAvailable title={title} />;
    } else if (providersFetchStatus === FetchStatus.inProgress) {
      return <Loading title={title} />;
    } else if (providersFetchStatus === FetchStatus.complete) {
      // API returns empy data array for no sources
      const noProviders = providers && providers.meta && providers.meta.count === 0;

      if (noProviders) {
        return <NoProviders providerType={ProviderType.aws} title={title} />;
      }
      if (!hasCurrentMonthData(providers)) {
        return <NoData title={title} />;
      }
    }
    return (
      <div style={styles.awsDetails}>
        <DetailsHeader
          costType={costType}
          currency={currency}
          groupBy={groupById}
          onCostTypeSelected={value => handleCostTypeSelected(query, router, value)}
          onCurrencySelected={value => handleCurrencySelected(query, router, value)}
          onGroupBySelected={this.handleGroupBySelected}
          report={report}
        />
        <div style={styles.content}>
          {this.getToolbar(computedItems)}
          {this.getExportModal(computedItems)}
          {reportFetchStatus === FetchStatus.inProgress ? (
            <Loading />
          ) : (
            <>
              <div style={styles.tableContainer}>{this.getTable()}</div>
              <div style={styles.paginationContainer}>
                <div style={styles.pagination}>{this.getPagination(true)}</div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AwsDetailsOwnProps, AwsDetailsStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<AwsQuery>(router.location.search);
  const costType = getCostType();
  const currency = featureFlagsSelectors.selectIsCurrencyFeatureEnabled(state) ? getCurrency() : undefined;
  const query = {
    delta: 'cost',
    filter: {
      ...baseQuery.filter,
      ...queryFromRoute.filter,
    },
    filter_by: queryFromRoute.filter_by || baseQuery.filter_by,
    exclude: queryFromRoute.exclude || baseQuery.exclude,
    group_by: queryFromRoute.group_by || baseQuery.group_by,
    order_by: queryFromRoute.order_by || baseQuery.order_by,
  };
  const reportQueryString = getQuery({
    ...query,
    cost_type: costType,
    currency,
  });
  const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    reportQueryString
  );

  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  return {
    costType,
    currency,
    providers: filterProviders(providers, ProviderType.aws),
    providersError,
    providersFetchStatus,
    query,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,

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

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(AwsDetails)));
