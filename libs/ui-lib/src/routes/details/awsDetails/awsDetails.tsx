import '../../components/dataTable/dataTable.scss';

import type { Providers } from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';
import type { AwsQuery } from '@koku-ui/api/queries/awsQuery';
import { getQuery, parseQuery } from '@koku-ui/api/queries/awsQuery';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import type { AwsReport } from '@koku-ui/api/reports/awsReports';
import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import { Alert, Card, CardBody, PageSection, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { routes } from '../../../routes';
import { createMapStateToProps, FetchStatus } from '../../../store/common';
import { providersQuery, providersSelectors } from '../../../store/providers';
import { reportActions, reportSelectors } from '../../../store/reports';
import { getSinceDateRangeString } from '../../../utils/dates';
import { formatPath } from '../../../utils/paths';
import { awsCategoryPrefix, logicalOrPrefix, noPrefix, orgUnitIdKey, tagPrefix } from '../../../utils/props';
import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import { getCostType, getCurrency } from '../../../utils/sessionStorage';
import { ExportModal } from '../../components/export';
import { Loading } from '../../components/page/loading';
import { NoData } from '../../components/page/noData';
import { NoProviders } from '../../components/page/noProviders';
import { NotAvailable } from '../../components/page/notAvailable';
import { LoadingState } from '../../components/state/loadingState';
import { getIdKeyForGroupBy } from '../../utils/computedReport/getComputedAwsReportItems';
import type { ComputedReportItem } from '../../utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from '../../utils/computedReport/getComputedReportItems';
import { DateRangeType } from '../../utils/dateRange';
import { getGroupByCostCategory, getGroupByOrgValue, getGroupByTagKey } from '../../utils/groupBy';
import { filterProviders, hasCurrentMonthData, hasPreviousMonthData } from '../../utils/providers';
import { getRouteForQuery } from '../../utils/query';
import {
  handleOnCostTypeSelect,
  handleOnCurrencySelect,
  handleOnFilterAdded,
  handleOnFilterRemoved,
  handleOnPerPageSelect,
  handleOnSetPage,
  handleOnSort,
} from '../../utils/queryNavigate';
import { getTimeScopeValue } from '../../utils/timeScope';
import { ProviderStatus } from '../components/providerStatus';
import { styles } from './awsDetails.styles';
import { DetailsHeader } from './detailsHeader';
import { DetailsTable } from './detailsTable';
import { DetailsToolbar } from './detailsToolbar';

interface AwsDetailsStateProps {
  costType: string;
  currency?: string;
  isCurrentMonthData?: boolean;
  isPreviousMonthData?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  query: AwsQuery;
  report: AwsReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
  timeScopeValue?: number;
}

interface AwsDetailsDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface AwsDetailsState {
  columns?: any[];
  isAllSelected?: boolean;
  isExportModalOpen?: boolean;
  rows?: any[];
  selectedItems?: ComputedReportItem[];
}

type AwsDetailsOwnProps = RouterComponentProps & WrappedComponentProps;

type AwsDetailsProps = AwsDetailsStateProps & AwsDetailsOwnProps & AwsDetailsDispatchProps;

const baseQuery: AwsQuery = {
  filter: {
    limit: 10,
    offset: 0,
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

class AwsDetails extends React.Component<AwsDetailsProps, AwsDetailsState> {
  protected defaultState: AwsDetailsState = {
    columns: [],
    isAllSelected: false,
    isExportModalOpen: false,
    rows: [],
    selectedItems: [],
  };
  public state: AwsDetailsState = { ...this.defaultState };

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
    const { query, report, reportQueryString, timeScopeValue } = this.props;
    const { isAllSelected, isExportModalOpen, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByCostCategory = getGroupByCostCategory(query);
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
        groupBy={
          groupByCostCategory
            ? `${awsCategoryPrefix}${groupByCostCategory}`
            : groupByTagKey
              ? `${tagPrefix}${groupByTagKey}`
              : groupById
        }
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
    const { intl, query, router, report } = this.props;

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
            title: intl.formatMessage(messages.aws),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  private getTable = () => {
    const { query, report, reportFetchStatus, reportQueryString, router, timeScopeValue } = this.props;
    const { isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByCostCategory = getGroupByCostCategory(query);
    const groupByTagKey = getGroupByTagKey(query);
    const groupByOrg = getGroupByOrgValue(query);

    return (
      <DetailsTable
        basePath={formatPath(routes.awsBreakdown.path)}
        breadcrumbPath={formatPath(`${routes.awsDetails.path}${location.search}`)}
        exclude={query.exclude}
        filterBy={query.filter_by}
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
        onSelect={this.handleonSelect}
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
    const { query, router, report, timeScopeValue } = this.props;
    const { isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByCostCategory = getGroupByCostCategory(query);
    const groupByTagKey = getGroupByTagKey(query);
    const isDisabled = computedItems.length === 0;
    const itemsTotal = report?.meta ? report.meta.count : 0;

    return (
      <DetailsToolbar
        groupBy={
          groupByCostCategory
            ? `${awsCategoryPrefix}${groupByCostCategory}`
            : groupByTagKey
              ? `${tagPrefix}${groupByTagKey}`
              : groupById
        }
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        isExportDisabled={isDisabled || (!isAllSelected && selectedItems.length === 0)}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onBulkSelect={this.handleOnBulkSelect}
        onExportClicked={this.handleOnExportModalOpen}
        onFilterAdded={filter => handleOnFilterAdded(query, router, filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(query, router, filter)}
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

  private handleonSelect = (items: ComputedReportItem[], isSelected: boolean = false) => {
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
    const { fetchReport, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const {
      costType,
      currency,
      intl,
      isCurrentMonthData,
      isPreviousMonthData,
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
        return <NoProviders />;
      }
      if (!isCurrentMonthData && !isPreviousMonthData) {
        return <NoData detailsComponent={<ProviderStatus providerType={ProviderType.aws} />} title={title} />;
      }
    }

    return (
      <>
        <PageSection style={styles.headerContainer}>
          <DetailsHeader
            costType={costType}
            currency={currency}
            groupBy={groupById}
            isCurrentMonthData={isCurrentMonthData}
            isPreviousMonthData={isPreviousMonthData}
            onCostTypeSelect={() => handleOnCostTypeSelect(query, router)}
            onCurrencySelect={() => handleOnCurrencySelect(query, router)}
            onDateRangeSelect={this.handleOnDateRangeSelect}
            onGroupBySelect={this.handleOnGroupBySelect}
            query={query}
            report={report}
            timeScopeValue={timeScopeValue}
          />
        </PageSection>
        <PageSection>
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

const mapStateToProps = createMapStateToProps<AwsDetailsOwnProps, AwsDetailsStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<AwsQuery>(router.location.search);

  const costType = getCostType();
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
  const filteredProviders = filterProviders(providers, ProviderType.aws);
  const isCurrentMonthData = hasCurrentMonthData(filteredProviders);

  let timeScopeValue = getTimeScopeValue(queryFromRoute);
  timeScopeValue = Number(!isCurrentMonthData ? -2 : timeScopeValue !== undefined ? timeScopeValue : -1);

  const query: any = {
    ...baseQuery,
    ...queryFromRoute,
  };
  query.filter.time_scope_value = timeScopeValue; // Add time scope here for breakdown pages

  const reportQuery = {
    cost_type: costType,
    currency,
    delta: 'cost',
    exclude: query.exclude,
    filter: {
      ...query.filter,
      resolution: 'monthly',
      time_scope_units: 'month',
    },
    filter_by: {
      ...query.filter_by,
      // Workaround for https://issues.redhat.com/browse/COST-1189
      ...(query.filter_by &&
        query.filter_by[orgUnitIdKey] && {
          [`${logicalOrPrefix}${orgUnitIdKey}`]: query.filter_by[orgUnitIdKey],
          [orgUnitIdKey]: undefined,
        }),
    },
    group_by: query.group_by,
    order_by: query.order_by,
  };

  const reportQueryString = getQuery(reportQuery);
  const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString) as AwsReport;
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    reportQueryString
  );

  return {
    costType,
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

const mapDispatchToProps: AwsDetailsDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(AwsDetails)));
