import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery, OcpQuery, parseQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import { ListView } from 'patternfly-react';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { uiActions } from 'store/ui';
import { formatCurrency } from 'utils/formatValue';
import {
  GetComputedOcpReportItemsParams,
  getIdKeyForGroupBy,
  getUnsortedComputedOcpReportItems,
} from 'utils/getComputedOcpReportItems';
import { ComputedOcpReportItem } from '../../utils/getComputedOcpReportItems';
import { DetailsItem } from './detailsItem';
import { DetailsToolbar } from './detailsToolbar';
import ExportModal from './exportModal';
import { listViewOverride, styles, toolbarOverride } from './ocpDetails.styles';

interface StateProps {
  report: OcpReport;
  reportFetchStatus: FetchStatus;
  queryString: string;
  query: OcpQuery;
}

interface DispatchProps {
  fetchReport: typeof ocpReportsActions.fetchReport;
  openExportModal: typeof uiActions.openExportModal;
}

interface State {
  isGroupByOpen: boolean;
  selectedItems: ComputedOcpReportItem[];
}

type OwnProps = RouteComponentProps<void> & InjectedTranslateProps;

type Props = StateProps & OwnProps & DispatchProps;

const reportType = OcpReportType.charge;

const baseQuery: OcpQuery = {
  delta: 'charge',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
  group_by: {
    project: '*',
  },
  order_by: {
    charge: 'desc',
  },
};

const groupByOptions: {
  label: string;
  value: GetComputedOcpReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
];

class OcpDetails extends React.Component<Props> {
  protected defaultState: State = {
    isGroupByOpen: false,
    selectedItems: [],
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

  public handleGroupByItemClick = (event, groupBy) => {
    const { history, query } = this.props;
    const groupByKey: keyof OcpQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...query,
      group_by: {
        [groupByKey]: '*',
      },
      order_by: { charge: 'desc' },
    };
    history.replace(this.getRouteForQuery(newQuery));
    this.setState({ selectedItems: [] });
  };

  public handleGroupBySelect = event => {
    this.setState({
      isGroupByOpen: !this.state.isGroupByOpen,
    });
  };

  public handleGroupByToggle = isGroupByOpen => {
    this.setState({
      isGroupByOpen,
    });
  };

  private getRouteForQuery(query: OcpQuery) {
    return `/ocp?${getQuery(query)}`;
  }

