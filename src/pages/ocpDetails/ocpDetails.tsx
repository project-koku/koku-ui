import { Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery, OcpQuery, parseQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { uiActions } from 'store/ui';
import { formatCurrency } from 'utils/formatValue';
import {
  ComputedOcpReportItem,
  getIdKeyForGroupBy,
  getUnsortedComputedOcpReportItems,
} from 'utils/getComputedOcpReportItems';
import { DetailsTable } from './detailsTable';
import { DetailsToolbar } from './detailsToolbar';
import ExportModal from './exportModal';
import { GroupBy } from './groupBy';
import { styles, toolbarOverride } from './ocpDetails.styles';

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
  columns: any[];
  rows: any[];
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

class OcpDetails extends React.Component<Props> {
  protected defaultState: State = {
    columns: [],
    rows: [],
    selectedItems: [],
  };
  public state: State = { ...this.defaultState };

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

  public componentDidUpdate(prevProps: Props) {
    const { location, report, queryString } = this.props;
    if (prevProps.queryString !== queryString || !report || !location.search) {
      this.updateReport();
    }
  }

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
    } else {
      // Default for group by project tags
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

  private getRouteForQuery(query: OcpQuery) {
    return `/ocp?${getQuery(query)}`;
  }

  // private isSelected = (item: ComputedOcpReportItem) => {
  //   const { selectedItems } = this.state;
  //   let selected = false;
  //
  //   for (const selectedItem of selectedItems) {
  //     if (selectedItem.label === item.label) {
  //       selected = true;
  //       break;
  //     }
  //   }
  //   return selected;
  // };
  //
  // private handleCheckboxAllChange = event => {
  //   const { query, report } = this.props;
  //
  //   let computedItems = [];
  //   if (event.currentTarget.checked) {
  //     const groupById = getIdKeyForGroupBy(query.group_by);
  //     computedItems = getUnsortedComputedOcpReportItems({
  //       report,
  //       idKey: groupById,
  //     });
  //   }
  //   this.setState({ selectedItems: computedItems });
  // };

  // private handleCheckboxChange = (
  //   checked: boolean,
  //   item: ComputedOcpReportItem
  // ) => {
  //   const { selectedItems } = this.state;
  //   let updated = [...selectedItems, item];
  //   if (!checked) {
  //     let index = -1;
  //     for (let i = 0; i < selectedItems.length; i++) {
  //       if (selectedItems[i].label === item.label) {
  //         index = i;
  //         break;
  //       }
  //     }
  //     if (index > -1) {
  //       updated = [
  //         ...selectedItems.slice(0, index),
  //         ...selectedItems.slice(index + 1),
  //       ];
  //     }
  //   }
  //   this.setState({ selectedItems: updated });
  // };

  private handleExportClicked = () => {
    this.props.openExportModal();
  };

  private handleFilterAdded = (filterType: string, filterValue: string) => {
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
  };

  private handleFilterRemoved = (filterType: string, filterValue: string) => {
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
  };

  private handleGroupByClick = groupBy => {
    const { history, query } = this.props;
    const groupByKey: keyof OcpQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...query,
      group_by: {
        [groupByKey]: '*',
      },
      order_by: { charge: 'desc' },
    };
    if (groupBy.indexOf('tag:') !== -1) {
      newQuery.group_by.project = '*';
    }
    history.replace(this.getRouteForQuery(newQuery));
    this.setState({ selectedItems: [] });
  };

  private handleSelected = (selectedItems: ComputedOcpReportItem[]) => {
    this.setState({ selectedItems });
  };

  private handleSort = (sortType: string, isSortAscending: boolean) => {
    const { history, query } = this.props;
    const newQuery = {
      ...query,
    };
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
          order_by: { charge: 'desc' },
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
    const computedItems = getUnsortedComputedOcpReportItems({
      report,
      idKey: groupById,
    });

    return (
      <div className={css(styles.ocpDetails)}>
        <header className={css(styles.header)}>
          <GroupBy onItemClicked={this.handleGroupByClick} />
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
      reportType,
      queryString
    );
    const reportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
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
