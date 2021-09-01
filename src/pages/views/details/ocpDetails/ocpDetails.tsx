import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { getQuery, getQueryRoute, OcpQuery, parseQuery } from 'api/queries/ocpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { tagPrefix } from 'api/queries/query';
import { OcpReport } from 'api/reports/ocpReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import Loading from 'pages/state/loading';
import NoData from 'pages/state/noData';
import NoProviders from 'pages/state/noProviders';
import NotAvailable from 'pages/state/notAvailable';
import { ExportModal } from 'pages/views/components/export/exportModal';
import {
  ColumnManagementModal,
  ColumnManagementModalOption,
  initHiddenColumns,
} from 'pages/views/details/components/columnManagement/columnManagementModal';
import { getGroupByTagKey } from 'pages/views/utils/groupBy';
import { hasCurrentMonthData } from 'pages/views/utils/providers';
import { addQueryFilter, removeQueryFilter } from 'pages/views/utils/query';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpProvidersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { uiActions } from 'store/ui';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedOcpReportItems';
import { ComputedReportItem, getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';

import { DetailsHeader } from './detailsHeader';
import { DetailsTable, DetailsTableColumnIds } from './detailsTable';
import { DetailsToolbar } from './detailsToolbar';
import { styles } from './ocpDetails.styles';

interface OcpDetailsStateProps {
  providers: Providers;
  providersFetchStatus: FetchStatus;
  query: OcpQuery;
  queryString: string;
  report: OcpReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
}

interface OcpDetailsDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
  resetState: typeof uiActions.resetState;
}

interface OcpDetailsState {
  columns: any[];
  hiddenColumns: Set<string>;
  isAllSelected: boolean;
  isColumnManagementModalOpen: boolean;
  isExportModalOpen: boolean;
  rows: any[];
  selectedItems: ComputedReportItem[];
}

type OcpDetailsOwnProps = RouteComponentProps<void> & WrappedComponentProps;

type OcpDetailsProps = OcpDetailsStateProps & OcpDetailsOwnProps & OcpDetailsDispatchProps;

