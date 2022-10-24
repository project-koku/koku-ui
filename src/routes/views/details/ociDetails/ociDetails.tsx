import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import type { OciQuery } from 'api/queries/ociQuery';
import { getQuery, parseQuery } from 'api/queries/ociQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { tagPrefix } from 'api/queries/query';
import type { OciReport } from 'api/reports/ociReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
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
import { getGroupByTagKey } from 'routes/views/utils/groupBy';
import {
  getRouteForQuery,
  handleCurrencySelected,
  handleFilterAdded,
  handleFilterRemoved,
  handlePerPageSelect,
  handleSetPage,
  handleSort,
} from 'routes/views/utils/history';
import { filterProviders, hasCurrentMonthData } from 'routes/views/utils/providers';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedOciReportItems';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { getCurrency } from 'utils/currency';

import { DetailsHeader } from './detailsHeader';
import { DetailsTable } from './detailsTable';
import { DetailsToolbar } from './detailsToolbar';
import { styles } from './ociDetails.styles';

interface OciDetailsStateProps {
  currency?: string;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  query: OciQuery;
  queryString: string;
  report: OciReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
}

interface OciDetailsDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface OciDetailsState {
  columns: any[];
  isAllSelected: boolean;
  isExportModalOpen: boolean;
  rows: any[];
  selectedItems: ComputedReportItem[];
}

type OciDetailsOwnProps = RouteComponentProps<void> & WrappedComponentProps;

type OciDetailsProps = OciDetailsStateProps & OciDetailsOwnProps & OciDetailsDispatchProps;

const baseQuery: OciQuery = {
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
    payer_tenant_id: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.oci;

class OciDetails extends React.Component<OciDetailsProps> {
  protected defaultState: OciDetailsState = {
    columns: [],
    isAllSelected: false,
    isExportModalOpen: false,
    rows: [],
    selectedItems: [],
  };
  public state: OciDetailsState = { ...this.defaultState };

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

  public componentDidUpdate(prevProps: OciDetailsProps, prevState: OciDetailsState) {
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
        count={isAllSelected ? itemsTotal : items.length}
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
            title: intl.formatMessage(messages.oci),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`exports-pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  private getTable = () => {
    const { history, query, report, reportFetchStatus } = this.props;
    const { isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);

    return (
      <DetailsTable
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSelected={this.handleSelected}
        onSort={(sortType, isSortAscending) => handleSort(history, query, sortType, isSortAscending)}
        query={query}
        report={report}
        selectedItems={selectedItems}
      />
    );
  };

  private getToolbar = (computedItems: ComputedReportItem[]) => {
    const { history, query, report } = this.props;
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
        onFilterAdded={filter => handleFilterAdded(history, query, filter)}
        onFilterRemoved={filter => handleFilterRemoved(history, query, filter)}
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
    const { history, query } = this.props;
    const groupByKey: keyof OciQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      // filter_by: undefined, // Preserve filter -- see https://issues.redhat.com/browse/COST-1090
      group_by: {
        [groupByKey]: '*',
      },
      order_by: { cost: 'desc' },
    };
    this.setState({ isAllSelected: false, selectedItems: [] }, () => {
      history.replace(getRouteForQuery(history, newQuery, true));
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
    const { fetchReport, history, location, query, queryString } = this.props;
    if (!location.search) {
      history.replace(
        getRouteForQuery(history, {
          exclude: query ? query.exclude : undefined,
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
    const { currency, history, providers, providersFetchStatus, query, report, reportError, reportFetchStatus, intl } =
      this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const computedItems = this.getComputedItems();
    const title = intl.formatMessage(messages.ociDetailsTitle);

    // Note: Providers are fetched via the AccountSettings component used by all routes
    if (reportError) {
      return <NotAvailable title={title} />;
    } else if (providersFetchStatus === FetchStatus.inProgress) {
      return <Loading title={title} />;
    } else if (providersFetchStatus === FetchStatus.complete) {
      // API returns empy data array for no sources
      const noProviders = providers && providers.meta && providers.meta.count === 0;

      if (noProviders) {
        return <NoProviders providerType={ProviderType.oci} title={title} />;
      }
      if (!hasCurrentMonthData(providers)) {
        return <NoData title={title} />;
      }
    }
    return (
      <div style={styles.ociDetails}>
        <DetailsHeader
          currency={currency}
          groupBy={groupById}
          onCurrencySelected={value => handleCurrencySelected(history, query, value)}
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
const mapStateToProps = createMapStateToProps<OciDetailsOwnProps, OciDetailsStateProps>((state, props) => {
  const queryFromRoute = parseQuery<OciQuery>(location.search);
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
    currency,
  };
  const queryString = getQuery(query);
  const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);

  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  return {
    currency,
    providers: filterProviders(providers, ProviderType.oci),
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

const mapDispatchToProps: OciDetailsDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(OciDetails));
