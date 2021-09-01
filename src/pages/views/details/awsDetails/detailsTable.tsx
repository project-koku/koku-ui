import './awsDetailsTable.scss';

import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Spinner } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import { sortable, SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { AwsQuery, getQuery } from 'api/queries/awsQuery';
import { tagPrefix } from 'api/queries/query';
import { AwsReport } from 'api/reports/awsReports';
import { ReportPathsType } from 'api/reports/report';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import messages from 'locales/messages';
import { Actions } from 'pages/views/details/components/actions/actions';
import { getGroupByOrgValue, getGroupByTagKey } from 'pages/views/utils/groupBy';
import { getOrgBreakdownPath } from 'pages/views/utils/paths';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Link } from 'react-router-dom';
import { paths } from 'routes';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedAwsReportItems';
import { ComputedReportItem, getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { getForDateRangeString, getNoDataForDateRangeString } from 'utils/dateRange';
import { formatCurrency } from 'utils/formatValue';

import { styles } from './detailsTable.styles';

interface DetailsTableOwnProps {
  groupBy: string;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelected(items: ComputedReportItem[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
  query: AwsQuery;
  report: AwsReport;
  selectedItems?: ComputedReportItem[];
}

interface DetailsTableState {
  columns?: any[];
  loadingRows?: any[];
  rows?: any[];
}

type DetailsTableProps = DetailsTableOwnProps & WrappedComponentProps;

const reportPathsType = ReportPathsType.aws;

class DetailsTableBase extends React.Component<DetailsTableProps> {
  public state: DetailsTableState = {
    columns: [],
    rows: [],
  };

  constructor(props: DetailsTableProps) {
    super(props);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSort = this.handleOnSort.bind(this);
  }

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: DetailsTableProps) {
    const { query, report, selectedItems } = this.props;
    const currentReport = report && report.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps.report && prevProps.report.data ? JSON.stringify(prevProps.report.data) : '';

    if (
      getQuery(prevProps.query) !== getQuery(query) ||
      previousReport !== currentReport ||
      prevProps.selectedItems !== selectedItems
    ) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { isAllSelected, query, report, selectedItems, intl } = this.props;
    if (!query || !report) {
      return;
    }

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByOrg = getGroupByOrgValue(query);
    const groupByTagKey = getGroupByTagKey(query);

    const columns =
      groupByTagKey || groupByOrg
        ? [
            {
              title: intl.formatMessage(groupByOrg ? messages.Names : messages.TagNames),
            },
            {
              title: intl.formatMessage(messages.MonthOverMonthChange),
            },
            {
              orderBy: 'cost',
              title: intl.formatMessage(messages.Cost),
              transforms: [sortable],
            },
            {
              title: '',
            },
          ]
        : [
            {
              orderBy: groupById === 'account' ? 'account_alias' : groupById,
              title: intl.formatMessage(messages.DetailsResourceNames, { value: groupById }),
              transforms: [sortable],
            },
            {
              title: intl.formatMessage(messages.MonthOverMonthChange),
            },
            {
              orderBy: 'cost',
              title: intl.formatMessage(messages.Cost),
              transforms: [sortable],
            },
            {
              title: '',
            },
          ];

    const rows = [];
    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: groupByTagKey ? groupByTagKey : groupByOrg ? 'org_entities' : groupById,
    });

    computedItems.map((item, index) => {
      const label = item && item.label && item.label !== null ? item.label : '';
      const monthOverMonth = this.getMonthOverMonthCost(item, index);
      const cost = this.getTotalCost(item, index);
      const actions = this.getActions(item, index);

      let name = (
        <Link
          to={getOrgBreakdownPath({
            basePath: paths.awsDetailsBreakdown,
            description: item.id,
            groupBy: groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById,
            groupByOrg,
            id: item.id,
            orgUnitId: getGroupByOrgValue(query),
            query,
            title: item.label,
            type: item.type,
          })}
        >
          {label}
        </Link>
      );

      const selectable = !(label === `no-${groupById}` || label === `no-${groupByTagKey}`);
      if (!selectable) {
        name = label as any;
      }

      const desc = item.id && item.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;

      rows.push({
        cells: [
          {
            title: (
              <div>
                {name}
                {desc}
              </div>
            ),
          },
          { title: <div>{monthOverMonth}</div> },
          { title: <div>{cost}</div> },
          { title: <div>{actions}</div> },
        ],
        disableSelection: !selectable,
        item,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === item.id) !== undefined),
      });
    });

    const loadingRows = [
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: 5 },
            title: (
              <Bullseye>
                <div style={{ textAlign: 'center' }}>
                  <Spinner size="xl" />
                </div>
              </Bullseye>
            ),
          },
        ],
      },
    ];

    this.setState({
      columns,
      loadingRows,
      rows,
      sortBy: {},
    });
  };

  private getActions = (item: ComputedReportItem, index: number, disabled: boolean = false) => {
    const { groupBy, query } = this.props;

    return (
      <Actions groupBy={groupBy} isDisabled={disabled} item={item} query={query} reportPathsType={reportPathsType} />
    );
  };

  private getEmptyState = () => {
    const { query, intl } = this.props;

    for (const val of Object.values(query.filter_by)) {
      if (val !== '*') {
        return <EmptyFilterState filter={val as string} showMargin={false} />;
      }
    }
    return (
      <EmptyState>
        <EmptyStateIcon icon={CalculatorIcon} />
        <EmptyStateBody>{intl.formatMessage(messages.DetailsEmptyState)}</EmptyStateBody>
      </EmptyState>
    );
  };

  private getMonthOverMonthCost = (item: ComputedReportItem, index: number) => {
    const { intl } = this.props;
    const value = formatCurrency(Math.abs(item.cost.total.value - item.delta_value));
    const percentage = item.delta_percent !== null ? Math.abs(item.delta_percent).toFixed(2) : 0;

    const showPercentage = !(percentage === 0 || percentage === '0.00');
    const showValue = item.delta_percent !== null; // Workaround for https://github.com/project-koku/koku/issues/1395

    let iconOverride;
    if (showPercentage) {
      iconOverride = 'iconOverride';
      if (item.delta_percent !== null && item.delta_value < 0) {
        iconOverride += ' decrease';
      }
      if (item.delta_percent !== null && item.delta_value > 0) {
        iconOverride += ' increase';
      }
    }

    if (!showValue) {
      return getNoDataForDateRangeString();
    } else {
      return (
        <div className="monthOverMonthOverride">
          <div className={iconOverride} key={`month-over-month-cost-${index}`}>
            {showPercentage ? intl.formatMessage(messages.Percent, { value: percentage }) : <EmptyValueState />}
            {Boolean(showPercentage && item.delta_percent !== null && item.delta_value > 0) && (
              <span className="fa fa-sort-up" style={styles.infoArrow} key={`month-over-month-icon-${index}`} />
            )}
            {Boolean(showPercentage && item.delta_percent !== null && item.delta_value < 0) && (
              <span
                className="fa fa-sort-down"
                style={{
                  ...styles.infoArrow,
                  ...styles.infoArrowDesc,
                }}
                key={`month-over-month-icon-${index}`}
              />
            )}
          </div>
          <div style={styles.infoDescription} key={`month-over-month-info-${index}`}>
            {getForDateRangeString(value)}
          </div>
        </div>
      );
    }
  };

  public getSortBy = () => {
    const { query } = this.props;
    const { columns } = this.state;

    let index = -1;
    let direction: any = SortByDirection.asc;

    for (const key of Object.keys(query.order_by)) {
      let c = 0;
      for (const column of columns) {
        if (column.orderBy === key) {
          direction = query.order_by[key] === 'asc' ? SortByDirection.asc : SortByDirection.desc;
          index = c + 1;
          break;
        }
        c++;
      }
    }
    return index > -1 ? { index, direction } : {};
  };

  private getTotalCost = (item: ComputedReportItem, index: number) => {
    const { report, intl } = this.props;
    const cost =
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total
        ? report.meta.total.cost.total.value
        : 0;
    const percentValue = cost === 0 ? cost.toFixed(2) : ((item.cost.total.value / cost) * 100).toFixed(2);

    return (
      <>
        {formatCurrency(item.cost.total.value)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {intl.formatMessage(messages.PercentOfCost, { value: percentValue })}
        </div>
      </>
    );
  };

  private handleOnSelect = (event, isSelected, rowId) => {
    const { onSelected } = this.props;

    let rows;
    let items = [];
    if (rowId === -1) {
      rows = this.state.rows.map(row => {
        row.selected = isSelected;
        return row;
      });
    } else {
      rows = [...this.state.rows];
      rows[rowId].selected = isSelected;
      items = [rows[rowId].item];
    }
    this.setState({ rows }, () => {
      if (onSelected) {
        onSelected(items, isSelected);
      }
    });
  };

  private handleOnSort = (event, index, direction) => {
    const { onSort } = this.props;
    const { columns } = this.state;

    if (onSort) {
      const orderBy = columns[index - 1].orderBy;
      const isSortAscending = direction === SortByDirection.asc;
      onSort(orderBy, isSortAscending);
    }
  };

  public render() {
    const { isLoading } = this.props;
    const { columns, loadingRows, rows } = this.state;

    return (
      <>
        <Table
          aria-label="details-table"
          canSelectAll={false}
          cells={columns}
          className="tableOverride"
          rows={isLoading ? loadingRows : rows}
          sortBy={this.getSortBy()}
          onSelect={isLoading ? undefined : this.handleOnSelect}
          onSort={this.handleOnSort}
          gridBreakPoint="grid-2xl"
        >
          <TableHeader />
          <TableBody />
        </Table>
        {Boolean(rows.length === 0) && <div style={styles.emptyState}>{this.getEmptyState()}</div>}
      </>
    );
  }
}

const DetailsTable = injectIntl(DetailsTableBase);

export { DetailsTable, DetailsTableProps };
