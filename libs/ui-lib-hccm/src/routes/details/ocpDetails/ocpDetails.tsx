import type { Providers } from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';
import type { OcpQuery } from '@koku-ui/api/queries/ocpQuery';
import { getQuery, parseQuery } from '@koku-ui/api/queries/ocpQuery';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import type { OcpReport } from '@koku-ui/api/reports/ocpReports';
import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import {
  Alert,
  AlertActionCloseButton,
  AlertActionLink,
  Card,
  CardBody,
  PageSection,
  Pagination,
  PaginationVariant,
} from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import { cloneDeep } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { routes } from '../../../routes';
import { createMapStateToProps, FetchStatus } from '../../../store/common';
import { providersQuery, providersSelectors } from '../../../store/providers';
import { reportActions, reportSelectors } from '../../../store/reports';
import { uiActions } from '../../../store/ui';
import type { openProvidersModal } from '../../../store/ui/uiActions';
import { getSinceDateRangeString } from '../../../utils/dates';
import { formatPath } from '../../../utils/paths';
import { noPrefix, platformCategoryKey, tagPrefix } from '../../../utils/props';
import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import {
  deleteOperatorAvailable,
  getCostDistribution,
  getCurrency,
  isOperatorAvailableValid,
  setOperatorAvailable,
} from '../../../utils/sessionStorage';
import { ComputedReportItemValueType } from '../../components/charts/common';
import { ExportModal } from '../../components/export';
import { Loading } from '../../components/page/loading';
import { NoData } from '../../components/page/noData';
import { NoProviders } from '../../components/page/noProviders';
import { NotAvailable } from '../../components/page/notAvailable';
import { LoadingState } from '../../components/state/loadingState';
import { getIdKeyForGroupBy } from '../../utils/computedReport/getComputedOcpReportItems';
import type { ComputedReportItem } from '../../utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from '../../utils/computedReport/getComputedReportItems';
import { DateRangeType } from '../../utils/dateRange';
import { getGroupById, getGroupByTagKey } from '../../utils/groupBy';
import { filterProviders, hasCurrentMonthData, hasPreviousMonthData } from '../../utils/providers';
import { getRouteForQuery } from '../../utils/query';
import {
  handleOnCostDistributionSelect,
  handleOnCurrencySelect,
  handleOnFilterAdded,
  handleOnFilterRemoved,
  handleOnPerPageSelect,
  handleOnSetPage,
  handleOnSort,
} from '../../utils/queryNavigate';
import { getTimeScopeValue } from '../../utils/timeScope';
import type { ColumnManagementModalOption } from '../components/columnManagement';
import { ColumnManagementModal, initHiddenColumns } from '../components/columnManagement';
import { ProviderStatus } from '../components/providerStatus';
import { DetailsHeader } from './detailsHeader';
import { DetailsTable, DetailsTableColumnIds } from './detailsTable';
import { DetailsToolbar } from './detailsToolbar';
import { styles } from './ocpDetails.styles';

export interface OcpDetailsStateProps {
  costDistribution?: string;
  currency?: string;
  currentDateRangeType?: string;
  isCurrentMonthData?: boolean;
  isPreviousMonthData?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  query: OcpQuery;
  report: OcpReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
  timeScopeValue?: number;
}

interface OcpDetailsDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
  openProvidersModal: typeof openProvidersModal;
}

interface OcpDetailsState {
  columns?: any[];
  hiddenColumns?: Set<string>;
  isAllSelected?: boolean;
  isColumnManagementModalOpen?: boolean;
  isExportModalOpen?: boolean;
  rows?: any[];
  selectedItems?: ComputedReportItem[];
}

type OcpDetailsOwnProps = RouterComponentProps & WrappedComponentProps;

type OcpDetailsProps = OcpDetailsStateProps & OcpDetailsOwnProps & OcpDetailsDispatchProps;

