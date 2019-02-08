import { css } from '@patternfly/react-styles';
import {
  sortable,
  SortByDirection,
  Table,
  TableBody,
  TableHeader,
} from '@patternfly/react-table';
import { getQuery, OcpQuery } from 'api/ocpQuery';
import { OcpReport } from 'api/ocpReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { formatCurrency } from 'utils/formatValue';
import {
  getIdKeyForGroupBy,
  getUnsortedComputedOcpReportItems,
} from 'utils/getComputedOcpReportItems';
import { ComputedOcpReportItem } from 'utils/getComputedOcpReportItems';
import {
  monthOverMonthOverride,
  styles,
  tableOverride,
} from './detailsTable.styles';
import { DetailsTableItem } from './detailsTableItem';

interface DetailsTableOwnProps {
  onSelected(selectedItems: ComputedOcpReportItem[]);
  onSort(value: string, isSortAscending: boolean);
  query: OcpQuery;
  report: OcpReport;
}

interface State {
  columns?: any[];
  isHistoricalModalOpen?: boolean;
  rows?: any[];
}

type DetailsTableProps = DetailsTableOwnProps & InjectedTranslateProps;

class DetailsTableBase extends React.Component<DetailsTableProps> {
  public state: State = {
    columns: [],
    isHistoricalModalOpen: false,
    rows: [],
  };

  constructor(props: DetailsTableProps) {
    super(props);
    this.handleOnCollapse = this.handleOnCollapse.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSort = this.handleOnSort.bind(this);
  }

  public componentDidMount() {
    this.setState({});
  }

  public componentDidUpdate(prevProps: DetailsTableProps) {
    const { query, report } = this.props;
    if (
      report !== prevProps.report ||
      getQuery(query) !== getQuery(prevProps.query)
    ) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { query, report, t } = this.props;
    if (!query || !report) {
      return;
    }

    const groupById = getIdKeyForGroupBy(query.group_by);
    const total =
      report && report.total ? formatCurrency(report.total.charge) : 0;

    const columns = [
      {
        orderBy: groupById,
        title: t('ocp_details.name_column_title', { groupBy: groupById }),
        transforms: [sortable],
      },
      {
        title: t('ocp_details.change_column_title'),
      },
      {
        orderBy: 'charge',
        title: t('ocp_details.charge_column_title', { total }),
        transforms: [sortable],
      },
    ];

    const rows = [];
    const computedItems = getUnsortedComputedOcpReportItems({
      report,
      idKey: groupById,
    });

    computedItems.map((item, index) => {
      rows.push(
        {
          cells: [
            item.label,
            this.getMonthOverMonthCost(item, index),
            this.getTotalCost(item, index),
          ],
          isOpen: false,
          item,
        },
        {
          parent: index,
          cells: [this.getTableItem(item, groupById, query, index)],
        }
      );
    });

    this.setState({
      columns,
      rows,
      sortBy: {},
    });
  };

  public getSortBy = () => {
    const { query } = this.props;
    const { columns } = this.state;

    let index = -1;
    let direction = 'asc';

    for (const key of Object.keys(query.order_by)) {
      let c = 0;
      for (const column of columns) {
        if (column.orderBy === key) {
          direction =
            query.order_by[key] === 'asc'
              ? SortByDirection.asc
              : SortByDirection.desc;
          index = c + 1;
          break;
        }
        c++;
      }
    }
    return index > -1 ? { index, direction } : {};
  };

  private getTableItem = (
    item: ComputedOcpReportItem,
    groupBy: string,
    query: OcpQuery,
    index: number
  ) => {
    return (
      <>
        <DetailsTableItem
          groupBy={groupBy}
          item={item}
          key={`table-item-${index}`}
        />
      </>
    );
  };

