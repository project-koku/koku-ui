import { Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AwsQuery, getQuery, parseQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { awsReportsActions, awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
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
  report: AwsReport;
  reportFetchStatus: FetchStatus;
  queryString: string;
  query: AwsQuery;
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
  delta: 'total',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
  group_by: {
    account: '*',
  },
  order_by: {
    total: 'desc',
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
    this.setState({});
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

  public getFilterFields = (groupById: string): any[] => {
    const { t } = this.props;
    if (groupById === 'cluster') {
      return [
        {
          id: 'cluster',
          title: t('aws_details.filter.cluster_select'),
          placeholder: t('aws_details.filter.cluster_placeholder'),
          filterType: 'text',
        },
      ];
    } else if (groupById === 'node') {
      return [
        {
          id: 'node',
          title: t('aws_details.filter.node_select'),
          placeholder: t('aws_details.filter.node_placeholder'),
          filterType: 'text',
        },
      ];
    } else if (groupById === 'account') {
      return [
        {
          id: 'account',
          title: t('aws_details.filter.account_select'),
          placeholder: t('aws_details.filter.account_placeholder'),
          filterType: 'text',
        },
      ];
    } else {
      // Default for group by account tags
      return [
        {
          id: 'account',
          title: t('aws_details.filter.account_select'),
          placeholder: t('aws_details.filter.account_placeholder'),
          filterType: 'text',
        },
      ];
    }
    return [];
  };

  private getRouteForQuery(query: AwsQuery) {
    return `/aws?${getQuery(query)}`;
  }

  private handleExportClicked = () => {
    this.props.openExportModal();
  };

  private handleFilterAdded = (filterType: string, filterValue: string) => {
    const { history, query } = this.props;
    const newQuery = { ...JSON.parse(JSON.stringify(query)) };

    if (newQuery.group_by[filterType]) {
      if (newQuery.group_by[filterType] === '*') {
        newQuery.group_by[filterType] = filterValue;
      } else if (!newQuery.group_by[filterType].includes(filterValue)) {
        newQuery.group_by[filterType] = [
          newQuery.group_by[filterType],
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

    if (filterType.indexOf('tag:') !== -1) {
      newQuery.group_by[filterType] = undefined;
    } else if (filterValue === '') {
      newQuery.group_by = {
        [filterType]: '*',
      };
    } else if (!Array.isArray(newQuery.group_by[filterType])) {
      newQuery.group_by[filterType] = '*';
    } else {
      const index = newQuery.group_by[filterType].indexOf(filterValue);
      if (index > -1) {
        newQuery.group_by[filterType] = [
          ...query.group_by[filterType].slice(0, index),
          ...query.group_by[filterType].slice(index + 1),
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
      order_by: { total: 'desc' },
    };
    if (groupBy.indexOf('tag:') !== -1) {
      newQuery.group_by.account = '*';
    }
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

  public updateReport = () => {
    const { query, location, fetchReport, history, queryString } = this.props;
    if (!location.search) {
      history.replace(
        this.getRouteForQuery({
          group_by: query.group_by,
          order_by: { total: 'desc' },
        })
      );
    } else {
      fetchReport(reportType, queryString);
    }
  };

  public render() {
    const { selectedItems } = this.state;
    const { query, report, t } = this.props;
    const groupById = getIdKeyForGroupBy(query.group_by);
    const filterFields = this.getFilterFields(groupById);
    const today = new Date();
    const computedItems = getUnsortedComputedAwsReportItems({
      report,
      idKey: groupById,
    });

    return (
      <div className={css(styles.awsDetails)}>
        <header className={css(styles.header)}>
          <GroupBy onItemClicked={this.handleGroupByClick} />
          {Boolean(report) && (
            <div className={css(styles.total)}>
              <Title className={css(styles.totalValue)} size="4xl">
                {formatCurrency(report.total.value)}
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
        <div className={css(styles.content)}>
          <div className={css(styles.toolbarContainer)}>
            <div className={toolbarOverride}>
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
              <ExportModal
                isAllItems={selectedItems.length === computedItems.length}
                groupById={groupById}
                items={selectedItems}
                query={query}
              />
            </div>
          </div>
          <div className={css(styles.tableContainer)}>
            <DetailsTable
              onSelected={this.handleSelected}
              onSort={this.handleSort}
              query={query}
              report={report}
            />
          </div>
        </div>
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
    delta: 'total',
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
  return {
    report,
    reportFetchStatus,
    queryString,
    query,
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
