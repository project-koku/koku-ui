import './explorerTable.scss';

import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Label, Spinner, Tooltip } from '@patternfly/react-core';
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
import { classificationDefault, noPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './explorerTable.styles';
import { PerspectiveType } from './explorerUtils';

interface ExplorerTableOwnProps extends RouterComponentProps, WrappedComponentProps {
  costDistribution?: string;
  groupBy: string;
  groupByCostCategory?: string;
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

class ExplorerTableBase extends React.Component<ExplorerTableProps, ExplorerTableState> {
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
    const { costDistribution, report, selectedItems } = this.props;
    const currentReport = report && report.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps.report && prevProps.report.data ? JSON.stringify(prevProps.report.data) : '';

    if (
      previousReport !== currentReport ||
      prevProps.selectedItems !== selectedItems ||
      prevProps.costDistribution !== costDistribution
    ) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const {
      costDistribution,
      end_date,
      groupBy,
      groupByCostCategory,
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

    const isGroupByProject = groupBy === 'project';
    const showPlatformCosts = isGroupByProject;
    const showCostDistribution =
      costDistribution === ComputedReportItemValueType.distributed &&
      perspective === PerspectiveType.ocp &&
      isGroupByProject &&
      report &&
      report.meta &&
      report.meta.distributed_overhead === true;

    const computedItems = getUnsortedComputedReportItems<any, any>({
      report,
      isDateMap: true,
      idKey: groupByCostCategory
        ? groupByCostCategory
        : groupByTagKey
        ? groupByTagKey
        : groupByOrg
        ? 'org_entities'
        : groupBy,
    });

    // Add first two column headings (i.e., select and name)
    const columns =
      groupByCostCategory || groupByTagKey || groupByOrg
        ? [
            {
              name: '',
            },
            {
              name: groupByCostCategory
                ? intl.formatMessage(messages.costCategoryNames)
                : groupByOrg
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
            {
              hidden: !isGroupByProject,
              name: '',
            },
          ];

    // Fill in missing columns
    for (
      let currentDate = new Date(start_date + 'T00:00:00');
      currentDate <= new Date(end_date + 'T00:00:00');
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const mapId = format(currentDate, 'yyyy-MM-dd');

      let isSortable = false;
      computedItems.map(rowItem => {
        const item = rowItem.get(mapId);
        if (!item) {
          rowItem.set(mapId, {
            date: mapId,
          });
        } else {
          isSortable = true; // At least one row must be available
        }
      });

      // Add column headings
      const mapIdDate = new Date(mapId + 'T00:00:00');
      columns.push({
        name: intl.formatDate(mapIdDate, {
          day: 'numeric',
          month: 'short',
        }),
        date: mapId,
        isSortable,
        orderBy:
          perspective === PerspectiveType.ocp &&
          isGroupByProject &&
          costDistribution === ComputedReportItemValueType.distributed
            ? 'distributed_cost'
            : 'cost',
      });
    }

    const reportItem = ComputedReportItemType.cost;
    const reportItemValue = isGroupByProject ? costDistribution : ComputedReportItemValueType.total;
    const rows = [];

    // Sort by date and fill in missing cells
    computedItems.map(rowItem => {
      const cells = [];
      let desc; // First column description (i.e., show ID if different than label)
      let name; // For first column resource name
      let selectItem; // Save for row selection
      let isOverheadCosts = false; // True if item has overhead costs
      let isPlatformCosts = false; // True if item is of default classification

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
        if (
          showCostDistribution &&
          item.cost &&
          ((item.cost.platformDistributed && item.cost.platformDistributed.value > 0) ||
            (item.cost.workerUnallocatedDistributed && item.cost.workerUnallocatedDistributed.value > 0))
        ) {
          isOverheadCosts = true;
        }
        if (showPlatformCosts && item.classification === classificationDefault) {
          isPlatformCosts = true;
        }

        // Add row cells
        cells.push({
          value:
            item[reportItem] && item[reportItem][reportItemValue]
              ? formatCurrency(item[reportItem][reportItemValue].value, item[reportItem][reportItemValue].units)
              : intl.formatMessage(messages.chartNoData),
        });
      });

      const showLabels = isOverheadCosts || isPlatformCosts;

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
        },
        {
          hidden: !isGroupByProject,
          value: isPlatformCosts ? (
            <div>
              <Label variant="outline" color="green">
                {intl.formatMessage(messages.default)}
              </Label>
            </div>
          ) : isOverheadCosts ? (
            <Tooltip content={intl.formatMessage(messages.overheadDesc)} enableFlip>
              <Label variant="outline" color="orange">
                {intl.formatMessage(messages.overhead)}
              </Label>
            </Tooltip>
          ) : (
            <div style={styles.defaultLabel} />
          ),
        }
      );

      rows.push({
        cells,
        selectionDisabled:
          selectItem.label === `${noPrefix}${groupBy}` ||
          selectItem.label === `${noPrefix}${groupByCostCategory}` ||
          selectItem.label === `${noPrefix}${groupByTagKey}`,
        item: selectItem,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === selectItem.id) !== undefined),
        showLabels,
      });
    });

    const filteredColumns = (columns as any[]).filter(column => !column.hidden);
    const filteredRows = rows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !cell.hidden);
      return row;
    });

    this.setState({
      columns: filteredColumns,
      rows: filteredRows,
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
    const { groupBy, intl, isLoading } = this.props;
    const { columns, rows } = this.state;

    // Omit a potentially empty column
    let showLabels = false;
    for (const row of rows) {
      if (row.showLabels) {
        showLabels = true;
        break;
      }
    }

    return (
      <InnerScrollContainer>
        <TableComposable
          aria-label={intl.formatMessage(messages.explorerTableAriaLabel)}
          className="explorerTableOverride"
          gridBreakPoint=""
        >
          <Thead>
            <Tr>
              {columns.map((col, index) =>
                index === 0 ? (
                  <Th isStickyColumn key={`col-${index}-${col.value}`} stickyMinWidth="53px" />
                ) : index === 1 ? (
                  <Th
                    hasRightBorder={!showLabels}
                    isStickyColumn
                    key={`col-${index}-${col.value}`}
                    modifier="nowrap"
                    sort={col.isSortable ? this.getSortParams(index) : undefined}
                    stickyMinWidth={showLabels ? '215px' : '100px'}
                    stickyLeftOffset="53px"
                  >
                    {col.name}
                  </Th>
                ) : index === 2 && groupBy === 'project' ? (
                  showLabels ? (
                    <Th
                      hasRightBorder
                      isStickyColumn
                      key={`col-${index}-${col.value}`}
                      modifier="nowrap"
                      stickyMinWidth="110px"
                      stickyLeftOffset="268px"
                    >
                      {col.name}
                    </Th>
                  ) : null
                ) : (
                  <Th
                    key={`col-${index}-${col.value}`}
                    modifier="nowrap"
                    sort={col.isSortable ? this.getSortParams(index) : undefined}
                  >
                    {col.name}
                  </Th>
                )
              )}
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
                        isStickyColumn
                        key={`cell-${cellIndex}-${rowIndex}`}
                        select={{
                          disable: row.selectionDisabled, // Disable select for "no-project"
                          isSelected: row.selected,
                          onSelect: (_event, isSelected) => this.handleOnSelect(_event, isSelected, rowIndex),
                          rowIndex,
                        }}
                        stickyMinWidth="53px"
                      />
                    ) : cellIndex === 1 ? (
                      <Td
                        dataLabel={columns[cellIndex].name}
                        hasRightBorder={!showLabels}
                        isStickyColumn
                        key={`cell-${rowIndex}-${cellIndex}`}
                        modifier="nowrap"
                        stickyMinWidth={showLabels ? '215px' : '100px'}
                        stickyLeftOffset="53px"
                      >
                        {item.value}
                      </Td>
                    ) : cellIndex === 2 && groupBy === 'project' ? (
                      showLabels ? (
                        <Td
                          dataLabel={columns[cellIndex].name}
                          hasRightBorder
                          isStickyColumn
                          key={`cell-${rowIndex}-${cellIndex}`}
                          modifier="nowrap"
                          stickyMinWidth="110px"
                          stickyLeftOffset="268px"
                        >
                          {item.value}
                        </Td>
                      ) : null
                    ) : (
                      <Td dataLabel={columns[cellIndex].name} key={`cell-${rowIndex}-${cellIndex}`} modifier="nowrap">
                        {item.value}
                      </Td>
                    )
                  )}
                </Tr>
              ))
            )}
          </Tbody>
        </TableComposable>
        {rows.length === 0 && <div style={styles.emptyState}>{this.getEmptyState()}</div>}
      </InnerScrollContainer>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerTableOwnProps, ExplorerTableStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const { end_date, start_date } = getDateRangeFromQuery(queryFromRoute);

  return {
    end_date,
    start_date,
  };
});

const mapDispatchToProps: ExplorerTableDispatchProps = {};

const ExplorerTableConnect = connect(mapStateToProps, mapDispatchToProps)(ExplorerTableBase);
const ExplorerTable = injectIntl(withRouter(ExplorerTableConnect));

export { ExplorerTable };
export type { ExplorerTableProps };