  private getMonthOverMonthCost = (
    item: ComputedOcpReportItem,
    index: number
  ) => {
    const { t } = this.props;

    const today = new Date();
    const date = today.getDate();
    const month = (((today.getMonth() - 1) % 12) + 12) % 12;
    const value = formatCurrency(Math.abs(item.deltaValue));
    const percentage =
      item.deltaPercent !== null ? Math.abs(item.deltaPercent).toFixed(2) : 0;

    let iconOverride = 'iconOverride';
    if (item.deltaPercent !== null && item.deltaValue < 0) {
      iconOverride += ' decrease';
    }
    if (item.deltaPercent !== null && item.deltaValue > 0) {
      iconOverride += ' increase';
    }

    return (
      <div className={monthOverMonthOverride}>
        <div className={iconOverride} key={`month-over-month-cost-${index}`}>
          {t('percent', { value: percentage })}
          {Boolean(item.deltaPercent !== null && item.deltaValue > 0) && (
            <span
              className={css('fa fa-sort-asc', styles.infoArrow)}
              key={`month-over-month-icon-${index}`}
            />
          )}
          {Boolean(item.deltaPercent !== null && item.deltaValue < 0) && (
            <span
              className={css(
                'fa fa-sort-desc',
                styles.infoArrow,
                styles.infoArrowDesc
              )}
              key={`month-over-month-icon-${index}`}
            />
          )}
        </div>
        <div
          className={css(styles.infoDescription)}
          key={`month-over-month-info-${index}`}
        >
          {Boolean(item.deltaPercent !== null && item.deltaValue > 0)
            ? Boolean(date < 31)
              ? t('ocp_details.increase_since_date', { date, month, value })
              : t('ocp_details.increase_since_last_month', {
                  date,
                  month,
                  value,
                })
            : Boolean(item.deltaPercent !== null && item.deltaValue < 0)
              ? Boolean(date < 31)
                ? t('ocp_details.decrease_since_date', { date, month, value })
                : t('ocp_details.decrease_since_last_month', {
                    date,
                    month,
                    value,
                  })
              : t('ocp_details.no_change_since_date', { date, month })}
        </div>
      </div>
    );
  };

  private getTotalCost = (item: ComputedOcpReportItem, index: number) => {
    const { report, t } = this.props;
    const total = report.total.charge;

    return (
      <>
        {formatCurrency(item.charge)}
        <div
          className={css(styles.infoDescription)}
          key={`total-cost-${index}`}
        >
          {t('percent_of_charge', {
            value: ((item.charge / total) * 100).toFixed(2),
          })}
        </div>
      </>
    );
  };

  private handleOnCollapse = (event, rowId, isOpen) => {
    const { rows } = this.state;
    rows[rowId].isOpen = isOpen;
    this.setState({
      rows,
    });
  };

  private handleOnSelect = (event, isSelected, rowId) => {
    const { onSelected } = this.props;

    let rows;
    if (rowId === -1) {
      rows = this.state.rows.map(row => {
        row.selected = isSelected;
        return row;
      });
    } else {
      rows = [...this.state.rows];
      rows[rowId].selected = isSelected;
    }

    if (onSelected) {
      const selectedItems = [];
      for (const row of rows) {
        if (row.selected && row.item && !row.parent) {
          selectedItems.push(row.item);
        }
      }
      onSelected(selectedItems);
    }
    this.setState({ rows });
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
    const { columns, rows } = this.state;

    if (columns && columns.length && rows && rows.length) {
      return (
        <Table
          aria-label="details-table"
          cells={columns}
          className={tableOverride}
          onCollapse={this.handleOnCollapse}
          rows={rows}
          sortBy={this.getSortBy()}
          onSelect={this.handleOnSelect}
          onSort={this.handleOnSort}
        >
          <TableHeader />
          <TableBody />
        </Table>
      );
    } else {
      return null;
    }
  }
}

const DetailsTable = translate()(connect()(DetailsTableBase));

export { DetailsTable, DetailsTableBase, DetailsTableProps };
