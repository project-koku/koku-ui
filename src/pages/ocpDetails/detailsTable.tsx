import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons';
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

interface DetailsTableState {
  columns?: any[];
  isHistoricalModalOpen?: boolean;
  rows?: any[];
}

type DetailsTableProps = DetailsTableOwnProps & InjectedTranslateProps;

class DetailsTableBase extends React.Component<DetailsTableProps> {
  public state: DetailsTableState = {
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
    this.initDatum();
  }

  public componentDidUpdate(prevProps: DetailsTableProps) {
    const { query, report } = this.props;
    const currentReport =
      report && report.data ? JSON.stringify(report.data) : '';
    const previousReport =
      prevProps.report && prevProps.report.data
        ? JSON.stringify(prevProps.report.data)
        : '';

    if (
      getQuery(prevProps.query) !== getQuery(query) ||
      previousReport !== currentReport
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
    const groupByTagKey = this.getGroupByTagKey();

    const total = formatCurrency(
      report && report.meta && report.meta.total
        ? report.meta.total.cost.value
        : 0
    );

    const columns = groupByTagKey
      ? [
          {
            title: t('ocp_details.tag_column_title'),
          },
          {
            title: t('ocp_details.change_column_title'),
          },
          {
            orderBy: 'cost',
            title: t('ocp_details.cost_column_title', { total }),
            transforms: [sortable],
          },
        ]
      : [
          {
            orderBy: groupById,
            title: t('ocp_details.name_column_title', { groupBy: groupById }),
            transforms: [sortable],
          },
          {
            title: t('ocp_details.change_column_title'),
          },
          {
            orderBy: 'cost',
            title: t('ocp_details.cost_column_title', { total }),
            transforms: [sortable],
          },
        ];

    const rows = [];
    const computedItems = getUnsortedComputedOcpReportItems({
      report,
      idKey: (groupByTagKey as any) || groupById,
    });

    computedItems.map((item, index) => {
      const label = item && item.label !== null ? item.label : '';
      const monthOverMonth = this.getMonthOverMonthCost(item, index);
      const cost = this.getTotalCost(item, index);
      rows.push(
        {
          cells: [
            { title: <div>{label}</div> },
            { title: <div>{monthOverMonth}</div> },
            { title: <div>{cost}</div> },
          ],
          isOpen: false,
          item,
          tableItem: {
            groupBy: groupByTagKey ? `tag:${groupByTagKey}` : groupById,
            index,
            item,
            query,
          },
        },
        {
          parent: index * 2,
          cells: [<div key={`${index * 2}-child`}>{t('loading')}</div>],
        }
      );
    });

    this.setState({
      columns,
      rows,
      sortBy: {},
    });
  };

  private getEmptyState = () => {
    const { t } = this.props;

    return (
      <EmptyState>
        <EmptyStateIcon icon={CalculatorIcon} />
        <EmptyStateBody>{t('aws_details.empty_state')}</EmptyStateBody>
      </EmptyState>
    );
  };

  private getGroupByTagKey = () => {
    const { query } = this.props;
    let groupByTagKey;

    for (const groupBy of Object.keys(query.group_by)) {
      const tagIndex = groupBy.indexOf('tag:');
      if (tagIndex !== -1) {
        groupByTagKey = groupBy.substring(tagIndex + 4) as any;
        break;
      }
    }
    return groupByTagKey;
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

  private getSortBy = () => {
    const { query } = this.props;
    const { columns } = this.state;
    const groupByTagKey = this.getGroupByTagKey();

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
          index = c + (groupByTagKey ? 1 : 2);
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

  private getTotalCost = (item: ComputedOcpReportItem, index: number) => {
    const { report, t } = this.props;
    const total = report.meta.total.cost.value;

    return (
      <>
        {formatCurrency(item.cost)}
        <div
          className={css(styles.infoDescription)}
          key={`total-cost-${index}`}
        >
          {t('percent_of_cost', {
            value: ((item.cost / total) * 100).toFixed(2),
          })}
        </div>
      </>
    );
  };

  private handleOnCollapse = (event, rowId, isOpen) => {
    const { t } = this.props;
    const { rows } = this.state;
    const {
      tableItem: { item, groupBy, query, index },
    } = rows[rowId];

    if (isOpen) {
      rows[rowId + 1].cells = [this.getTableItem(item, groupBy, query, index)];
    } else {
      rows[rowId + 1].cells = [
        <div key={`${index * 2}-child`}>{t('loading')}</div>,
      ];
    }
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
      const orderBy = columns[index - 2].orderBy;
      const isSortAscending = direction === SortByDirection.asc;
      onSort(orderBy, isSortAscending);
    }
  };

  public render() {
    const { columns, rows } = this.state;

    return (
      <>
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
        {Boolean(rows.length === 0) && (
          <div className={css(styles.emptyState)}>{this.getEmptyState()}</div>
        )}
      </>
    );
  }
}

const DetailsTable = translate()(connect()(DetailsTableBase));

export { DetailsTable, DetailsTableProps };
