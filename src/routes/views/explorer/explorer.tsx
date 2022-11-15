import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
import { orgUnitIdKey, tagPrefix } from 'api/queries/query';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import type { Report } from 'api/reports/report';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { RouteComponentProps } from 'react-router-dom';
import { Loading } from 'routes/state/loading';
import { NoData } from 'routes/state/noData';
import { NoProviders } from 'routes/state/noProviders';
import { NotAvailable } from 'routes/state/notAvailable';
import { ExportModal } from 'routes/views/components/export';
import type { DateRangeType } from 'routes/views/utils/dateRange';
import { getDateRange, getDateRangeDefault } from 'routes/views/utils/dateRange';
import { getGroupByOrgValue, getGroupByTagKey } from 'routes/views/utils/groupBy';
import {
  getRouteForQuery,
  handleCostTypeSelected,
  handleCurrencySelected,
  handleFilterAdded,
  handleFilterRemoved,
  handlePerPageSelect,
  handleSetPage,
  handleSort,
} from 'routes/views/utils/history';
import { filterProviders, hasData } from 'routes/views/utils/providers';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedExplorerReportItems';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import type { CostTypes } from 'utils/costType';
import { getCostType } from 'utils/costType';
import { getCurrency } from 'utils/localStorage';
import {
  isAwsAvailable,
  isAzureAvailable,
  isGcpAvailable,
  isIbmAvailable,
  isOciAvailable,
  isOcpAvailable,
} from 'utils/userAccess';

import { styles } from './explorer.styles';
import { ExplorerChart } from './explorerChart';
import { ExplorerHeader } from './explorerHeader';
import { ExplorerTable } from './explorerTable';
import { ExplorerToolbar } from './explorerToolbar';
import {
  baseQuery,
  getComputedReportItemType,
  getComputedReportItemValueType,
  getGroupByDefault,
  getPerspectiveDefault,
  getReportPathsType,
  getReportType,
  PerspectiveType,
} from './explorerUtils';

