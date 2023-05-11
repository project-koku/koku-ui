import { Pagination, PaginationVariant } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import type { IbmQuery } from 'api/queries/ibmQuery';
import { getQuery, parseQuery } from 'api/queries/ibmQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { IbmReport } from 'api/reports/ibmReports';
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
import { getIdKeyForGroupBy } from 'routes/views/utils/computedReport/getComputedIbmReportItems';
import type { ComputedReportItem } from 'routes/views/utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'routes/views/utils/computedReport/getComputedReportItems';
import { getGroupByTagKey } from 'routes/views/utils/groupBy';
import {
  handleOnCurrencySelected,
  handleOnFilterAdded,
  handleOnFilterRemoved,
  handleOnPerPageSelect,
  handleOnSetPage,
  handleOnSort,
} from 'routes/views/utils/navHandles';
import { hasCurrentMonthData } from 'routes/views/utils/providers';
import { filterProviders } from 'routes/views/utils/providers';
import { getRouteForQuery } from 'routes/views/utils/query';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { getCurrency } from 'utils/localStorage';
import { noPrefix, tagPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { DetailsHeader } from './detailsHeader';
import { DetailsTable } from './detailsTable';
import { DetailsToolbar } from './detailsToolbar';
import { styles } from './ibmDetails.styles';

interface IbmDetailsStateProps {
  currency?: string;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  query: IbmQuery;
  report: IbmReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

interface IbmDetailsDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface IbmDetailsState {
  columns?: any[];
  isAllSelected?: boolean;
  isExportModalOpen?: boolean;
  rows?: any[];
  selectedItems?: ComputedReportItem[];
}

type IbmDetailsOwnProps = RouterComponentProps & WrappedComponentProps;

type IbmDetailsProps = IbmDetailsStateProps & IbmDetailsOwnProps & IbmDetailsDispatchProps;

const baseQuery: IbmQuery = {
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
const reportPathsType = ReportPathsType.ibm;

class IbmDetails extends React.Component<IbmDetailsProps, IbmDetailsState> {
  protected defaultState: IbmDetailsState = {
    columns: [],
    isAllSelected: false,
    isExportModalOpen: false,
    rows: [],
    selectedItems: [],
  };
  public state: IbmDetailsState = { ...this.defaultState };

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

  public componentDidUpdate(prevProps: IbmDetailsProps, prevState: IbmDetailsState) {
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

    return getUnsortedComputedReportItems({
      report,
      idKey: (groupByTagKey as any) || groupById,
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
        items={items}
        onClose={this.handleExportModalClose}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
      />
    );
  };

  private getPagination = (isDisabled = false, isBottom = false) => {
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
            title: intl.formatMessage(messages.ibm),
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

    return (
      <DetailsTable
        filterBy={query.filter_by}
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        groupByTagKey={groupByTagKey}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSelected={this.handleSelected}
        onSort={(sortType, isSortAscending) => handleOnSort(query, router, sortType, isSortAscending)}
        orderBy={query.order_by}
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
    const isDisabled = computedItems.length === 0;
    const itemsTotal = report && report.meta ? report.meta.count : 0;

    return (
      <DetailsToolbar
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        isExportDisabled={isDisabled || (!isAllSelected && selectedItems.length === 0)}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onBulkSelected={this.handleBulkSelected}
        onExportClicked={this.handleExportModalOpen}
        onFilterAdded={filter => handleOnFilterAdded(query, router, filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(query, router, filter)}
        pagination={this.getPagination(isDisabled)}
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
    const groupByKey: keyof IbmQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      // filter_by: undefined, // Preserve filter -- see https://issues.redhat.com/browse/COST-1090
      group_by: {
        [groupByKey]: '*',
      },
      order_by: undefined, // Clear sort
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
    const { fetchReport, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const { currency, intl, providers, providersFetchStatus, query, report, reportError, reportFetchStatus, router } =
      this.props;

    const computedItems = this.getComputedItems();
    const groupById = getIdKeyForGroupBy(query.group_by);
    const isDisabled = computedItems.length === 0;
    const title = intl.formatMessage(messages.ibmDetailsTitle);

    // Note: Providers are fetched via the AccountSettings component used by all routes
    if (reportError) {
      return <NotAvailable title={title} />;
    } else if (providersFetchStatus === FetchStatus.inProgress) {
      return <Loading title={title} />;
    } else if (providersFetchStatus === FetchStatus.complete) {
      // API returns empty data array for no sources
      const noProviders = providers && providers.meta && providers.meta.count === 0;

      if (noProviders) {
        return <NoProviders providerType={ProviderType.ibm} title={title} />;
      }
      if (!hasCurrentMonthData(providers)) {
        return <NoData title={title} />;
      }
    }
    return (
      <div style={styles.ibmDetails}>
        <DetailsHeader
          currency={currency}
          groupBy={groupById}
          onCurrencySelected={() => handleOnCurrencySelected(query, router)}
          onGroupBySelected={this.handleGroupBySelected}
          report={report}
        />
        <div style={styles.content}>
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
const mapStateToProps = createMapStateToProps<IbmDetailsOwnProps, IbmDetailsStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<IbmQuery>(router.location.search);
  const currency = getCurrency();

  const query: any = {
    ...baseQuery,
    ...queryFromRoute,
  };
  const reportQuery = {
    currency,
    delta: 'cost',
    exclude: query.exclude,
    filter: {
      ...query.filter,
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
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
    providers: filterProviders(providers, ProviderType.ibm),
    providersError,
    providersFetchStatus,
    query,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
});

const mapDispatchToProps: IbmDetailsDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(IbmDetails)));
