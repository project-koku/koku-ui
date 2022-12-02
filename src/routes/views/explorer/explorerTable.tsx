import './explorerTable.scss';

import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Spinner } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import type { ThProps } from '@patternfly/react-table';
import {
  InnerScrollContainer,
  SortByDirection,
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import { format } from 'date-fns';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState';
import { ComputedReportItemType, ComputedReportItemValueType } from 'routes/views/components/charts/common/chartDatum';
import { getDateRangeFromQuery } from 'routes/views/utils/dateRange';
import { createMapStateToProps } from 'store/common';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { formatCurrency } from 'utils/format';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './explorerTable.styles';
import { PerspectiveType } from './explorerUtils';

interface ExplorerTableOwnProps extends RouterComponentProps, WrappedComponentProps {
  computedReportItemType?: ComputedReportItemType;
  computedReportItemValueType?: ComputedReportItemValueType;
  groupBy: string;
  groupByOrg?: string;
  groupByTagKey?: string;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelected(items: ComputedReportItem[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean, date: string);
  perspective: PerspectiveType;
  query: Query;
  report: Report;
  selectedItems?: ComputedReportItem[];
}

interface ExplorerTableStateProps {
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

type ExplorerTableProps = ExplorerTableOwnProps & ExplorerTableStateProps;

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
    const { report, selectedItems } = this.props;
    const currentReport = report && report.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps.report && prevProps.report.data ? JSON.stringify(prevProps.report.data) : '';

    if (previousReport !== currentReport || prevProps.selectedItems !== selectedItems) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const {
      computedReportItemType = ComputedReportItemType.cost,
      computedReportItemValueType = ComputedReportItemValueType.total,
      end_date,
      groupBy,
      groupByOrg,
      groupByTagKey,
      isAllSelected,
      perspective,
      report,
      selectedItems,
      start_date,
      intl,
    } = this.props;
    if (!report) {
      return;
    }

    const rows = [];

    const computedItems = getUnsortedComputedReportItems({
      report,
      isDateMap: true,
      idKey: groupByTagKey ? groupByTagKey : groupByOrg ? 'org_entities' : groupBy,
    });

    // Add first two column headings (i.e., select and name)
    const columns =
      groupByTagKey || groupByOrg
        ? [
            {
              name: '',
            },
            {
              name: groupByOrg
                ? intl.formatMessage(messages.names, { count: 2 })
                : intl.formatMessage(messages.tagNames),
            },
          ]
        : [
            {
              name: '',
            },
            {
              date: undefined,
              name: intl.formatMessage(messages.groupByValueNames, { groupBy }),
              orderBy: groupBy === 'account' && perspective === PerspectiveType.aws ? 'account_alias' : groupBy,
              ...(computedItems.length && { isSortable: true }),
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
      columns.push({
        name: intl.formatDate(mapIdDate, {
          day: 'numeric',
          month: 'short',
        }),
        ...(isSortable && {
          date: mapId,
          orderBy: 'cost',
          isSortable: true,
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
          value:
            item[reportItem] && item[reportItem][reportItemValue]
              ? formatCurrency(item[reportItem][reportItemValue].value, item[reportItem][reportItemValue].units)
              : intl.formatMessage(messages.chartNoData),
        });
      });

      // Add first row cells
      cells.unshift(
        {}, // Empty cell for row selection
        {
          value: (
            <div>
              {name}
              {desc}
            </div>
          ),
        }
      );

      rows.push({
        cells,
        selectionDisabled: selectItem.label === `no-${groupBy}` || selectItem.label === `no-${groupByTagKey}`,
        item: selectItem,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === selectItem.id) !== undefined),
      });
    });

    this.setState({
      columns,
      rows,
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

  private getSortBy = index => {
    const { query } = this.props;
    const { columns } = this.state;

    let direction;

    const column = columns[index];
    const hasOrderBy = query && query.order_by && query.order_by;

    if (column.orderBy && !column.date) {
      direction = hasOrderBy && query.order_by[column.orderBy];
    } else if (hasOrderBy && query.order_by.date === column.date) {
      direction = hasOrderBy && query.order_by[column.orderBy];
    }
    return direction
      ? {
          index,
          direction,
        }
      : {};
  };

  private getSortParams = (index: number): ThProps['sort'] => {
    return {
      sortBy: this.getSortBy(index),
      onSort: this.handleOnSort,
      columnIndex: index,
    };
  };

  private handleOnSelect = (event, isSelected, rowId) => {
    const { onSelected } = this.props;
    const { rows } = this.state;

    let newRows;
    let items = [];
    if (rowId === -1) {
      newRows = rows.map(row => {
        row.selected = isSelected;
        return row;
      });
    } else {
      newRows = [...rows];
      newRows[rowId].selected = isSelected;
      items = [newRows[rowId].item];
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
      const orderBy = columns[index].orderBy;
      const isSortAscending = direction === SortByDirection.asc;
      onSort(orderBy, isSortAscending, columns[index].date);
    }
  };

  public render() {
    const { intl, isLoading } = this.props;
    const { columns, rows } = this.state;

    return (
      <InnerScrollContainer>
        <TableComposable
          aria-label={intl.formatMessage(messages.explorerTableAriaLabel)}
          className="explorerTableOverride"
          gridBreakPoint=""
        >
          <Thead>
            <Tr>
              {columns.map((col, index) => (
                <Th
                  key={`col-${index}-${col.value}`}
                  modifier="nowrap"
                  sort={col.isSortable ? this.getSortParams(index) : undefined}
                  style={col.style}
                >
                  {col.name}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={100}>
                  <Bullseye>
                    <div style={{ textAlign: 'center' }}>
                      <Spinner size="xl" />
                    </div>
                  </Bullseye>
                </Td>
              </Tr>
            ) : (
              rows.map((row, rowIndex) => (
                <Tr key={`row-${rowIndex}`}>
                  {row.cells.map((item, cellIndex) =>
                    cellIndex === 0 ? (
                      <Td
                        dataLabel={columns[cellIndex].name}
                        key={`cell-${cellIndex}-${rowIndex}`}
                        modifier="nowrap"
                        select={{
                          disable: row.selectionDisabled, // Disable select for "no-project"
                          isSelected: row.selected,
                          onSelect: (_event, isSelected) => this.handleOnSelect(_event, isSelected, rowIndex),
                          rowIndex,
                        }}
                      />
                    ) : (
                      <Td
                        dataLabel={columns[cellIndex].name}
                        key={`cell-${rowIndex}-${cellIndex}`}
                        modifier="nowrap"
                        isActionCell={cellIndex === row.cells.length - 1}
                      >
                        {item.value}
                      </Td>
                    )
                  )}
                </Tr>
              ))
            )}
          </Tbody>
        </TableComposable>
        {Boolean(rows.length === 0) && <div style={styles.emptyState}>{this.getEmptyState()}</div>}
      </InnerScrollContainer>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerTableOwnProps, ExplorerTableStateProps>(
  (state, { perspective, router }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const { end_date, start_date } = getDateRangeFromQuery(queryFromRoute);

    return {
      end_date,
      perspective,
      start_date,
    };
  }
);

const mapDispatchToProps: ExplorerTableDispatchProps = {};

const ExplorerTableConnect = connect(mapStateToProps, mapDispatchToProps)(ExplorerTableBase);
const ExplorerTable = injectIntl(withRouter(ExplorerTableConnect));

export { ExplorerTable };
export type { ExplorerTableProps };