interface ExplorerStateProps {
  awsProviders: Providers;
  azureProviders: Providers;
  ociProviders: Providers;
  costType?: CostTypes;
  currency?: string;
  dateRange: DateRangeType;
  gcpProviders: Providers;
  ibmProviders: Providers;
  ocpProviders: Providers;
  perspective: PerspectiveType;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
  query: Query;
  queryString: string;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

interface ExplorerDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface ExplorerState {
  columns: any[];
  isAllSelected: boolean;
  isExportModalOpen: boolean;
  rows: any[];
  selectedItems: ComputedReportItem[];
}

type ExplorerOwnProps = RouteComponentProps<void> & WrappedComponentProps;

type ExplorerProps = ExplorerStateProps & ExplorerOwnProps & ExplorerDispatchProps;

class Explorer extends React.Component<ExplorerProps> {
  protected defaultState: ExplorerState = {
    columns: [],
    isAllSelected: false,
    isExportModalOpen: false,
    rows: [],
    selectedItems: [],
  };
  public state: ExplorerState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleBulkSelected = this.handleBulkSelected.bind(this);
    this.handleExportModalClose = this.handleExportModalClose.bind(this);
    this.handleExportModalOpen = this.handleExportModalOpen.bind(this);
    this.handlePerspectiveClick = this.handlePerspectiveClick.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
  }

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: ExplorerProps, prevState: ExplorerState) {
    const { location, perspective, report, reportError, queryString } = this.props;
    const { selectedItems } = this.state;

    const newPerspective = prevProps.perspective !== perspective;
    const newQuery = prevProps.queryString !== queryString;
    const noReport = !report && !reportError;
    const noLocation = !location.search;
    const newItems = prevState.selectedItems !== selectedItems;

    if (newPerspective || newQuery || noReport || noLocation || newItems) {
      this.updateReport();
    }
  }

  private getComputedItems = () => {
    const { query, report } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByOrg = getGroupByOrgValue(query);
    const groupByTagKey = getGroupByTagKey(query);

    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: groupByTagKey ? groupByTagKey : groupByOrg ? 'org_entities' : groupById,
      isDateMap: false, // Don't use isDateMap here, so we can use a flattened data structure with row selection
    });
    return computedItems;
  };

  private getExportModal = (computedItems: ComputedReportItem[]) => {
    const { perspective, query, report } = this.props;
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
        query={query}
        reportPathsType={getReportPathsType(perspective)}
        resolution="daily"
        showTimeScope={false}
      />
    );
  };

  private getPagination = (isBottom: boolean = false) => {
    const { history, intl, query, report } = this.props;

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
        onPerPageSelect={(event, perPage) => handlePerPageSelect(history, query, perPage)}
        onSetPage={(event, pageNumber) => handleSetPage(history, query, report, pageNumber)}
        page={page}
        perPage={limit}
        titles={{
          paginationTitle: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.explorerTitle),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`exports-pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  private getTable = () => {
    const { history, perspective, query, report, reportFetchStatus } = this.props;
    const { isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);

    return (
      <ExplorerTable
        computedReportItemType={getComputedReportItemType(perspective)}
        computedReportItemValueType={getComputedReportItemValueType(perspective)}
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSelected={this.handleSelected}
        onSort={(sortType, isSortAscending, date: string) =>
          handleSort(history, query, sortType, isSortAscending, date)
        }
        perspective={perspective}
        query={query}
        report={report}
        selectedItems={selectedItems}
      />
    );
  };

  private getToolbar = (computedItems: ComputedReportItem[]) => {
    const { perspective, report } = this.props;
    const { isAllSelected, selectedItems } = this.state;

    const itemsTotal = report && report.meta ? report.meta.count : 0;

    return (
      <ExplorerToolbar
        isAllSelected={isAllSelected}
        isExportDisabled={computedItems.length === 0 || (!isAllSelected && selectedItems.length === 0)}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onBulkSelected={this.handleBulkSelected}
        onExportClicked={this.handleExportModalOpen}
        pagination={this.getPagination()}
        perspective={perspective}
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

  private handleExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  private handleExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  private handleGroupBySelected = groupBy => {
    const { history, query } = this.props;

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
      order_by: undefined, // Clear sort
    };
    this.setState({ isAllSelected: false, selectedItems: [] }, () => {
      history.replace(getRouteForQuery(history, newQuery));
    });
  };

  private handlePerspectiveClick = () => {
    this.setState({ isAllSelected: false, selectedItems: [] });
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

  private isAwsAvailable = () => {
    const { awsProviders, userAccess } = this.props;
    return isAwsAvailable(userAccess, awsProviders);
  };

  private isAzureAvailable = () => {
    const { azureProviders, userAccess } = this.props;
    return isAzureAvailable(userAccess, azureProviders);
  };

  private isOciAvailable = () => {
    const { ociProviders, userAccess } = this.props;
    return isOciAvailable(userAccess, ociProviders);
  };

  private isGcpAvailable = () => {
    const { gcpProviders, userAccess } = this.props;
    return isGcpAvailable(userAccess, gcpProviders);
  };

  private isIbmAvailable = () => {
    const { ibmProviders, userAccess } = this.props;
    return isIbmAvailable(userAccess, ibmProviders);
  };

  private isOcpAvailable = () => {
    const { ocpProviders, userAccess } = this.props;
    return isOcpAvailable(userAccess, ocpProviders);
  };

  private updateReport = () => {
    const { dateRange, fetchReport, history, location, perspective, query, queryString } = this.props;
    if (!location.search) {
      history.replace(
        getRouteForQuery(history, {
          exclude: query ? query.exclude : undefined,
          filter_by: query ? query.filter_by : undefined,
          group_by: query ? query.group_by : undefined,
          order_by: query ? query.order_by : undefined,
          dateRange, // Preserve date range
        })
      );
    } else if (perspective) {
      fetchReport(getReportPathsType(perspective), getReportType(perspective), queryString);
    }
  };

  public render() {
    const {
      awsProviders,
      azureProviders,
      ociProviders,
      costType,
      currency,
      gcpProviders,
      ibmProviders,
      history,
      intl,
      ocpProviders,
      providersFetchStatus,
      perspective,
      userAccessFetchStatus,
      query,
      report,
      reportError,
      reportFetchStatus,
    } = this.props;

    // Note: No need to test OCP on cloud here, since that requires at least one provider
    const noAwsProviders = !this.isAwsAvailable() && providersFetchStatus === FetchStatus.complete;
    const noAzureProviders = !this.isAzureAvailable() && providersFetchStatus === FetchStatus.complete;
    const noGcpProviders = !this.isGcpAvailable() && providersFetchStatus === FetchStatus.complete;
    const noIbmProviders = !this.isIbmAvailable() && providersFetchStatus === FetchStatus.complete;
    const noOcpProviders = !this.isOcpAvailable() && providersFetchStatus === FetchStatus.complete;
    const noOciProviders = !this.isOciAvailable() && providersFetchStatus === FetchStatus.complete;
    const noProviders =
      noAwsProviders && noAzureProviders && noGcpProviders && noIbmProviders && noOcpProviders && noOciProviders;

    const isLoading =
      providersFetchStatus === FetchStatus.inProgress || userAccessFetchStatus === FetchStatus.inProgress;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);
    const computedItems = this.getComputedItems();
    const itemsTotal = report && report.meta ? report.meta.count : 0;
    const title = intl.formatMessage(messages.explorerTitle);

    // Note: Providers are fetched via the AccountSettings component used by all routes
    if (reportError) {
      return <NotAvailable title={title} />;
    } else if (isLoading) {
      return <Loading title={title} />;
    } else if (noProviders) {
      return <NoProviders title={title} />;
    } else if (
      !(
        hasData(awsProviders) ||
        hasData(azureProviders) ||
        hasData(ociProviders) ||
        hasData(gcpProviders) ||
        hasData(ibmProviders) ||
        hasData(ocpProviders)
      )
    ) {
      return <NoData title={title} />;
    }

    return (
      <div style={styles.explorer}>
        <ExplorerHeader
          costType={costType}
          currency={currency}
          groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
          onCostTypeSelected={value => handleCostTypeSelected(history, query, value)}
          onCurrencySelected={value => handleCurrencySelected(history, query, value)}
          onFilterAdded={filter => handleFilterAdded(history, query, filter)}
          onFilterRemoved={filter => handleFilterRemoved(history, query, filter)}
          onGroupBySelected={this.handleGroupBySelected}
          onPerspectiveClicked={this.handlePerspectiveClick}
          perspective={perspective}
        />
        {itemsTotal > 0 && (
          <div style={styles.chartContent}>
            <div style={styles.chartContainer}>
              <ExplorerChart
                costType={costType}
                currency={currency}
                computedReportItemType={getComputedReportItemType(perspective)}
                computedReportItemValueType={getComputedReportItemValueType(perspective)}
                perspective={perspective}
              />
            </div>
          </div>
        )}
        <div style={styles.tableContent}>
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
const mapStateToProps = createMapStateToProps<ExplorerOwnProps, ExplorerStateProps>((state, props) => {
  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  const awsProviders = filterProviders(providers, ProviderType.aws);
  const azureProviders = filterProviders(providers, ProviderType.azure);
  const ociProviders = filterProviders(providers, ProviderType.oci);
  const gcpProviders = filterProviders(providers, ProviderType.gcp);
  const ibmProviders = filterProviders(providers, ProviderType.ibm);
  const ocpProviders = filterProviders(providers, ProviderType.ocp);

  const userAccessQueryString = getUserAccessQuery(userAccessQuery);
  const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
  const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
  const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.all,
    userAccessQueryString
  );

  // Cost Report
  const queryFromRoute = parseQuery<Query>(location.search);
  const dateRange = getDateRangeDefault(queryFromRoute);
  const { end_date, start_date } = getDateRange(dateRange);

  const perspective = getPerspectiveDefault({
    awsProviders,
    azureProviders,
    ociProviders,
    gcpProviders,
    ibmProviders,
    ocpProviders,
    queryFromRoute,
    userAccess,
  });

  // Ensure group_by key is not undefined
  let groupBy = queryFromRoute.group_by;
  if (!groupBy && perspective) {
    groupBy = { [getGroupByDefault(perspective)]: '*' };
  }

  const isCostTypeFeatureEnabled = featureFlagsSelectors.selectIsCostTypeFeatureEnabled(state);
  const costType =
    perspective === PerspectiveType.aws || (perspective === PerspectiveType.awsOcp && isCostTypeFeatureEnabled)
      ? getCostType()
      : undefined;
  const currency = featureFlagsSelectors.selectIsCurrencyFeatureEnabled(state) ? getCurrency() : undefined;

  const query = {
    filter: {
      ...baseQuery.filter,
      ...queryFromRoute.filter,
    },
    filter_by: queryFromRoute.filter_by || baseQuery.filter_by,
    exclude: queryFromRoute.exclude || baseQuery.exclude,
    group_by: groupBy,
    order_by: queryFromRoute.order_by,
    perspective,
    dateRange,
  };
  const queryString = getQuery({
    ...query,
    cost_type: costType,
    currency,
    perspective: undefined,
    dateRange: undefined,
    end_date,
    start_date,
  });

  const reportPathsType = getReportPathsType(perspective);
  const reportType = getReportType(perspective);

  const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);

  return {
    awsProviders,
    azureProviders,
    costType,
    currency,
    dateRange,
    gcpProviders,
    ibmProviders,
    ociProviders,
    ocpProviders,
    perspective,
    providers,
    providersError,
    providersFetchStatus,
    providersQueryString,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const mapDispatchToProps: ExplorerDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Explorer));
