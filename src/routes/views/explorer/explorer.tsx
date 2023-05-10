import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
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
import { Loading } from 'routes/state/loading';
import { NoData } from 'routes/state/noData';
import { NoProviders } from 'routes/state/noProviders';
import { NotAvailable } from 'routes/state/notAvailable';
import { ComputedReportItemValueType } from 'routes/views/components/charts/common';
import { ExportModal } from 'routes/views/components/export';
import type { DateRangeType } from 'routes/views/utils/dateRange';
import { getDateRangeFromQuery, getDateRangeTypeDefault } from 'routes/views/utils/dateRange';
import { getGroupByCostCategory, getGroupById, getGroupByOrgValue, getGroupByTagKey } from 'routes/views/utils/groupBy';
import {
  handleOnCostDistributionSelected,
  handleOnCostTypeSelected,
  handleOnCurrencySelected,
  handleOnFilterAdded,
  handleOnFilterRemoved,
  handleOnPerPageSelect,
  handleOnSetPage,
  handleOnSort,
} from 'routes/views/utils/navHandles';
import { filterProviders, hasData } from 'routes/views/utils/providers';
import { getRouteForQuery } from 'routes/views/utils/query';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedExplorerReportItems';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { getCostDistribution, getCostType, getCurrency } from 'utils/localStorage';
import { awsCategoryPrefix, noPrefix, orgUnitIdKey, tagPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';
import {
  isAwsAvailable,
  isAzureAvailable,
  isGcpAvailable,
  isIbmAvailable,
  isOciAvailable,
  isOcpAvailable,
  isRhelAvailable,
} from 'utils/userAccess';

import { styles } from './explorer.styles';
import { ExplorerChart } from './explorerChart';
import { ExplorerHeader } from './explorerHeader';
import { ExplorerTable } from './explorerTable';
import { ExplorerToolbar } from './explorerToolbar';
import {
  baseQuery,
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
  costDistribution?: string;
  costType?: string;
  currency?: string;
  dateRangeType: DateRangeType;
  gcpProviders: Providers;
  ibmProviders: Providers;
  isFinsightsFeatureEnabled?: boolean;
  ocpProviders: Providers;
  perspective: PerspectiveType;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
  query: Query;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
  rhelProviders: Providers;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

interface ExplorerDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface ExplorerState {
  columns?: any[];
  endDate?: Date;
  isAllSelected?: boolean;
  isExportModalOpen?: boolean;
  rows?: any[];
  selectedItems?: ComputedReportItem[];
  startDate?: Date;
}

type ExplorerOwnProps = RouterComponentProps & WrappedComponentProps;

type ExplorerProps = ExplorerStateProps & ExplorerOwnProps & ExplorerDispatchProps;

class Explorer extends React.Component<ExplorerProps, ExplorerState> {
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
    const { perspective, report, reportError, reportQueryString, router } = this.props;
    const { selectedItems } = this.state;

    const newPerspective = prevProps.perspective !== perspective;
    const newQuery = prevProps.reportQueryString !== reportQueryString;
    const noReport = !report && !reportError;
    const noLocation = !router.location.search;
    const newItems = prevState.selectedItems !== selectedItems;

    if (newPerspective || newQuery || noReport || noLocation || newItems) {
      this.updateReport();
    }
  }

  private getComputedItems = () => {
    const { query, report } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByCostCategory = getGroupByCostCategory(query);
    const groupByOrg = getGroupByOrgValue(query);
    const groupByTagKey = getGroupByTagKey(query);

    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: groupByCostCategory
        ? groupByCostCategory
        : groupByTagKey
        ? groupByTagKey
        : groupByOrg
        ? 'org_entities'
        : groupById,
      isDateMap: false, // Don't use isDateMap here, so we can use a flattened data structure with row selection
    });
    return computedItems;
  };

  private getExportModal = (computedItems: ComputedReportItem[]) => {
    const { perspective, query, report, reportQueryString } = this.props;
    const { isAllSelected, isExportModalOpen, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByCostCategory = getGroupByCostCategory(query);
    const groupByTagKey = getGroupByTagKey(query);
    const itemsTotal = report && report.meta ? report.meta.count : 0;

    // Omit items labeled 'no-project'
    const items = [];
    selectedItems.map(item => {
      if (
        !(item.label === `${noPrefix}${groupById}` || item.label === `${noPrefix}${groupByCostCategory}`) ||
        item.label === `${noPrefix}${groupByTagKey}`
      ) {
        items.push(item);
      }
    });
    return (
      <ExportModal
        count={isAllSelected ? itemsTotal : items.length}
        isAllItems={(isAllSelected || selectedItems.length === itemsTotal) && computedItems.length > 0}
        groupBy={
          groupByCostCategory
            ? `${awsCategoryPrefix}${groupByCostCategory}`
            : groupByTagKey
            ? `${tagPrefix}${groupByTagKey}`
            : groupById
        }
        isOpen={isExportModalOpen}
        items={items}
        onClose={this.handleExportModalClose}
        reportPathsType={getReportPathsType(perspective)}
        reportQueryString={reportQueryString}
        resolution="daily"
        showTimeScope={false}
      />
    );
  };

  private getPagination = (isDisabled = false, isBottom = false) => {
    const { intl, query, report, router } = this.props;

    const count = report && report.meta ? report.meta.count : 0;
    const limit =
      report && report.meta && report.meta.filter && report.meta.filter.limit
        ? report.meta.filter.limit
        : baseQuery.filter.limit;
    const offset =
      report && report.meta && report.meta.filter && report.meta.filter.offset
        ? report.meta.filter.offset
        : baseQuery.filter.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
        itemCount={count}
        onPerPageSelect={(event, perPage) => handleOnPerPageSelect(query, router, perPage)}
        onSetPage={(event, pageNumber) => handleOnSetPage(query, router, report, pageNumber)}
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
    const { costDistribution, perspective, query, report, reportFetchStatus, router } = this.props;
    const { isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByCostCategory = getGroupByCostCategory(query);
    const groupByTagKey = getGroupByTagKey(query);
    const groupByOrg = getGroupByOrgValue(query);

    return (
      <ExplorerTable
        costDistribution={costDistribution}
        groupBy={
          groupByCostCategory
            ? `${awsCategoryPrefix}${groupByCostCategory}`
            : groupByTagKey
            ? `${tagPrefix}${groupByTagKey}`
            : groupById
        }
        groupByCostCategory={groupByCostCategory}
        groupByTagKey={groupByTagKey}
        groupByOrg={groupByOrg}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSelected={this.handleSelected}
        onSort={(sortType, isSortAscending, date: string) =>
          handleOnSort(query, router, sortType, isSortAscending, date)
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

    const isDisabled = computedItems.length === 0;
    const itemsTotal = report && report.meta ? report.meta.count : 0;

    return (
      <ExplorerToolbar
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        isExportDisabled={isDisabled || (!isAllSelected && selectedItems.length === 0)}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onBulkSelected={this.handleBulkSelected}
        onExportClicked={this.handleExportModalOpen}
        pagination={this.getPagination(isDisabled)}
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

  private handleDatePickerSelected = (startDate: Date, endDate: Date) => {
    const { query, router } = this.props;

    this.setState({ startDate, endDate }, () => {
      router.navigate(getRouteForQuery(query, router.location, true), { replace: true });
    });
  };

  private handleExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  private handleExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  private handleGroupBySelected = groupBy => {
    const { query, router } = this.props;

    let groupByKey = groupBy;
    let value = '*';

    // Check for org units
    const index = groupBy && groupBy.indexOf(orgUnitIdKey);
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
      router.navigate(getRouteForQuery(newQuery, router.location, true), { replace: true });
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

  private isRhelAvailable = () => {
    const { isFinsightsFeatureEnabled, rhelProviders, userAccess } = this.props;
    return isFinsightsFeatureEnabled && isRhelAvailable(userAccess, rhelProviders);
  };

  private updateReport = () => {
    const { fetchReport, perspective, reportQueryString } = this.props;
    fetchReport(getReportPathsType(perspective), getReportType(perspective), reportQueryString);
  };

  public render() {
    const {
      awsProviders,
      azureProviders,
      ociProviders,
      costDistribution,
      costType,
      currency,
      gcpProviders,
      ibmProviders,
      intl,
      ocpProviders,
      providersFetchStatus,
      perspective,
      userAccessFetchStatus,
      query,
      report,
      reportError,
      reportFetchStatus,
      router,
    } = this.props;

    // Note: No need to test OCP on cloud here, since that requires at least one provider
    const noAwsProviders = !this.isAwsAvailable() && providersFetchStatus === FetchStatus.complete;
    const noAzureProviders = !this.isAzureAvailable() && providersFetchStatus === FetchStatus.complete;
    const noGcpProviders = !this.isGcpAvailable() && providersFetchStatus === FetchStatus.complete;
    const noIbmProviders = !this.isIbmAvailable() && providersFetchStatus === FetchStatus.complete;
    const noOcpProviders = !this.isOcpAvailable() && providersFetchStatus === FetchStatus.complete;
    const noOciProviders = !this.isOciAvailable() && providersFetchStatus === FetchStatus.complete;
    const noRhelProviders = !this.isRhelAvailable() && providersFetchStatus === FetchStatus.complete;
    const noProviders =
      noAwsProviders &&
      noAzureProviders &&
      noGcpProviders &&
      noIbmProviders &&
      noOciProviders &&
      noOcpProviders &&
      noRhelProviders;

    const isLoading =
      providersFetchStatus === FetchStatus.inProgress || userAccessFetchStatus === FetchStatus.inProgress;

    const computedItems = this.getComputedItems();
    const isDisabled = computedItems.length === 0;
    const itemsTotal = report && report.meta ? report.meta.count : 0;
    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByCostCategory = getGroupByCostCategory(query);
    const groupByTagKey = getGroupByTagKey(query);
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
          costDistribution={costDistribution}
          costType={costType}
          currency={currency}
          groupBy={
            groupByCostCategory
              ? `${awsCategoryPrefix}${groupByCostCategory}`
              : groupByTagKey
              ? `${tagPrefix}${groupByTagKey}`
              : groupById
          }
          onCostDistributionSelected={() => handleOnCostDistributionSelected(query, router)}
          onCostTypeSelected={() => handleOnCostTypeSelected(query, router)}
          onCurrencySelected={() => handleOnCurrencySelected(query, router)}
          onDatePickerSelected={this.handleDatePickerSelected}
          onFilterAdded={filter => handleOnFilterAdded(query, router, filter)}
          onFilterRemoved={filter => handleOnFilterRemoved(query, router, filter)}
          onGroupBySelected={this.handleGroupBySelected}
          onPerspectiveClicked={this.handlePerspectiveClick}
          perspective={perspective}
          report={report}
        />
        {itemsTotal > 0 && (
          <div style={styles.chartContent}>
            <div style={styles.chartContainer}>
              <ExplorerChart
                costDistribution={costDistribution}
                costType={costType}
                currency={currency}
                groupBy={
                  groupByCostCategory
                    ? `${awsCategoryPrefix}${groupByCostCategory}`
                    : groupByTagKey
                    ? `${tagPrefix}${groupByTagKey}`
                    : groupById
                }
                perspective={perspective}
              />
            </div>
          </div>
        )}
        <div style={styles.tableContent}>
          <div style={styles.toolbarContainer}>{this.getToolbar(computedItems)}</div>
          {this.getExportModal(computedItems)}
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
const mapStateToProps = createMapStateToProps<ExplorerOwnProps, ExplorerStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);

  // Get roviders first
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
  const rhelProviders = filterProviders(providers, ProviderType.rhel);

  const userAccessQueryString = getUserAccessQuery(userAccessQuery);
  const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
  const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
  const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.all,
    userAccessQueryString
  );

  // Cost Report
  const dateRangeType = getDateRangeTypeDefault(queryFromRoute);
  const { end_date, start_date } = getDateRangeFromQuery(queryFromRoute);

  const perspective = getPerspectiveDefault({
    awsProviders,
    azureProviders,
    ociProviders,
    gcpProviders,
    ibmProviders,
    ocpProviders,
    queryFromRoute,
    rhelProviders,
    userAccess,
  });

  const groupBy = queryFromRoute.group_by ? getGroupById(queryFromRoute) : getGroupByDefault(perspective);
  const group_by = queryFromRoute.group_by ? queryFromRoute.group_by : { [groupBy]: '*' }; // Ensure group_by key is not undefined

  const isCostDistributionFeatureEnabled = featureFlagsSelectors.selectIsCostDistributionFeatureEnabled(state);
  const costDistribution =
    perspective === PerspectiveType.ocp && groupBy === 'project' && isCostDistributionFeatureEnabled
      ? getCostDistribution()
      : undefined;
  const costType =
    perspective === PerspectiveType.aws || perspective === PerspectiveType.awsOcp ? getCostType() : undefined;
  const currency = getCurrency();

  const query: any = {
    ...baseQuery,
    ...(costDistribution === ComputedReportItemValueType.distributed && {
      order_by: {
        distributed_cost: 'desc',
      },
    }),
    ...queryFromRoute,
    group_by,
  };
  const reportQuery = {
    cost_type: costType,
    currency,
    end_date,
    exclude: query.exclude,
    filter: query.filter,
    filter_by: query.filter_by,
    group_by,
    order_by: query.order_by,
    start_date,
  };

  const reportPathsType = getReportPathsType(perspective);
  const reportType = getReportType(perspective);

  const reportQueryString = getQuery(reportQuery);
  const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    reportQueryString
  );

  return {
    awsProviders,
    azureProviders,
    costDistribution,
    costType,
    currency,
    dateRangeType,
    gcpProviders,
    ibmProviders,
    isFinsightsFeatureEnabled: featureFlagsSelectors.selectIsFinsightsFeatureEnabled(state),
    ociProviders,
    ocpProviders,
    perspective,
    providers,
    providersError,
    providersFetchStatus,
    providersQueryString,
    query,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
    rhelProviders,
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const mapDispatchToProps: ExplorerDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Explorer)));
