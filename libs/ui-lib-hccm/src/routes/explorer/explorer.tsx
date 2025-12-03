import type { Providers } from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import { getUserAccessQuery } from '@koku-ui/api/queries/userAccessQuery';
import type { Report } from '@koku-ui/api/reports/report';
import { ReportType } from '@koku-ui/api/reports/report';
import type { UserAccess } from '@koku-ui/api/userAccess';
import { UserAccessType } from '@koku-ui/api/userAccess';
import messages from '@koku-ui/i18n/locales/messages';
import {
  Alert,
  Card,
  CardBody,
  Grid,
  GridItem,
  PageSection,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps, FetchStatus } from '../../store/common';
import { providersQuery, providersSelectors } from '../../store/providers';
import { reportActions, reportSelectors } from '../../store/reports';
import { userAccessQuery, userAccessSelectors } from '../../store/userAccess';
import { getSinceDateRangeString } from '../../utils/dates';
import { awsCategoryPrefix, noPrefix, orgUnitIdKey, tagPrefix } from '../../utils/props';
import type { RouterComponentProps } from '../../utils/router';
import { withRouter } from '../../utils/router';
import { getCostDistribution, getCostType, getCurrency } from '../../utils/sessionStorage';
import { isAwsAvailable, isAzureAvailable, isGcpAvailable, isOcpAvailable } from '../../utils/userAccess';
import { ComputedReportItemValueType } from '../components/charts/common';
import { ExportModal } from '../components/export';
import { Loading } from '../components/page/loading';
import { NoData } from '../components/page/noData';
import { NoProviders } from '../components/page/noProviders';
import { NotAvailable } from '../components/page/notAvailable';
import { LoadingState } from '../components/state/loadingState';
import { ProviderStatus } from '../details/components/providerStatus';
import { getIdKeyForGroupBy } from '../utils/computedReport/getComputedExplorerReportItems';
import type { ComputedReportItem } from '../utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from '../utils/computedReport/getComputedReportItems';
import { DateRangeType, getDateRangeFromQuery } from '../utils/dateRange';
import { getGroupByCostCategory, getGroupById, getGroupByOrgValue, getGroupByTagKey } from '../utils/groupBy';
import { filterProviders, hasData } from '../utils/providers';
import { getRouteForQuery } from '../utils/query';
import {
  handleOnCostDistributionSelect,
  handleOnCostTypeSelect,
  handleOnCurrencySelect,
  handleOnFilterAdded,
  handleOnFilterRemoved,
  handleOnPerPageSelect,
  handleOnSetPage,
  handleOnSort,
} from '../utils/queryNavigate';
import { styles } from './explorer.styles';
import { ExplorerChart } from './explorerChart';
import { ExplorerHeader } from './explorerHeader';
import { ExplorerTable } from './explorerTable';
import { ExplorerToolbar } from './explorerToolbar';
import {
  baseQuery,
  getGroupByDefault,
  getIsDataAvailable,
  getPerspectiveDefault,
  getReportPathsType,
  getReportType,
  PerspectiveType,
} from './explorerUtils';

interface ExplorerStateProps {
  awsProviders: Providers;
  azureProviders: Providers;
  costDistribution?: string;
  costType?: string;
  currency?: string;
  dateRangeType: DateRangeType;
  endDate?: Date;
  gcpProviders: Providers;
  isCurrentMonthData?: boolean;
  isDataAvailable?: boolean;
  isFinsightsToggleEnabled?: boolean;
  isPreviousMonthData?: boolean;
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
  startDate?: Date;
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
  isAllSelected?: boolean;
  isExportModalOpen?: boolean;
  rows?: any[];
  selectedItems?: ComputedReportItem[];
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

  private getEmptyProviderState = () => {
    const { perspective } = this.props;

    let providerType;
    switch (perspective) {
      case PerspectiveType.aws:
      case PerspectiveType.awsOcp:
        providerType = ProviderType.aws;
        break;
      case PerspectiveType.azure:
      case PerspectiveType.azureOcp:
        providerType = ProviderType.azure;
        break;
      case PerspectiveType.gcp:
      case PerspectiveType.gcpOcp:
        providerType = ProviderType.gcp;
        break;
      case PerspectiveType.ocp:
      case PerspectiveType.ocpCloud:
        providerType = ProviderType.ocp;
        break;
    }

    return <NoData detailsComponent={<ProviderStatus providerType={providerType} />} />;
  };

  private getExportModal = (computedItems: ComputedReportItem[]) => {
    const { perspective, query, report, reportQueryString } = this.props;
    const { isAllSelected, isExportModalOpen, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByCostCategory = getGroupByCostCategory(query);
    const groupByTagKey = getGroupByTagKey(query);
    const itemsTotal = report?.meta ? report.meta.count : 0;

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
        onClose={this.handleOnExportModalClose}
        reportPathsType={getReportPathsType(perspective)}
        reportQueryString={reportQueryString}
        reportType={ReportType.cost}
        resolution="daily"
      />
    );
  };

