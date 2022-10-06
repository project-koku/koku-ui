import './explorerTable.scss';

import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Spinner } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import { nowrap, sortable, SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { AwsQuery, getQuery } from 'api/queries/awsQuery';
import { parseQuery, Query } from 'api/queries/query';
import { AwsReport } from 'api/reports/awsReports';
import { format, getDate, getMonth } from 'date-fns';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState';
import { ComputedReportItemType, ComputedReportItemValueType } from 'routes/views/components/charts/common/chartDatum';
import { getGroupByOrgValue, getGroupByTagKey } from 'routes/views/utils/groupBy';
import { createMapStateToProps } from 'store/common';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedExplorerReportItems';
import { ComputedReportItem, getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { formatCurrency } from 'utils/format';

import { styles } from './explorerTable.styles';
import { DateRangeType, getDateRange, getDateRangeDefault, PerspectiveType } from './explorerUtils';

interface ExplorerTableOwnProps {
  computedReportItemType?: ComputedReportItemType;
  computedReportItemValueType?: ComputedReportItemValueType;
  groupBy: string;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelected(items: ComputedReportItem[], isSelected: boolean);
  onSort(value: string, date: string, isSortAscending: boolean);
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

type ExplorerTableProps = ExplorerTableOwnProps & ExplorerTableStateProps & WrappedComponentProps;

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
      computedReportItemValueType = ComputedReportItemValueType.total,
      end_date,
      isAllSelected,
      perspective,
      query,
      report,
      selectedItems,
      start_date,
      intl,
    } = this.props;
    if (!query || !report) {
      return;
    }

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByOrg = getGroupByOrgValue(query);
    const groupByTagKey = getGroupByTagKey(query);
    const rows = [];

    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: groupByTagKey ? groupByTagKey : groupByOrg ? 'org_entities' : groupById,
      isDateMap: true,
    });

    // Add first column heading (i.e., name)
    const columns =
      groupByTagKey || groupByOrg
        ? [
            {
              cellTransforms: [nowrap],
              title: groupByOrg
                ? intl.formatMessage(messages.names, { count: 2 })
                : intl.formatMessage(messages.tagNames),
            },
          ]
        : [
            {
              cellTransforms: [nowrap],
              date: undefined,
              orderBy: groupById === 'account' && perspective === PerspectiveType.aws ? 'account_alias' : groupById,
              title: intl.formatMessage(messages.groupByValueNames, { groupBy: groupById }),
              ...(computedItems.length && { transforms: [sortable] }),
            },
          ];

    // Fill in missing columns
    for (
      let currentDate = new Date(start_date + 'T00:00:00');
      currentDate <= new Date(end_date + 'T00:00:00');
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const mapId = format(currentDate, 'yyyy-MM-dd');

      let isSortable = computedItems.length > 0;
      computedItems.map(rowItem => {
        const item = rowItem.get(mapId);
        if (!item) {
          isSortable = false;
          rowItem.set(mapId, {
            date: mapId,
          });
        }
      });

      // Add column headings
      const mapIdDate = new Date(mapId + 'T00:00:00');
      const date = getDate(mapIdDate);
      const month = getMonth(mapIdDate);
      columns.push({
        cellTransforms: [nowrap],
        title: intl.formatMessage(messages.explorerChartDate, { date, month }),
        ...(isSortable && {
          date: mapId,
          orderBy: 'cost',
          transforms: [sortable],
        }),
      });
    }

    const reportItem = computedReportItemType;
    const reportItemValue = computedReportItemValueType;

    // Sort by date and fill in missing cells
    computedItems.map(rowItem => {
      const cells = [];
      let desc; // First column description (i.e., show ID if different than label)
      let name; // For first column resource name
      let selectItem; // Save for row selection

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
        if (!name) {
          name = item && item.label && item.label !== null ? item.label : null;
        }
        if (!desc) {
          desc = item.id && item.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;
        }
        if (item.id && !selectItem) {
          selectItem = item;
        }

        // Add row cells
        cells.push({
          title:
            item[reportItem] && item[reportItem][reportItemValue]
              ? formatCurrency(item[reportItem][reportItemValue].value, item[reportItem][reportItemValue].units)
              : intl.formatMessage(messages.chartNoData),
        });
      });

      // Add first row cell (i.e., name)
      cells.unshift({
        title: (
          <div>
            {name}
            {desc}
          </div>
        ),
      });

      rows.push({
        cells,
        disableSelection: selectItem.label === `no-${groupById}` || selectItem.label === `no-${groupByTagKey}`,
        item: selectItem,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === selectItem.id) !== undefined),
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
    const { query, intl } = this.props;

    for (const val of Object.values(query.filter_by)) {
      if (val !== '*') {
        return <EmptyFilterState filter={val as string} showMargin={false} />;
      }
    }
    return (
      <EmptyState>
        <EmptyStateIcon icon={CalculatorIcon} />
        <EmptyStateBody>{intl.formatMessage(messages.detailsEmptyState)}</EmptyStateBody>
      </EmptyState>
    );
  };

  public getSortBy = () => {
    const { query } = this.props;
    const { columns } = this.state;

    let index = -1;
    let direction: any = SortByDirection.asc;

    if (query && query.order_by) {
      for (const key of Object.keys(query.order_by)) {
        let c = 0;
        for (const column of columns) {
          if (column.orderBy === key && !column.date) {
            direction = query.order_by[key] === 'asc' ? SortByDirection.asc : SortByDirection.desc;
            index = c + 1;
            break;
          } else if (column.date === query.order_by[key]) {
            direction = query.order_by.cost === 'asc' ? SortByDirection.asc : SortByDirection.desc;
            index = c + 1;
            break;
          }
          c++;
        }
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
      const column = columns[index - 1];
      const isSortAscending = direction === SortByDirection.asc;
      onSort(column.orderBy, column.date, isSortAscending);
    }
  };

  public render() {
    const { intl, isLoading } = this.props;
    const { columns, loadingRows, rows } = this.state;

    return (
      <div style={styles.tableContainer}>
        <Table
          aria-label={intl.formatMessage(messages.explorerTableAriaLabel)}
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
const mapStateToProps = createMapStateToProps<ExplorerTableOwnProps, ExplorerTableStateProps>(
  (state, { perspective }) => {
    const queryFromRoute = parseQuery<Query>(location.search);
    const dateRange = getDateRangeDefault(queryFromRoute);
    const { end_date, start_date } = getDateRange(dateRange);

    return {
      dateRange,
      end_date,
      perspective,
      start_date,
    };
  }
);

const mapDispatchToProps: ExplorerTableDispatchProps = {};

const ExplorerTableConnect = connect(mapStateToProps, mapDispatchToProps)(ExplorerTableBase);
const ExplorerTable = injectIntl(ExplorerTableConnect);

export { ExplorerTable, ExplorerTableProps };
