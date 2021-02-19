import './explorerTable.scss';

import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Spinner } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/js/icons/calculator-icon';
import { nowrap, sortable, SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { AwsQuery, getQuery } from 'api/queries/awsQuery';
import { orgUnitIdKey, tagPrefix } from 'api/queries/query';
import { parseQuery, Query } from 'api/queries/query';
import { AwsReport } from 'api/reports/awsReports';
import { ComputedReportItemType } from 'components/charts/common/chartDatumUtils';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { format, getDate, getMonth } from 'date-fns';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedExplorerReportItems';
import { ComputedReportItem, getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { formatCurrency } from 'utils/formatValue';

import { styles } from './explorerTable.styles';
import { DateRangeType, getDateRange, getDateRangeDefault, PerspectiveType } from './explorerUtils';

interface ExplorerTableOwnProps {
  computedReportItemType?: ComputedReportItemType;
  groupBy: string;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelected(items: ComputedReportItem[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
  perspective: PerspectiveType;
  query: AwsQuery;
  report: AwsReport;
  selectedItems?: ComputedReportItem[];
}

interface ExplorerTableStateProps {
  dateRange: DateRangeType;
  end_date?: string;
  start_date?: string;
}

interface ExplorerTableDispatchProps {
  // TBD...
}

interface ExplorerTableState {
  columns?: any[];
  loadingRows?: any[];
  rows?: any[];
}

type ExplorerTableProps = ExplorerTableOwnProps & ExplorerTableStateProps & WithTranslation;

class ExplorerTableBase extends React.Component<ExplorerTableProps> {
  public state: ExplorerTableState = {
    columns: [],
    rows: [],
  };

  constructor(props: ExplorerTableProps) {
    super(props);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSort = this.handleOnSort.bind(this);
  }

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: ExplorerTableProps) {
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
    const {
      computedReportItemType = ComputedReportItemType.cost,
      end_date,
      isAllSelected,
      perspective,
      query,
      report,
      selectedItems,
      start_date,
      t,
    } = this.props;
    if (!query || !report) {
      return;
    }

    const rows = [];
    const columns = [];
    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByOrg = this.getGroupByOrg();
    const groupByTagKey = this.getGroupByTagKey();

    // Add first column heading (i.e., name)
    if (groupByTagKey || groupByOrg) {
      columns.push({
        title: groupByOrg ? t('explorer.name_column_title') : t('explorer.tag_column_title'),
      });
    } else {
      columns.push({
        orderBy: groupById === 'account' && perspective !== PerspectiveType.gcp ? 'account_alias' : groupById,
        title: t('explorer.name_column_title', { groupBy: groupById }),
        transforms: [sortable],
        cellTransforms: [nowrap],
      });
    }

    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: groupByTagKey ? groupByTagKey : groupByOrg ? 'org_entities' : groupById,
      daily: true,
    });

    // Fill in missing data
    for (
      let currentDate = new Date(start_date + 'T00:00:00');
      currentDate <= new Date(end_date + 'T00:00:00');
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const mapId = format(currentDate, 'yyyy-MM-dd');

      // Add column headings
      const mapIdDate = new Date(mapId + 'T00:00:00');
      const date = getDate(mapIdDate);
      const month = getMonth(mapIdDate);
      columns.push({
        title: t('explorer.daily_column_title', { date, month }),
        cellTransforms: [nowrap],
      });

      computedItems.map(rowItem => {
        const item = rowItem.get(mapId);
        if (!item) {
          rowItem.set(mapId, {
            date: mapId,
          });
        }
      });
    }

    computedItems.map(rowItem => {
      const cells = [];
      let desc;
      let label;
      let id;

      const items: any = Array.from(rowItem.values()).sort((a: any, b: any) => {
        if (new Date(a.date) > new Date(b.date)) {
          return 1;
        } else if (new Date(a.date) < new Date(b.date)) {
          return -1;
        } else {
          return 0;
        }
      });

      items.map(item => {
        if (!label) {
          label = item && item.label && item.label !== null ? item.label : null;
        }
        if (!desc) {
          desc = item.id && item.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;
        }
        if (!id) {
          id = item.id;
        }

        // Add row cells
        cells.push({
          title:
            item[computedReportItemType] && item[computedReportItemType].total
              ? formatCurrency(item[computedReportItemType].total.value)
              : t('explorer.no_data'),
        });
      });

      // Add first row cell (i.e., name)
      cells.unshift({
        title: (
          <div>
            {label}
            {desc}
          </div>
        ),
      });

      rows.push({
        cells,
        item: items[0], // Any row cell contains the ID needed for row selection
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === id) !== undefined),
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

  private getEmptyState = () => {
    const { query, t } = this.props;

    for (const val of Object.values(query.filter_by)) {
      if (val !== '*') {
        return <EmptyFilterState filter={val} showMargin={false} />;
      }
    }
    return (
      <EmptyState>
        <EmptyStateIcon icon={CalculatorIcon} />
        <EmptyStateBody>{t('explorer.empty_state')}</EmptyStateBody>
      </EmptyState>
    );
  };

  private getGroupByOrg = () => {
    const { query } = this.props;
    let groupByOrg;

    for (const groupBy of Object.keys(query.group_by)) {
      if (groupBy === orgUnitIdKey) {
        groupByOrg = query.group_by[orgUnitIdKey];
        break;
      }
    }
    return groupByOrg;
  };

  private getGroupByTagKey = () => {
    const { query } = this.props;
    let groupByTagKey;

    for (const groupBy of Object.keys(query.group_by)) {
      const tagIndex = groupBy.indexOf(tagPrefix);
      if (tagIndex !== -1) {
        groupByTagKey = groupBy.substring(tagIndex + tagPrefix.length) as any;
        break;
      }
    }
    return groupByTagKey;
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
      <div style={styles.tableContainer}>
        <Table
          aria-label="explorer-table"
          canSelectAll={false}
          cells={columns}
          className="explorerTableOverride"
          rows={isLoading ? loadingRows : rows}
          sortBy={this.getSortBy()}
          onSelect={isLoading ? undefined : this.handleOnSelect}
          onSort={this.handleOnSort}
        >
          <TableHeader />
          <TableBody />
        </Table>
        {Boolean(rows.length === 0) && <div style={styles.emptyState}>{this.getEmptyState()}</div>}
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerTableOwnProps, ExplorerTableStateProps>((state, props) => {
  const queryFromRoute = parseQuery<Query>(location.search);
  const dateRange = getDateRangeDefault(queryFromRoute);
  const { end_date, start_date } = getDateRange(queryFromRoute);

  return {
    dateRange,
    end_date,
    start_date,
  };
});

const mapDispatchToProps: ExplorerTableDispatchProps = {};

const ExplorerTable = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ExplorerTableBase));

export { ExplorerTable, ExplorerTableProps };
