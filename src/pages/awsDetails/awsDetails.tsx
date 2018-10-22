import { css } from '@patternfly/react-styles';
import { getQuery, parseQuery, Query } from 'api/query';
import { Report, ReportType } from 'api/reports';
import { ListView } from 'patternfly-react';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportsActions, reportsSelectors } from 'store/reports';
import { uiActions } from 'store/ui';
import { formatCurrency } from 'utils/formatValue';
import {
  GetComputedReportItemsParams,
  getIdKeyForGroupBy,
  getUnsortedComputedReportItems,
} from 'utils/getComputedReportItems';
import {
  GroupBySelector,
  ListHeader,
  Toolbar,
  TotalSummary,
} from '../../components/list';
import { ComputedReportItem } from '../../utils/getComputedReportItems';
import { listViewOverride, styles, toolbarOverride } from './awsDetails.styles';
import { DetailsItem } from './detailsItem';
import { DetailsToolbar } from './detailsToolbar';
import ExportModal from './exportModal';

interface StateProps {
  report: Report;
  reportFetchStatus: FetchStatus;
  queryString: string;
  query: Query;
}

interface DispatchProps {
  fetchReport: typeof reportsActions.fetchReport;
  openExportModal: typeof uiActions.openExportModal;
}

interface State {
  selectedItems: ComputedReportItem[];
  filterValue: string;
}

type OwnProps = RouteComponentProps<void> & InjectedTranslateProps;

type Props = StateProps & OwnProps & DispatchProps;

const reportType = ReportType.cost;

const baseQuery: Query = {
  delta: true,
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

const groupByOptions: {
  label: string;
  value: GetComputedReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

class AwsDetails extends React.Component<Props> {
  protected defaultState: State = {
    selectedItems: [],
    filterValue: '',
  };
  public state: State = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onExportClicked = this.onExportClicked.bind(this);
    this.onFilterAdded = this.onFilterAdded.bind(this);
    this.onFilterRemoved = this.onFilterRemoved.bind(this);
    this.onSortChanged = this.onSortChanged.bind(this);
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

  public handleSelectChange = (value: string) => {
    const { history } = this.props;
    const groupByKey: keyof Query['group_by'] = value as keyof Query['group_by'];
    const newQuery: Query = {
      group_by: {
        [groupByKey]: '*',
      },
      order_by: { total: 'desc' },
    };
    history.replace(this.getRouteForQuery(newQuery));
    this.setState({ selectedItems: [] });
  };

  private getRouteForQuery(query: Query) {
    return `/aws?${getQuery(query)}`;
  }

  public onCheckboxChange = (checked: boolean, item: ComputedReportItem) => {
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

  public onCheckboxAllChange = event => {
    const { query, report } = this.props;

    let computedItems = [];
    if (event.currentTarget.checked) {
      const groupById = getIdKeyForGroupBy(query.group_by);
      computedItems = getUnsortedComputedReportItems({
        report,
        idKey: groupById,
      });
    }
    this.setState({ selectedItems: computedItems });
  };

  public onExportClicked() {
    this.props.openExportModal();
  }

  public onFilterAdded(filterType: string, filterValue: string) {
    const { history, query } = this.props;
    if (query.group_by[filterType]) {
      if (query.group_by[filterType] === '*') {
        query.group_by[filterType] = filterValue;
      } else if (!query.group_by[filterType].includes(filterValue)) {
        query.group_by[filterType] = [query.group_by[filterType], filterValue];
      }
    } else {
      query.group_by[filterType] = [filterValue];
    }
    const filteredQuery = this.getRouteForQuery(query);
    history.replace(filteredQuery);
  }

  public onFilterRemoved(filterType: string, filterValue: string) {
    const { history, query } = this.props;
    if (filterValue === '' || !Array.isArray(query.group_by[filterType])) {
      query.group_by[filterType] = '*';
    } else {
      const index = query.group_by[filterType].indexOf(filterValue);
      if (index > -1) {
        const updated = [
          ...query.group_by[filterType].slice(0, index),
          ...query.group_by[filterType].slice(index + 1),
        ];
        query.group_by[filterType] = updated;
      }
    }
    const filteredQuery = this.getRouteForQuery(query);
    history.replace(filteredQuery);
  }

  public onSortChanged(sortType: string, isSortAscending: boolean) {
    const { history, query } = this.props;
    query.order_by = {};
    query.order_by[sortType] = isSortAscending ? 'asc' : 'desc';
    const filteredQuery = this.getRouteForQuery(query);
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
    }
    return [];
  };

  public isSelected = (item: ComputedReportItem) => {
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
    const computedItems = getUnsortedComputedReportItems({
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
        <ListHeader>
          <React.Fragment>
            <div>
              <GroupBySelector
                title={t('aws_details.title')}
                label={t('group_by.cost')}
                onChange={this.handleSelectChange}
                initValue={groupById}
                options={groupByOptions.map(opt => ({
                  ...opt,
                  label: t(`group_by.values.${opt.label}`),
                }))}
              />
            </div>
            {Boolean(report) && (
              <TotalSummary
                value={formatCurrency(report.total.value)}
                totalLabel={t('aws_details.total_cost')}
                dateLabel={t('since_date', {
                  month: today.getMonth(),
                  date: 1,
                })}
              />
            )}
          </React.Fragment>
        </ListHeader>
        <div className={css(styles.content)}>
          <div className={css(styles.toolbarContainer)}>
            <div className={toolbarOverride}>
              <Toolbar
                value={this.state.filterValue}
                placeholder={filterFields.placeholder}
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
                    onChange={this.onCheckboxAllChange}
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
                    onCheckboxChange={this.onCheckboxChange}
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
    const queryFromRoute = parseQuery<Query>(props.location.search);
    const query = {
      delta: true,
      filter: {
        ...baseQuery.filter,
        ...queryFromRoute.filter,
      },
      group_by: queryFromRoute.group_by || baseQuery.group_by,
      order_by: queryFromRoute.order_by || baseQuery.order_by,
    };
    const queryString = getQuery(query);
    const report = reportsSelectors.selectReport(
      state,
      ReportType.cost,
      queryString
    );
    const reportFetchStatus = reportsSelectors.selectReportFetchStatus(
      state,
      ReportType.cost,
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
  fetchReport: reportsActions.fetchReport,
  openExportModal: uiActions.openExportModal,
};

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AwsDetails)
);