const baseQuery: OcpQuery = {
  filter: {
    limit: 10,
    offset: 0,
  },
  filter_by: {},
  exclude: {},
  group_by: {
    project: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

const defaultColumnOptions: ColumnManagementModalOption[] = [
  { label: messages.monthOverMonthChange, value: DetailsTableColumnIds.monthOverMonth },
  {
    description: messages.ocpDetailsInfrastructureCostDesc,
    label: messages.ocpDetailsInfrastructureCost,
    value: DetailsTableColumnIds.infrastructure,
    hidden: true,
  },
  {
    description: messages.ocpDetailsSupplementaryCostDesc,
    label: messages.ocpDetailsSupplementaryCost,
    value: DetailsTableColumnIds.supplementary,
    hidden: true,
  },
];

const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ocp;

class OcpDetails extends React.Component<OcpDetailsProps, OcpDetailsState> {
  protected defaultState: OcpDetailsState = {
    columns: [],
    hiddenColumns: initHiddenColumns(defaultColumnOptions),
    isAllSelected: false,
    isColumnManagementModalOpen: false,
    isExportModalOpen: false,
    rows: [],
    selectedItems: [],
  };
  public state: OcpDetailsState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: OcpDetailsProps, prevState: OcpDetailsState) {
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

  private getColumnManagementModal = () => {
    const { hiddenColumns, isColumnManagementModalOpen } = this.state;

    const options = cloneDeep(defaultColumnOptions);
    options.map(option => {
      option.hidden = hiddenColumns.has(option.value);
    });

    return (
      <ColumnManagementModal
        isOpen={isColumnManagementModalOpen}
        options={options}
        onClose={this.handleOnColumnManagementModalClose}
        onSave={this.handleOnColumnManagementModalSave}
      />
    );
  };

  private getComputedItems = () => {
    const { query, report } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);

    return getUnsortedComputedReportItems({
      report,
      idKey: (groupByTagKey as any) || groupById,
    });
  };

  private getExportModal = (computedItems: ComputedReportItem[]) => {
    const { query, report, reportQueryString, timeScopeValue } = this.props;
    const { isAllSelected, isExportModalOpen, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);
    const itemsTotal = report?.meta ? report.meta.count : 0;

    // Omit items labeled 'no-project'
    const items = [];
    selectedItems.map(item => {
      if (!(item.label === `${noPrefix}${groupById}` || item.label === `${noPrefix}${groupByTagKey}`)) {
        items.push(item);
      }
    });
    return (
      <ExportModal
        count={isAllSelected ? itemsTotal : items.length}
        isAllItems={(isAllSelected || selectedItems.length === itemsTotal) && computedItems.length > 0}
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        isOpen={isExportModalOpen}
        isTimeScoped
        items={items}
        onClose={this.handleOnExportModalClose}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        reportType={reportType}
        timeScopeValue={timeScopeValue}
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
        onPerPageSelect={(event, perPage) => handleOnPerPageSelect(query, router, perPage)}
        onSetPage={(event, pageNumber) => handleOnSetPage(query, router, report, pageNumber)}
        page={page}
        perPage={limit}
        titles={{
          paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.openShift),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  private getTable = () => {
    const { costDistribution, query, report, reportFetchStatus, reportQueryString, router, timeScopeValue } =
      this.props;
    const { hiddenColumns, isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);

    return (
      <DetailsTable
        basePath={formatPath(routes.ocpBreakdown.path)}
        breadcrumbPath={formatPath(`${routes.ocpDetails.path}${location.search}`)}
        costDistribution={costDistribution}
        exclude={query.exclude}
        filterBy={query.filter_by}
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        groupByTagKey={groupByTagKey}
        hiddenColumns={hiddenColumns}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSelect={this.handleOnSelect}
        onSort={(sortType, isSortAscending) => handleOnSort(query, router, sortType, isSortAscending)}
        orderBy={query.order_by}
        query={query}
        report={report}
        reportQueryString={reportQueryString}
        selectedItems={selectedItems}
        timeScopeValue={timeScopeValue}
      />
    );
  };

  private getToolbar = (computedItems: ComputedReportItem[]) => {
    const { query, report, router, timeScopeValue } = this.props;
    const { isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);
    const isDisabled = computedItems.length === 0;
    const itemsTotal = report?.meta ? report.meta.count : 0;

    return (
      <DetailsToolbar
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        isExportDisabled={isDisabled || (!isAllSelected && selectedItems.length === 0)}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onBulkSelect={this.handleOnBulkSelect}
        onColumnManagementClicked={this.handleOnColumnManagementModalOpen}
        onExportClicked={this.handleOnExportModalOpen}
        onFilterAdded={filter => handleOnFilterAdded(query, router, filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(query, router, filter)}
        onPlatformCostsChanged={this.handleOnPlatformCostsChanged}
        pagination={this.getPagination(isDisabled)}
        query={query}
        selectedItems={selectedItems}
        timeScopeValue={timeScopeValue}
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

  private handleOnColumnManagementModalClose = (isOpen: boolean) => {
    this.setState({ isColumnManagementModalOpen: isOpen });
  };

  private handleOnColumnManagementModalOpen = () => {
    this.setState({ isColumnManagementModalOpen: true });
  };

  private handleOnColumnManagementModalSave = (hiddenColumns: Set<string>) => {
    this.setState({ hiddenColumns });
  };

  private handleOnDateRangeSelect = (value: string) => {
    const { query, router } = this.props;

    const newQuery = {
      filter: {},
      ...JSON.parse(JSON.stringify(query)),
    };
    newQuery.filter.time_scope_value = value === DateRangeType.previousMonth ? -2 : -1;
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
    const groupByKey: keyof OcpQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      // filter_by: undefined, // Preserve filter -- see https://issues.redhat.com/browse/COST-1090
      group_by: {
        [groupByKey]: '*',
      },
      order_by: undefined, // Clear sort
      category: undefined, // Only applies to projects
      delta: undefined,
    };
    this.setState({ isAllSelected: false, selectedItems: [] }, () => {
      router.navigate(getRouteForQuery(newQuery, router.location, true), { replace: true });
    });
  };

  private handleOnOperatorAvailableClose = () => {
    // Set token to keep closed for current session
    setOperatorAvailable('true');
    this.forceUpdate();
  };

  private handleOnPlatformCostsChanged = (checked: boolean) => {
    const { query, router } = this.props;
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      category: checked ? platformCategoryKey : undefined,
    };
    this.setState({ isAllSelected: false, selectedItems: [] }, () => {
      router.navigate(getRouteForQuery(newQuery, router.location, true), { replace: true });
    });
  };

  private handleOnSelect = (items: ComputedReportItem[], isSelected: boolean = false) => {
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

  private isOperatorAlertOpen = () => {
    const { providers, providersError, providersFetchStatus } = this.props;

    const result = providers.data.find(provider => provider.additional_context?.operator_update_available === true);

    if (!result) {
      if (providers && providersFetchStatus === FetchStatus.complete && !providersError) {
        deleteOperatorAvailable(); // Reset cookie for new alerts
      }
      return false;
    }

    // Keep closed if token is valid for current session
    return !isOperatorAvailableValid();
  };

  private updateReport = () => {
    const { fetchReport, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const {
      costDistribution,
      currency,
      intl,
      isCurrentMonthData,
      isPreviousMonthData,
      openProvidersModal,
      providers,
      providersFetchStatus,
      query,
      report,
      reportError,
      reportFetchStatus,
      router,
      timeScopeValue,
    } = this.props;

    const computedItems = this.getComputedItems();
    const groupById = getIdKeyForGroupBy(query.group_by);
    const isDisabled = computedItems.length === 0;
    const title = intl.formatMessage(messages.ocpDetailsTitle);

    // Note: Providers are fetched via the AccountSettings component used by all routes
    if (reportError) {
      return <NotAvailable title={title} />;
    } else if (providersFetchStatus === FetchStatus.inProgress) {
      return <Loading title={title} />;
    } else if (providersFetchStatus === FetchStatus.complete) {
      // API returns empy data array for no sources
      const noProviders = providers && providers.meta && providers.meta.count === 0;

      if (noProviders) {
        return <NoProviders />;
      }
      if (!isCurrentMonthData && !isPreviousMonthData) {
        return <NoData detailsComponent={<ProviderStatus providerType={ProviderType.ocp} />} title={title} />;
      }
    }

    return (
      <>
        <PageSection style={styles.headerContainer}>
          <DetailsHeader
            costDistribution={costDistribution}
            currency={currency}
            groupBy={groupById}
            isCurrentMonthData={isCurrentMonthData}
            isPreviousMonthData={isPreviousMonthData}
            onCostDistributionSelect={() => handleOnCostDistributionSelect(query, router)}
            onCurrencySelect={() => handleOnCurrencySelect(query, router)}
            onDateRangeSelect={this.handleOnDateRangeSelect}
            onGroupBySelect={this.handleOnGroupBySelect}
            query={query}
            report={report}
            timeScopeValue={timeScopeValue}
          />
        </PageSection>
        <PageSection>
          {this.isOperatorAlertOpen() && (
            <Alert
              actionClose={<AlertActionCloseButton onClose={() => this.handleOnOperatorAvailableClose()} />}
              actionLinks={
                <AlertActionLink onClick={() => openProvidersModal()}>
                  {intl.formatMessage(messages.newOperatorVersionAvailableLink)}
                </AlertActionLink>
              }
              isInline
              style={styles.alert}
              title={intl.formatMessage(messages.newOperatorVersionAvailable)}
              variant="warning"
            >
              {intl.formatMessage(messages.newOperatorVersionAvailableDesc)}
            </Alert>
          )}
          {!isCurrentMonthData && (
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
              {this.getToolbar(computedItems)}
              {this.getExportModal(computedItems)}
              {this.getColumnManagementModal()}
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
        </PageSection>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<OcpDetailsOwnProps, OcpDetailsStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<OcpQuery>(router.location.search);
  const groupBy = queryFromRoute.group_by ? getGroupById(queryFromRoute) : getGroupById(baseQuery);

  const costDistribution = groupBy === 'project' ? getCostDistribution() : undefined;
  const currency = getCurrency();

  // Check for current and previous data first
  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  // Fetch based on time scope value
  const filteredProviders = filterProviders(providers, ProviderType.ocp);
  const isCurrentMonthData = hasCurrentMonthData(filteredProviders);

  let timeScopeValue = getTimeScopeValue(queryFromRoute);
  timeScopeValue = Number(!isCurrentMonthData ? -2 : timeScopeValue !== undefined ? timeScopeValue : -1);

  const query: any = {
    ...baseQuery,
    ...(costDistribution === ComputedReportItemValueType.distributed && {
      order_by: {
        distributed_cost: 'desc',
      },
    }),
    ...queryFromRoute,
  };
  query.filter.time_scope_value = timeScopeValue; // Add time scope here for breakdown pages

  const reportQuery = {
    category: query.category,
    currency,
    delta: costDistribution === ComputedReportItemValueType.distributed ? 'distributed_cost' : 'cost',
    exclude: query.exclude,
    filter: {
      ...query.filter,
      resolution: 'monthly',
      time_scope_units: 'month',
    },
    filter_by: query.filter_by,
    group_by: query.group_by,
    order_by: query.order_by,
  };

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
    costDistribution,
    currency,
    isCurrentMonthData,
    isPreviousMonthData: hasPreviousMonthData(filteredProviders),
    providers: filteredProviders,
    providersError,
    providersFetchStatus,
    query,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
    timeScopeValue,
  };
});

const mapDispatchToProps: OcpDetailsDispatchProps = {
  fetchReport: reportActions.fetchReport,
  openProvidersModal: uiActions.openProvidersModal,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(OcpDetails)));
