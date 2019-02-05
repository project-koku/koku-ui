import { Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AwsQuery, getQuery, parseQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import { ListView } from 'patternfly-react';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { awsReportsActions, awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { uiActions } from 'store/ui';
import { formatCurrency } from 'utils/formatValue';
import {
  getIdKeyForGroupBy,
  getUnsortedComputedAwsReportItems,
} from 'utils/getComputedAwsReportItems';
import { ComputedAwsReportItem } from 'utils/getComputedAwsReportItems';
import { listViewOverride, styles, toolbarOverride } from './awsDetails.styles';
import { DetailsItem } from './detailsItem';
import { DetailsToolbar } from './detailsToolbar';
import ExportModal from './exportModal';
import { GroupBy } from './groupBy';

interface StateProps {
  report: AwsReport;
  reportFetchStatus: FetchStatus;
  queryString: string;
  query: AwsQuery;
}

interface DispatchProps {
  fetchReport: typeof awsReportsActions.fetchReport;
  openExportModal: typeof uiActions.openExportModal;
}

interface State {
  isGroupByOpen: boolean;
  selectedItems: ComputedAwsReportItem[];
}

type OwnProps = RouteComponentProps<void> & InjectedTranslateProps;

type Props = StateProps & OwnProps & DispatchProps;

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

class AwsDetails extends React.Component<Props> {
  protected defaultState: State = {
    isGroupByOpen: false,
    selectedItems: [],
  };
  public state: State = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleExportClicked = this.handleExportClicked.bind(this);
    this.handleFilterAdded = this.handleFilterAdded.bind(this);
    this.handleFilterRemoved = this.handleFilterRemoved.bind(this);
    this.handleSortChanged = this.handleSortChanged.bind(this);
  }

  public componentDidMount() {
    this.updateReport();
    this.setState({});
  }

  public componentDidUpdate(prevProps: Props) {
    const { location, report, queryString } = this.props;
    if (prevProps.queryString !== queryString || !report || !location.search) {
      this.updateReport();
    }
  }

  private getRouteForQuery(query: AwsQuery) {
    return `/aws?${getQuery(query)}`;
  }

  public handleCheckboxAllChange = event => {
    const { query, report } = this.props;

    let computedItems = [];
    if (event.currentTarget.checked) {
      const groupById = getIdKeyForGroupBy(query.group_by);
      computedItems = getUnsortedComputedAwsReportItems({
        report,
        idKey: groupById,
      });
    }
    this.setState({ selectedItems: computedItems });
  };

  public handleCheckboxChange = (
    checked: boolean,
    item: ComputedAwsReportItem
  ) => {
    const { selectedItems } = this.state;
    let updated = [...selectedItems, item];
    if (!checked) {
      let index = -1;
      for (let i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i].label === item.label) {
          index = i;
          break;
        }
      }
      if (index > -1) {
        updated = [
          ...selectedItems.slice(0, index),
          ...selectedItems.slice(index + 1),
        ];
      }
    }
    this.setState({ selectedItems: updated });
  };

  public handleExportClicked() {
    this.props.openExportModal();
  }

  public handleFilterAdded(filterType: string, filterValue: string) {
    const { history, query } = this.props;
    const newQuery = {
      ...query,
    };

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
  }

  public handleFilterRemoved(filterType: string, filterValue: string) {
    const { history, query } = this.props;
    const newQuery = {
      ...query,
    };

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
  }

  public handleGroupByClick = groupBy => {
    const { history, query } = this.props;
    const groupByKey: keyof AwsQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...query,
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

  public handleSortChanged(sortType: string, isSortAscending: boolean) {
    const { history, query } = this.props;
    const newQuery = {
      ...query,
    };
    newQuery.order_by = {};
    newQuery.order_by[sortType] = isSortAscending ? 'asc' : 'desc';
    const filteredQuery = this.getRouteForQuery(newQuery);
    history.replace(filteredQuery);
  }

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

  public getFilterFields = (groupById: string): any[] => {
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
          id: 'account',
          title: t('aws_details.filter.account_select'),
          placeholder: t('aws_details.filter.account_placeholder'),
          filterType: 'text',
        },
      ];
    }
    return [];
  };

  public getSortTypes = (groupById: string): any[] => {
    const { t } = this.props;
    if (groupById === 'account') {
      return [
        {
          id: 'account_alias',
          isNumeric: false,
          title: t('aws_details.order.name'),
        },
        {
          id: 'total',
          isNumeric: true,
          title: t('aws_details.order.cost'),
        },
      ];
    } else if (groupById === 'service') {
      return [
        {
          id: 'service',
          isNumeric: false,
          title: t('aws_details.order.name'),
        },
        {
          id: 'total',
          isNumeric: true,
          title: t('aws_details.order.cost'),
        },
      ];
    } else if (groupById === 'region') {
      return [
        {
          id: 'region',
          isNumeric: false,
          title: t('aws_details.order.name'),
        },
        {
          id: 'total',
          isNumeric: true,
          title: t('aws_details.order.cost'),
        },
      ];
    } else {
      // Default for group by project tags
      return [
        {
          id: 'account_alias',
          isNumeric: false,
          title: t('aws_details.order.name'),
        },
        {
          id: 'total',
          isNumeric: true,
          title: t('aws_details.order.cost'),
        },
      ];
    }
    return [];
  };

  public isSelected = (item: ComputedAwsReportItem) => {
    const { selectedItems } = this.state;
    let selected = false;

    for (const selectedItem of selectedItems) {
      if (selectedItem.label === item.label) {
        selected = true;
        break;
      }
    }
    return selected;
  };

  public render() {
    const { selectedItems } = this.state;
    const { query, report, t } = this.props;
    const groupById = getIdKeyForGroupBy(query.group_by);
    const filterFields = this.getFilterFields(groupById);
    const sortFields = this.getSortTypes(groupById);
    const today = new Date();
    const computedItems = getUnsortedComputedAwsReportItems({
      report,
      idKey: groupById,
    });

    let sortField = sortFields[0];
    for (const field of sortFields) {
      if (query.order_by && query.order_by[field.id]) {
        sortField = field;
        break;
      }
    }

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
                onSortChanged={this.handleSortChanged}
                sortField={sortField}
                sortFields={sortFields}
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
          <div className={listViewOverride}>
            <ListView>
              <ListView.Item
                key="header_item"
                heading={t('aws_details.name_column_title', {
                  groupBy: groupById,
                })}
                checkboxInput={
                  <input
                    type="checkbox"
                    checked={selectedItems.length === computedItems.length}
                    onChange={this.handleCheckboxAllChange}
                  />
                }
                additionalInfo={[
                  <ListView.InfoItem key="1">
                    <strong>{t('aws_details.change_column_title')}</strong>
                  </ListView.InfoItem>,
                ]}
                actions={[
                  <ListView.InfoItem key="2">
                    <strong>
                      {t('aws_details.cost_column_title')}
                      {Boolean(report) && (
                        <React.Fragment>
                          {t('aws_details.cost_column_subtitle', {
                            total: formatCurrency(report.total.value),
                          })}
                        </React.Fragment>
                      )}
                    </strong>
                  </ListView.InfoItem>,
                ]}
              />
              {computedItems.map((groupItem, index) => {
                return (
                  <DetailsItem
                    key={index}
                    parentQuery={query}
                    parentGroupBy={groupById}
                    item={groupItem}
                    onCheckboxChange={this.handleCheckboxChange}
                    selected={this.isSelected(groupItem)}
                    total={report.total.value}
                  />
                );
              })}
            </ListView>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<OwnProps, StateProps>(
  (state, props) => {
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
      AwsReportType.cost,
      queryString
    );
    const reportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
      state,
      AwsReportType.cost,
      queryString
    );
    return {
      report,
      reportFetchStatus,
      queryString,
      query,
    };
  }
);

const mapDispatchToProps: DispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
  openExportModal: uiActions.openExportModal,
};

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AwsDetails)
);