  public onCheckboxChange = (checked: boolean, item: ComputedOcpReportItem) => {
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
      computedItems = getUnsortedComputedOcpReportItems({
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
        query.group_by[filterType] = [
          ...query.group_by[filterType].slice(0, index),
          ...query.group_by[filterType].slice(index + 1),
        ];
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
          order_by: { charge: 'desc' },
        })
      );
    } else {
      fetchReport(reportType, queryString);
    }
  };

  public getFilterFields = (groupById: string): any[] => {
    const { t } = this.props;
    if (groupById === 'cluster') {
      return [
        {
          id: 'cluster',
          title: t('ocp_details.filter.cluster_select'),
          placeholder: t('ocp_details.filter.cluster_placeholder'),
          filterType: 'text',
        },
      ];
    } else if (groupById === 'node') {
      return [
        {
          id: 'node',
          title: t('ocp_details.filter.node_select'),
          placeholder: t('ocp_details.filter.node_placeholder'),
          filterType: 'text',
        },
      ];
    } else if (groupById === 'project') {
      return [
        {
          id: 'project',
          title: t('ocp_details.filter.project_select'),
          placeholder: t('ocp_details.filter.project_placeholder'),
          filterType: 'text',
        },
      ];
    }
    return [];
  };

  public getSortTypes = (groupById: string): any[] => {
    const { t } = this.props;
    if (groupById === 'cluster') {
      return [
        {
          id: 'cluster',
          isNumeric: false,
          title: t('ocp_details.order.name'),
        },
        {
          id: 'charge',
          isNumeric: true,
          title: t('ocp_details.order.charge'),
        },
      ];
    } else if (groupById === 'node') {
      return [
        {
          id: 'node',
          isNumeric: false,
          title: t('ocp_details.order.name'),
        },
        {
          id: 'charge',
          isNumeric: true,
          title: t('ocp_details.order.charge'),
        },
      ];
    } else if (groupById === 'project') {
      return [
        {
          id: 'project',
          isNumeric: false,
          title: t('ocp_details.order.name'),
        },
        {
          id: 'charge',
          isNumeric: true,
          title: t('ocp_details.order.charge'),
        },
      ];
    }
    return [];
  };

  public isSelected = (item: ComputedOcpReportItem) => {
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
    const { isGroupByOpen, selectedItems } = this.state;
    const { query, report, t } = this.props;
    const groupById = getIdKeyForGroupBy(query.group_by);
    const filterFields = this.getFilterFields(groupById);
    const sortFields = this.getSortTypes(groupById);
    const today = new Date();
    const computedItems = getUnsortedComputedOcpReportItems({
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
      <div className={css(styles.ocpDetails)}>
        <header className={css(styles.header)}>
          <div>
            <Title className={css(styles.title)} size="2xl">
              {t('ocp_details.title')}
            </Title>
            <div className={css(styles.groupBySelector)}>
              <label className={css(styles.groupBySelectorLabel)}>
                {t('group_by.charges')}:
              </label>
              <Dropdown
                onClick={event => event.preventDefault()}
                onSelect={this.handleGroupBySelect}
                toggle={
                  <DropdownToggle onToggle={this.handleGroupByToggle}>
                    {t(`group_by.values.${groupById}`)}
                  </DropdownToggle>
                }
                isOpen={isGroupByOpen}
                dropdownItems={groupByOptions.map(option => (
                  <DropdownItem
                    key={option.value}
                    onClick={event =>
                      this.handleGroupByItemClick(event, option.value)
                    }
                  >
                    {t(`group_by.values.${option.label}`)}
                  </DropdownItem>
                ))}
              />
            </div>
          </div>
          {Boolean(report) && (
            <div className={css(styles.charge)}>
              <Title className={css(styles.chargeValue)} size="4xl">
                {formatCurrency(report.total.charge)}
              </Title>
              <div className={css(styles.chargeLabel)}>
                <div className={css(styles.chargeLabelUnit)}>
                  {t('ocp_details.total_charge')}
                </div>
                <div className={css(styles.chargeLabelDate)}>
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
                exportText={t('ocp_details.export_link')}
                filterFields={filterFields}
                isExportDisabled={selectedItems.length === 0}
                onExportClicked={this.onExportClicked}
                onFilterAdded={this.onFilterAdded}
                onFilterRemoved={this.onFilterRemoved}
                onSortChanged={this.onSortChanged}
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
                heading={t('ocp_details.name_column_title', {
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
                    <strong>{t('ocp_details.change_column_title')}</strong>
                  </ListView.InfoItem>,
                ]}
                actions={[
                  <ListView.InfoItem key="2">
                    <strong>
                      {t('ocp_details.cost_column_title')}
                      {Boolean(report) && (
                        <React.Fragment>
                          {t('ocp_details.cost_column_subtitle', {
                            charge: formatCurrency(report.total.charge),
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
                    charge={report.total.charge}
                    key={index}
                    parentQuery={query}
                    parentGroupBy={groupById}
                    item={groupItem}
                    onCheckboxChange={this.onCheckboxChange}
                    selected={this.isSelected(groupItem)}
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
    const queryFromRoute = parseQuery<OcpQuery>(location.search);
    const query = {
      delta: 'charge',
      filter: {
        ...baseQuery.filter,
        ...queryFromRoute.filter,
      },
      group_by: queryFromRoute.group_by || baseQuery.group_by,
      order_by: queryFromRoute.order_by || baseQuery.order_by,
    };
    const queryString = getQuery(query);
    const report = ocpReportsSelectors.selectReport(
      state,
      OcpReportType.charge,
      queryString
    );
    const reportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
      state,
      OcpReportType.charge,
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
  fetchReport: ocpReportsActions.fetchReport,
  openExportModal: uiActions.openExportModal,
};

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OcpDetails)
);
