import { Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AwsQuery, getQuery, parseQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/providersQuery';
import { AxiosError } from 'axios';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { NoProvidersState } from 'components/state/noProvidersState/noProvidersState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { awsReportsActions, awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { awsProvidersQuery, providersSelectors } from 'store/providers';
import { uiActions } from 'store/ui';
import { formatCurrency } from 'utils/formatValue';
import {
  ComputedAwsReportItem,
  getIdKeyForGroupBy,
  getUnsortedComputedAwsReportItems,
} from 'utils/getComputedAwsReportItems';
import { styles, toolbarOverride } from './awsDetails.styles';
import { DetailsTable } from './detailsTable';
import { DetailsToolbar } from './detailsToolbar';
import ExportModal from './exportModal';
import { GroupBy } from './groupBy';

interface AwsDetailsStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  query: AwsQuery;
  queryString: string;
  report: AwsReport;
  reportFetchStatus: FetchStatus;
}

interface AwsDetailsDispatchProps {
  fetchReport: typeof awsReportsActions.fetchReport;
  openExportModal: typeof uiActions.openExportModal;
}

interface AwsDetailsState {
  columns: any[];
  rows: any[];
  selectedItems: ComputedAwsReportItem[];
}

type AwsDetailsOwnProps = RouteComponentProps<void> & InjectedTranslateProps;

type AwsDetailsProps = AwsDetailsStateProps &
  AwsDetailsOwnProps &
  AwsDetailsDispatchProps;

const reportType = AwsReportType.cost;