  private getPagination = (isDisabled = false, isBottom = false) => {
    const { intl, query, report, router } = this.props;

    const count = report?.meta ? report.meta.count : 0;
    const limit = report?.meta?.filter?.limit ? report.meta.filter.limit : baseQuery.filter.limit;
    const offset = report?.meta?.filter?.offset ? report.meta.filter.offset : baseQuery.filter.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
        itemCount={count}
        menuAppendTo={document.body} // Page scroll workaround https://issues.redhat.com/browse/COST-5320
        onPerPageSelect={(event, perPage) => handleOnPerPageSelect(query, router, perPage)}
        onSetPage={(event, pageNumber) => handleOnSetPage(query, router, report, pageNumber)}
        page={page}
        perPage={limit}
        titles={{
          paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.explorerTitle),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  private getTable = () => {
    const { costDistribution, endDate, perspective, query, report, reportFetchStatus, router, startDate } = this.props;
    const { isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByCostCategory = getGroupByCostCategory(query);
    const groupByTagKey = getGroupByTagKey(query);
    const groupByOrg = getGroupByOrgValue(query);

    return (
      <ExplorerTable
        costDistribution={costDistribution}
        endDate={endDate}
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
        onSelect={this.handleOnSelect}
        onSort={(sortType, isSortAscending, date: string) =>
          handleOnSort(query, router, sortType, isSortAscending, date)
        }
        perspective={perspective}
        query={query}
        report={report}
        selectedItems={selectedItems}
        startDate={startDate}
      />
    );
  };

  private getToolbar = (computedItems: ComputedReportItem[]) => {
    const { perspective, report } = this.props;
    const { isAllSelected, selectedItems } = this.state;

    const isDisabled = computedItems.length === 0;
    const itemsTotal = report?.meta ? report.meta.count : 0;

    return (
      <ExplorerToolbar
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        isExportDisabled={isDisabled || (!isAllSelected && selectedItems.length === 0)}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onBulkSelect={this.handleOnBulkSelect}
        onExportClicked={this.handleOnExportModalOpen}
        pagination={this.getPagination(isDisabled)}
        perspective={perspective}
        selectedItems={selectedItems}
      />
    );
  };

  private handleOnBulkSelect = (action: string) => {
    const { isAllSelected, selectedItems } = this.state;

    if (action === 'none') {
      this.setState({ isAllSelected: false, selectedItems: [] });
    } else if (action === 'page') {
      const newSelectedItems = [...selectedItems];
      this.getComputedItems().map(val => {
        if (!newSelectedItems.find(item => item.id === val.id)) {
          newSelectedItems.push(val);
        }
      });
      this.setState({
        isAllSelected: false,
        selectedItems: newSelectedItems,
      });
    } else if (action === 'all') {
      this.setState({ isAllSelected: !isAllSelected, selectedItems: [] });
    }
  };

  private handleOnDateRangeSelect = (dateRangeType: string) => {
    const { query, router } = this.props;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      dateRangeType,
      start_date: undefined,
      end_date: undefined,
    };
    router.navigate(getRouteForQuery(newQuery, router.location, true), { replace: true });
  };

  private handleOnExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  private handleOnExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  private handleOnGroupBySelect = groupBy => {
    const { query, router } = this.props;

    let groupByKey = groupBy;
    let value = '*';

    // Check for org units
    const index = groupBy?.indexOf(orgUnitIdKey);
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

  private handleOnPerspectiveClick = () => {
    this.setState({ isAllSelected: false, selectedItems: [] });
  };

  private handleOnSelect = (items: ComputedReportItem[], isSelected: boolean = false) => {
    const { isAllSelected, selectedItems } = this.state;

    let newItems = [...(isAllSelected ? this.getComputedItems() : selectedItems)];
    if (items?.length > 0) {
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

  private isGcpAvailable = () => {
    const { gcpProviders, userAccess } = this.props;
    return isGcpAvailable(userAccess, gcpProviders);
  };

  private isOcpAvailable = () => {
    const { ocpProviders, userAccess } = this.props;
    return isOcpAvailable(userAccess, ocpProviders);
  };

  private updateReport = () => {
    const { fetchReport, perspective, reportQueryString } = this.props;
    if (perspective) {
      fetchReport(getReportPathsType(perspective), getReportType(perspective), reportQueryString);
    }
  };

  public render() {
    const {
      awsProviders,
      azureProviders,
      costDistribution,
      costType,
      currency,
      dateRangeType,
      endDate,
      gcpProviders,
      intl,
      isCurrentMonthData,
      isDataAvailable,
      isPreviousMonthData,
      ocpProviders,
      providersFetchStatus,
      perspective,
      userAccessFetchStatus,
      query,
      report,
      reportError,
      reportFetchStatus,
      router,
      startDate,
    } = this.props;

    // Note: No need to test OCP on cloud here, since that requires at least one provider
    const noAwsProviders = !this.isAwsAvailable() && providersFetchStatus === FetchStatus.complete;
    const noAzureProviders = !this.isAzureAvailable() && providersFetchStatus === FetchStatus.complete;
    const noGcpProviders = !this.isGcpAvailable() && providersFetchStatus === FetchStatus.complete;
    const noOcpProviders = !this.isOcpAvailable() && providersFetchStatus === FetchStatus.complete;
    const noProviders = noAwsProviders && noAzureProviders && noGcpProviders && noOcpProviders;

    const isLoading =
      providersFetchStatus === FetchStatus.inProgress || userAccessFetchStatus === FetchStatus.inProgress;

    const computedItems = this.getComputedItems();
    const isDisabled = computedItems.length === 0;
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
      return <NoProviders />;
    } else if (!(hasData(awsProviders) || hasData(azureProviders) || hasData(gcpProviders) || hasData(ocpProviders))) {
      return <NoData title={title} />;
    }

    const isDateRangeSelected = query.dateRangeType !== undefined;

    return (
      <>
        <PageSection style={styles.headerContainer}>
          <ExplorerHeader
            costDistribution={costDistribution}
            costType={costType}
            currency={currency}
            dateRangeType={dateRangeType}
            endDate={endDate}
            groupBy={
              groupByCostCategory
                ? `${awsCategoryPrefix}${groupByCostCategory}`
                : groupByTagKey
                  ? `${tagPrefix}${groupByTagKey}`
                  : groupById
            }
            isCurrentMonthData={isCurrentMonthData}
            isPreviousMonthData={isPreviousMonthData}
            onCostDistributionSelect={() => handleOnCostDistributionSelect(query, router)}
            onCostTypeSelect={() => handleOnCostTypeSelect(query, router)}
            onCurrencySelect={() => handleOnCurrencySelect(query, router)}
            onDateRangeSelect={this.handleOnDateRangeSelect}
            onFilterAdded={filter => handleOnFilterAdded(query, router, filter)}
            onFilterRemoved={filter => handleOnFilterRemoved(query, router, filter)}
            onGroupBySelect={this.handleOnGroupBySelect}
            onPerspectiveClicked={this.handleOnPerspectiveClick}
            perspective={perspective}
            report={report}
            startDate={startDate}
          />
        </PageSection>
        <PageSection>
          {!isDataAvailable ? (
            this.getEmptyProviderState()
          ) : (
            <Grid hasGutter>
              <GridItem sm={12}>
                {!isCurrentMonthData && !isDateRangeSelected && dateRangeType === DateRangeType.previousMonth && (
                  <Alert
                    isInline
                    style={styles.alert}
                    title={intl.formatMessage(messages.noCurrentData, {
                      dateRange: getSinceDateRangeString(),
                    })}
                    variant="info"
                  />
                )}
                <Card>
                  <CardBody>
                    <ExplorerChart
                      costDistribution={costDistribution}
                      costType={costType}
                      currency={currency}
                      dateRangeType={dateRangeType}
                      endDate={endDate}
                      groupBy={
                        groupByCostCategory
                          ? `${awsCategoryPrefix}${groupByCostCategory}`
                          : groupByTagKey
                            ? `${tagPrefix}${groupByTagKey}`
                            : groupById
                      }
                      perspective={perspective}
                      startDate={startDate}
                    />
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem sm={12}>
                <Card>
                  <CardBody>
                    {this.getToolbar(computedItems)}
                    {this.getExportModal(computedItems)}
                    {reportFetchStatus === FetchStatus.inProgress ? (
                      <LoadingState />
                    ) : (
                      <>
                        {this.getTable()}
                        <div style={styles.paginationContainer}>{this.getPagination(isDisabled, true)}</div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          )}
        </PageSection>
      </>
    );
  }
}

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
  const gcpProviders = filterProviders(providers, ProviderType.gcp);
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
  const perspective = getPerspectiveDefault({
    awsProviders,
    azureProviders,
    gcpProviders,
    ocpProviders,
    queryFromRoute,
    userAccess,
  });

  const groupBy = queryFromRoute.group_by ? getGroupById(queryFromRoute) : getGroupByDefault(perspective);
  const group_by = queryFromRoute.group_by ? queryFromRoute.group_by : { [groupBy]: '*' }; // Ensure group_by key is not undefined

  const costDistribution =
    perspective === PerspectiveType.ocp && groupBy === 'project' ? getCostDistribution() : undefined;
  const costType =
    perspective === PerspectiveType.aws || perspective === PerspectiveType.awsOcp ? getCostType() : undefined;
  const currency = getCurrency();

  // Fetch based on time scope
  const { isCurrentMonthData, isDataAvailable, isPreviousMonthData } = getIsDataAvailable({
    awsProviders,
    azureProviders,
    gcpProviders,
    ocpProviders,
    perspective,
  });

  const { dateRangeType, end_date, start_date } = getDateRangeFromQuery(queryFromRoute, !isCurrentMonthData);

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
    endDate: end_date,
    gcpProviders,
    isCurrentMonthData,
    isDataAvailable,
    isPreviousMonthData,
    ocpProviders,
    perspective,
    providers,
    providersError,
    providersFetchStatus,
    providersQueryString,
    query,
    startDate: start_date,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
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