const baseQuery: OcpQuery = {
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
    project: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

const defaultColumnOptions: ColumnManagementModalOption[] = [
  { label: 'details.month_over_month_change', value: DetailsTableColumnIds.monthOverMonth },
  {
    description: 'ocp_details.infrastructure_cost_desc',
    label: 'ocp_details.infrastructure_cost',
    value: DetailsTableColumnIds.infrastructure,
    hidden: true,
  },
  {
    description: 'ocp_details.supplementary_cost_desc',
    label: 'ocp_details.supplementary_cost',
    value: DetailsTableColumnIds.supplementary,
    hidden: true,
  },
];

const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ocp;

class OcpDetails extends React.Component<OcpDetailsProps> {
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

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleBulkSelected = this.handleBulkSelected.bind(this);
    this.handleColumnManagementModalClose = this.handleColumnManagementModalClose.bind(this);
    this.handleColumnManagementModalOpen = this.handleColumnManagementModalOpen.bind(this);
    this.handleColumnManagementModalSave = this.handleColumnManagementModalSave.bind(this);
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
    const { resetState } = this.props;

    resetState(); // Clear cached API responses
    this.updateReport();
  }

  public componentDidUpdate(prevProps: OcpDetailsProps, prevState: OcpDetailsState) {
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
        onClose={this.handleColumnManagementModalClose}
        onSave={this.handleColumnManagementModalSave}
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
    const { isAllSelected, isExportModalOpen, selectedItems } = this.state;
    const { query, report } = this.props;

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
        isAllItems={(isAllSelected || selectedItems.length === itemsTotal) && computedItems.length > 0}
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        isOpen={isExportModalOpen}
        items={items}
        onClose={this.handleExportModalClose}
        query={query}
        reportPathsType={reportPathsType}
      />
    );
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

  private getRouteForQuery(query: OcpQuery, reset: boolean = false) {
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
    const { query, report, reportFetchStatus } = this.props;
    const { hiddenColumns, isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);

    return (
      <DetailsTable
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        hiddenColumns={hiddenColumns}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSelected={this.handleSelected}
        onSort={this.handleSort}
        query={query}
        report={report}
        selectedItems={selectedItems}
      />
    );
  };

  private getToolbar = (computedItems: ComputedReportItem[]) => {
    const { query, report } = this.props;
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
        onColumnManagementClicked={this.handleColumnManagementModalOpen}
        onExportClicked={this.handleExportModalOpen}
        onFilterAdded={this.handleFilterAdded}
        onFilterRemoved={this.handleFilterRemoved}
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

  public handleColumnManagementModalClose = (isOpen: boolean) => {
    this.setState({ isColumnManagementModalOpen: isOpen });
  };

  public handleColumnManagementModalOpen = () => {
    this.setState({ isColumnManagementModalOpen: true });
  };

  public handleColumnManagementModalSave = (hiddenColumns: Set<string>) => {
    this.setState({ hiddenColumns });
  };

  public handleExportModalClose = (isOpen: boolean) => {
    this.setState({ isExportModalOpen: isOpen });
  };

  public handleExportModalOpen = () => {
    this.setState({ isExportModalOpen: true });
  };

  private handleFilterAdded = (filterType: string, filterValue: string) => {
    const { history, query } = this.props;

    const filteredQuery = addQueryFilter(query, filterType, filterValue);
    history.replace(this.getRouteForQuery(filteredQuery, true));
  };

  private handleFilterRemoved = (filterType: string, filterValue: string) => {
    const { history, query } = this.props;

    const filteredQuery = removeQueryFilter(query, filterType, filterValue);
    history.replace(this.getRouteForQuery(filteredQuery, true));
  };

  private handleGroupByClick = groupBy => {
    const { history, query } = this.props;
    const groupByKey: keyof OcpQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      // filter_by: undefined, // Preserve filter -- see https://issues.redhat.com/browse/COST-1090
      group_by: {
        [groupByKey]: '*',
      },
      order_by: { cost: 'desc' },
    };
    history.replace(this.getRouteForQuery(newQuery, true));
    this.setState({ isAllSelected: false, selectedItems: [] });
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
          filter_by: query ? query.filter_by : undefined,
          group_by: query ? query.group_by : undefined,
          order_by: { cost: 'desc' },
        })
      );
    } else {
      fetchReport(reportPathsType, reportType, queryString);
    }
  };

  public render() {
    const { providers, providersFetchStatus, query, report, reportError, reportFetchStatus, intl } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const computedItems = this.getComputedItems();
    const title = intl.formatMessage(messages.OCPDetailsTitle);

    // Note: Providers are fetched via the InactiveSources component used by all routes
    if (reportError) {
      return <NotAvailable title={title} />;
    } else if (providersFetchStatus === FetchStatus.inProgress && reportFetchStatus === FetchStatus.inProgress) {
      return <Loading title={title} />;
    } else if (providersFetchStatus === FetchStatus.complete && reportFetchStatus === FetchStatus.complete) {
      // API returns empy data array for no sources
      const noProviders =
        providers && providers.meta && providers.meta.count === 0 && providersFetchStatus === FetchStatus.complete;

      if (noProviders) {
        return <NoProviders providerType={ProviderType.ocp} title={title} />;
      }
      if (!hasCurrentMonthData(providers)) {
        return <NoData title={title} />;
      }
    }
    return (
      <div style={styles.ocpDetails}>
        <DetailsHeader groupBy={groupById} onGroupByClicked={this.handleGroupByClick} report={report} />
        <div style={styles.content}>
          {this.getToolbar(computedItems)}
          {this.getExportModal(computedItems)}
          {this.getColumnManagementModal()}
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
const mapStateToProps = createMapStateToProps<OcpDetailsOwnProps, OcpDetailsStateProps>((state, props) => {
  const queryFromRoute = parseQuery<OcpQuery>(location.search);
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
  const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);

  const providersQueryString = getProvidersQuery(ocpProvidersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.ocp, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ocp,
    providersQueryString
  );

  return {
    providers,
    providersFetchStatus,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
  };
});

const mapDispatchToProps: OcpDetailsDispatchProps = {
  fetchReport: reportActions.fetchReport,
  resetState: uiActions.resetState,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(OcpDetails));