const baseQuery: AwsQuery = {
  delta: 'cost',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
  group_by: {
    account: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

class AwsDetails extends React.Component<AwsDetailsProps> {
  protected defaultState: AwsDetailsState = {
    columns: [],
    rows: [],
    selectedItems: [],
  };
  public state: AwsDetailsState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleExportClicked = this.handleExportClicked.bind(this);
    this.handleFilterAdded = this.handleFilterAdded.bind(this);
    this.handleFilterRemoved = this.handleFilterRemoved.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
    this.handleSort = this.handleSort.bind(this);
  }

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: AwsDetailsProps) {
    this.updateReport();
  }

  public shouldComponentUpdate(
    nextProps: AwsDetailsProps,
    nextState: AwsDetailsState
  ) {
    const { location, report, queryString } = this.props;
    const { selectedItems } = this.state;
    return (
      nextProps.queryString !== queryString ||
      !report ||
      !location.search ||
      nextState.selectedItems !== selectedItems
    );
  }

  private getDetailsTable = () => {
    const { query, report } = this.props;

    return (
      <DetailsTable
        onSelected={this.handleSelected}
        onSort={this.handleSort}
        query={query}
        report={report}
      />
    );
  };

  private getExportModal = (computedItems: ComputedAwsReportItem[]) => {
    const { selectedItems } = this.state;
    const { query } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTag = this.getGroupByTagKey();

    return (
      <ExportModal
        isAllItems={selectedItems.length === computedItems.length}
        groupBy={groupByTag ? `tag:${groupByTag}` : groupById}
        items={selectedItems}
        query={query}
      />
    );
  };

  private getFilterFields = (groupById: string): any[] => {
    const { t } = this.props;
    if (groupById === 'account') {
      return [
        {
          id: 'account',
          title: t('aws_details.filter.account_select'),
          placeholder: t('aws_details.filter.account_placeholder'),
          filterType: 'text',
        },
      ];
    } else if (groupById === 'service') {
      return [
        {
          id: 'service',
          title: t('aws_details.filter.service_select'),
          placeholder: t('aws_details.filter.service_placeholder'),
          filterType: 'text',
        },
      ];
    } else if (groupById === 'region') {
      return [
        {
          id: 'region',
          title: t('aws_details.filter.region_select'),
          placeholder: t('aws_details.filter.region_placeholder'),
          filterType: 'text',
        },
      ];
    } else {
      // Default for group by account tags
      return [
        {
          id: 'tag',
          title: t('aws_details.filter.tag_select'),
          placeholder: t('aws_details.filter.tag_placeholder'),
          filterType: 'text',
        },
      ];
    }
    return [];
  };

  private getGroupByTagKey = () => {
    const { query } = this.props;
    let groupByTag;

    for (const groupBy of Object.keys(query.group_by)) {
      const tagIndex = groupBy.indexOf('tag:');
      if (tagIndex !== -1) {
        groupByTag = groupBy.substring(tagIndex + 4) as any;
        break;
      }
    }
    return groupByTag;
  };

  private getHeader = () => {
    const { providers, providersError, report, t } = this.props;
    const today = new Date();
    const showContent =
      report &&
      !providersError &&
      providers &&
      providers.meta &&
      providers.meta.count > 0;

    return (
      <header className={css(styles.header)}>
        <div>
          <Title className={css(styles.title)} size="2xl">
            {t('aws_details.title')}
          </Title>
          {Boolean(showContent) && (
            <GroupBy onItemClicked={this.handleGroupByClick} />
          )}
        </div>
        {Boolean(showContent) && (
          <div className={css(styles.total)}>
            <Title className={css(styles.totalValue)} size="4xl">
              {formatCurrency(report.meta.total.cost.value)}
            </Title>
            <div className={css(styles.totalLabel)}>
              <div className={css(styles.totalLabelUnit)}>
                {t('aws_details.total_cost')}
              </div>
              <div className={css(styles.totalLabelDate)}>
                {t('since_date', { month: today.getMonth(), date: 1 })}
              </div>
            </div>
          </div>
        )}
      </header>
    );
  };

  private getRouteForQuery(query: AwsQuery) {
    return `/aws?${getQuery(query)}`;
  }

  private getToolbar = (computedItems: ComputedAwsReportItem[]) => {
    const { selectedItems } = this.state;
    const { query, report, t } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTag = this.getGroupByTagKey();
    const filterFields = this.getFilterFields(groupByTag ? 'tag' : groupById);

    return (
      <DetailsToolbar
        exportText={t('aws_details.export_link')}
        filterFields={filterFields}
        isExportDisabled={selectedItems.length === 0}
        onExportClicked={this.handleExportClicked}
        onFilterAdded={this.handleFilterAdded}
        onFilterRemoved={this.handleFilterRemoved}
        report={report}
        resultsTotal={computedItems.length}
        query={query}
      />
    );
  };

  private handleExportClicked = () => {
    this.props.openExportModal();
  };

  private handleFilterAdded = (filterType: string, filterValue: string) => {
    const { history, query } = this.props;
    const newQuery = { ...JSON.parse(JSON.stringify(query)) };

    const groupByTagKey = this.getGroupByTagKey();
    const newFilterType =
      filterType === 'tag' ? `${filterType}:${groupByTagKey}` : filterType;

    if (newQuery.group_by[newFilterType]) {
      if (newQuery.group_by[newFilterType] === '*') {
        newQuery.group_by[newFilterType] = filterValue;
      } else if (!newQuery.group_by[newFilterType].includes(filterValue)) {
        newQuery.group_by[newFilterType] = [
          newQuery.group_by[newFilterType],
          filterValue,
        ];
      }
    } else {
      newQuery.group_by[filterType] = [filterValue];
    }
    const filteredQuery = this.getRouteForQuery(newQuery);
    history.replace(filteredQuery);
  };

  private handleFilterRemoved = (filterType: string, filterValue: string) => {
    const { history, query } = this.props;
    const newQuery = { ...JSON.parse(JSON.stringify(query)) };

    const groupByTagKey = this.getGroupByTagKey();
    const newFilterType =
      filterType === 'tag' ? `${filterType}:${groupByTagKey}` : filterType;

    if (filterValue === '') {
      newQuery.group_by = {
        [newFilterType]: '*',
      };
    } else if (!Array.isArray(newQuery.group_by[newFilterType])) {
      newQuery.group_by[newFilterType] = '*';
    } else {
      const index = newQuery.group_by[newFilterType].indexOf(filterValue);
      if (index > -1) {
        newQuery.group_by[newFilterType] = [
          ...query.group_by[newFilterType].slice(0, index),
          ...query.group_by[newFilterType].slice(index + 1),
        ];
      }
    }
    const filteredQuery = this.getRouteForQuery(newQuery);
    history.replace(filteredQuery);
  };

  private handleGroupByClick = groupBy => {
    const { history, query } = this.props;
    const groupByKey: keyof AwsQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      group_by: {
        [groupByKey]: '*',
      },
      order_by: { cost: 'desc' },
    };
    history.replace(this.getRouteForQuery(newQuery));
    this.setState({ selectedItems: [] });
  };

  private handleSelected = (selectedItems: ComputedAwsReportItem[]) => {
    this.setState({ selectedItems });
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
          group_by: query.group_by,
          order_by: { cost: 'desc' },
        })
      );
    } else {
      fetchReport(reportType, queryString);
    }
  };

  public render() {
    const {
      providers,
      providersError,
      providersFetchStatus,
      query,
      report,
    } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTag = this.getGroupByTagKey();

    const computedItems = getUnsortedComputedAwsReportItems({
      report,
      idKey: (groupByTag as any) || groupById,
    });

    const isLoading = providersFetchStatus === FetchStatus.inProgress;
    const noProviders =
      providers !== undefined &&
      providers.meta !== undefined &&
      providers.meta.count === 0 &&
      providersFetchStatus === FetchStatus.complete;

    return (
      <div className={css(styles.awsDetails)}>
        {this.getHeader()}
        {Boolean(providersError) ? (
          <ErrorState error={providersError} />
        ) : Boolean(noProviders) ? (
          <NoProvidersState />
        ) : Boolean(isLoading) ? (
          <LoadingState />
        ) : (
          <div className={css(styles.content)}>
            <div className={css(styles.toolbarContainer)}>
              <div className={toolbarOverride}>
                {this.getToolbar(computedItems)}
                {this.getExportModal(computedItems)}
              </div>
            </div>
            <div className={css(styles.tableContainer)}>
              {this.getDetailsTable()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  AwsDetailsOwnProps,
  AwsDetailsStateProps
>((state, props) => {
  const queryFromRoute = parseQuery<AwsQuery>(location.search);
  const query = {
    delta: 'cost',
    filter: {
      ...baseQuery.filter,
      ...queryFromRoute.filter,
    },
    group_by: queryFromRoute.group_by || baseQuery.group_by,
    order_by: queryFromRoute.order_by || baseQuery.order_by,
  };
  const queryString = getQuery(query);
  const report = awsReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    reportType,
    queryString
  );

  const providersQueryString = getProvidersQuery(awsProvidersQuery);
  const providers = providersSelectors.selectProviders(
    state,
    ProviderType.aws,
    providersQueryString
  );
  const providersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.aws,
    providersQueryString
  );
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.aws,
    providersQueryString
  );

  return {
    providers,
    providersError,
    providersFetchStatus,
    query,
    queryString,
    report,
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

const mapDispatchToProps: AwsDetailsDispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
  openExportModal: uiActions.openExportModal,
};

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AwsDetails)
);
