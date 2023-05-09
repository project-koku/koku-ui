import { PageSection, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { getQuery, parseQuery } from 'api/queries/ocpQuery';
import type { OcpReport } from 'api/reports/ocpReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Loading } from 'routes/state/loading';
import { NotAvailable } from 'routes/state/notAvailable';
import { ComputedReportItemValueType } from 'routes/views/components/charts/common';
import type { ColumnManagementModalOption } from 'routes/views/details/components/columnManagement';
import { initHiddenColumns } from 'routes/views/details/components/columnManagement';
import { getGroupById, getGroupByTagKey } from 'routes/views/utils/groupBy';
import {
  handleOnFilterAdded,
  handleOnFilterRemoved,
  handleOnPerPageSelect,
  handleOnSetPage,
  handleOnSort,
} from 'routes/views/utils/handles';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { reportActions, reportSelectors } from 'store/reports';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedOcpReportItems';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { getCostDistribution, getCurrency } from 'utils/localStorage';
import { tagPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './tagDetails.styles';
import { DetailsTableColumnIds, TagTable } from './tagTable';
import { TagToolbar } from './tagToolbar';

export interface OcpDetailsStateProps {
  query: OcpQuery;
  report: OcpReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

interface OcpDetailsDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface OcpDetailsState {
  columns?: any[];
  hiddenColumns?: Set<string>;
  isAllSelected?: boolean;
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

class TagDetails extends React.Component<OcpDetailsProps, OcpDetailsState> {
  protected defaultState: OcpDetailsState = {
    columns: [],
    hiddenColumns: initHiddenColumns(defaultColumnOptions),
    isAllSelected: false,
    rows: [],
    selectedItems: [],
  };
  public state: OcpDetailsState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleBulkSelected = this.handleBulkSelected.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
  }

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

  private getComputedItems = () => {
    const { query, report } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);

    return getUnsortedComputedReportItems({
      report,
      idKey: (groupByTagKey as any) || groupById,
    });
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
            title: intl.formatMessage(messages.openShift),
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
    const { hiddenColumns, isAllSelected, selectedItems } = this.state;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = getGroupByTagKey(query);

    return (
      <TagTable
        groupBy={groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById}
        groupByTagKey={groupByTagKey}
        hiddenColumns={hiddenColumns}
        isAllSelected={isAllSelected}
        isLoading={reportFetchStatus === FetchStatus.inProgress}
        onSelected={this.handleSelected}
        onSort={(sortType, isSortAscending) => handleOnSort(query, router, sortType, isSortAscending)}
        report={report}
        reportQueryString={reportQueryString}
        selectedItems={selectedItems}
      />
    );
  };

  private getToolbar = (computedItems: ComputedReportItem[]) => {
    const { query, report, router } = this.props;
    const { isAllSelected, selectedItems } = this.state;

    const isDisabled = computedItems.length === 0;
    const itemsTotal = report && report.meta ? report.meta.count : 0;

    return (
      <TagToolbar
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        itemsPerPage={computedItems.length}
        itemsTotal={itemsTotal}
        onBulkSelected={this.handleBulkSelected}
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
    const { intl, reportError, reportFetchStatus } = this.props;

    const computedItems = this.getComputedItems();
    const isDisabled = computedItems.length === 0;
    const title = intl.formatMessage(messages.ocpDetailsTitle);

    // Note: Providers are fetched via the AccountSettings component used by all routes
    if (reportError) {
      return <NotAvailable title={title} />;
    }
    return (
      <PageSection isFilled>
        <div style={styles.descContainer}>
          {intl.formatMessage(messages.tagDesc, {
            learnMore: (
              <a href={intl.formatMessage(messages.docsConfigTags)} rel="noreferrer" target="_blank">
                {intl.formatMessage(messages.learnMore)}
              </a>
            ),
          })}
        </div>
        {this.getToolbar(computedItems)}
        {reportFetchStatus === FetchStatus.inProgress ? (
          <Loading />
        ) : (
          <>
            {this.getTable()}
            <div style={styles.pagination}>{this.getPagination(isDisabled, true)}</div>
          </>
        )}
      </PageSection>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OcpDetailsOwnProps, OcpDetailsStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<OcpQuery>(router.location.search);
  const groupBy = queryFromRoute.group_by ? getGroupById(queryFromRoute) : getGroupById(baseQuery);

  const isCostDistributionFeatureEnabled = featureFlagsSelectors.selectIsCostDistributionFeatureEnabled(state);
  const costDistribution =
    groupBy === 'project' && isCostDistributionFeatureEnabled ? getCostDistribution() : undefined;
  const currency = getCurrency();

  const query: any = {
    ...baseQuery,
    ...(costDistribution === ComputedReportItemValueType.distributed && {
      order_by: {
        distributed_cost: 'desc',
      },
    }),
    ...queryFromRoute,
  };
  const reportQuery = {
    category: query.category,
    currency,
    delta: costDistribution === ComputedReportItemValueType.distributed ? 'distributed_cost' : 'cost',
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

  return {
    query,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
});

const mapDispatchToProps: OcpDetailsDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(TagDetails)));
