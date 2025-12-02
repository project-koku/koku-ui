import './explorerTable.scss';

import type { Query } from '@koku-ui/api/queries/query';
import type { Report } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import { Bullseye, EmptyState, EmptyStateBody, Label, Spinner, Tooltip } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import type { ThProps } from '@patternfly/react-table';
import {
  InnerScrollContainer,
  SortByDirection,
  Table,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { format } from 'date-fns';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../store/common';
import { formatCurrency } from '../../utils/format';
import { classificationDefault, classificationUnallocated, noPrefix } from '../../utils/props';
import type { RouterComponentProps } from '../../utils/router';
import { withRouter } from '../../utils/router';
import { ComputedReportItemType, ComputedReportItemValueType } from '../components/charts/common/chartDatum';
import { EmptyFilterState } from '../components/state/emptyFilterState';
import type { ComputedReportItem } from '../utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from '../utils/computedReport/getComputedReportItems';
import { styles } from './explorerTable.styles';
import { PerspectiveType } from './explorerUtils';

interface ExplorerTableOwnProps extends RouterComponentProps, WrappedComponentProps {
  costDistribution?: string;
  endDate?: string;
  groupBy: string;
  groupByCostCategory?: string;
  groupByOrg?: string;
  groupByTagKey?: string;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelect(items: ComputedReportItem[], isSelected: boolean);
  onSort(sortType: string, isSortAscending: boolean, date: string);
  perspective: PerspectiveType;
  query: Query;
  report: Report;
  selectedItems?: ComputedReportItem[];
  startDate?: string;
}

interface ExplorerTableStateProps {
  // TBD...
}

interface ExplorerTableDispatchProps {
  // TBD...
}

interface ExplorerTableState {
  columns?: any[];
  loadingRows?: any[];
  rows?: any[];
  showLabels?: boolean;
}

type ExplorerTableProps = ExplorerTableOwnProps & ExplorerTableStateProps;

class ExplorerTableBase extends React.Component<ExplorerTableProps, ExplorerTableState> {
  private selectColRef = React.createRef<HTMLTableCellElement>();
  private nameColRef = React.createRef<HTMLTableCellElement>();
  private labelColRef = React.createRef<HTMLTableCellElement>();

  public state: ExplorerTableState = {
    columns: [],
    rows: [],
    showLabels: false,
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
    const currentReport = report?.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps?.report?.data ? JSON.stringify(prevProps.report.data) : '';

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
      endDate,
      groupBy,
      groupByCostCategory,
      groupByOrg,
      groupByTagKey,
      isAllSelected,
      perspective,
      report,
      selectedItems,
      startDate,
      intl,
    } = this.props;
    if (!report) {
      return;
    }

    const isGroupByProject = groupBy === 'project';
    const showPlatformCosts = perspective === PerspectiveType.ocp && isGroupByProject;
    const showCostDistribution = costDistribution === ComputedReportItemValueType.distributed; // Always show -- see https://issues.redhat.com/browse/COST-5870

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

    let orderBy = groupBy;
    if (perspective === PerspectiveType.aws || perspective === PerspectiveType.awsOcp) {
      orderBy = groupBy === 'account' ? 'account_alias' : groupBy;
    } else if (perspective === PerspectiveType.azure || perspective === PerspectiveType.azureOcp) {
      orderBy = groupBy === 'subscription_guid' ? 'subscription_name' : groupBy;
    }

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
              orderBy,
              ...(computedItems.length && { isSortable: true }),
            },
            {
              hidden: !isGroupByProject,
              isLabelColumn: true,
              name: '',
            },
          ];

    // Fill in missing columns
    for (
      let currentDate = new Date(startDate + 'T00:00:00');
      currentDate <= new Date(endDate + 'T00:00:00');
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
        orderBy: costDistribution === ComputedReportItemValueType.distributed ? 'distributed_cost' : 'cost',
      });
    }

    let showLabels = false;
    const reportItem = ComputedReportItemType.cost;
    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;
    const rows = [];

    // Sort by date and fill in missing cells
    computedItems.map(rowItem => {
      const cells = [];
      let desc; // First column description (i.e., show ID if different from label)
      let name; // For first column resource name
      let tooltipContent; // For overhead label
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
          name = item?.label !== null ? item.label : null;
        }
        if (!desc) {
          desc = item?.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;
        }
        if (!tooltipContent) {
          tooltipContent = (
            <ul style={{ listStyle: 'inside', textAlign: 'left' }}>
              {item.cost?.networkUnattributedDistributed?.value > 0 && (
                <li style={styles.infoTitle}>{intl.formatMessage(messages.networkUnattributedDistributed)}</li>
              )}
              {item.cost?.platformDistributed?.value > 0 && (
                <li style={styles.infoTitle}>{intl.formatMessage(messages.platformDistributed)}</li>
              )}
              {item.cost?.storageUnattributedDistributed?.value > 0 && (
                <li style={styles.infoTitle}>{intl.formatMessage(messages.storageUnattributedDistributed)}</li>
              )}
              {item.cost?.workerUnallocated?.value > 0 && (
                <li style={styles.infoTitle}>{intl.formatMessage(messages.workerUnallocated)}</li>
              )}
            </ul>
          );
        }
        if (item.id && !selectItem) {
          selectItem = item;
        }
        if (
          showCostDistribution &&
          item.classification !== classificationUnallocated &&
          (item.cost?.networkUnattributedDistributed?.value > 0 ||
            item.cost?.platformDistributed?.value > 0 ||
            item.cost?.storageUnattributedDistributed?.value > 0 ||
            item.cost?.workerUnallocatedDistributed?.value > 0)
        ) {
          isOverheadCosts = true;
          showLabels = true;
        }
        if (showPlatformCosts && item.classification === classificationDefault) {
          isPlatformCosts = true;
          showLabels = true;
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
            <>
              {name}
              {desc}
            </>
          ),
        },
        {
          hidden: !isGroupByProject,
          isLabelColumn: true,
          value: isPlatformCosts ? (
            <Label variant="outline" color="green">
              {intl.formatMessage(messages.default)}
            </Label>
          ) : isOverheadCosts ? (
            <Tooltip
              content={intl.formatMessage(messages.overheadDesc, {
                value: tooltipContent,
              })}
              enableFlip
            >
              <Label variant="outline" color="orange">
                {intl.formatMessage(messages.overhead)}
              </Label>
            </Tooltip>
          ) : (
            <span style={styles.defaultLabel} />
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
        selected: isAllSelected || selectedItems?.find(val => val.id === selectItem.id) !== undefined,
      });
    });

    // Hide column if there are no labels to show
    if (isGroupByProject && !showLabels) {
      columns.map(column => {
        if (column.isLabelColumn) {
          column.hidden = true;
        }
      });
      rows.map(row => {
        row.cells.map(cell => {
          if (cell.isLabelColumn) {
            cell.hidden = true;
          }
        });
      });
    }

    const filteredColumns = (columns as any[]).filter(column => !column.hidden);
    const filteredRows = rows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !cell.hidden);
      return row;
    });

    this.setState({
      columns: filteredColumns,
      rows: filteredRows,
      showLabels,
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
      <EmptyState icon={CalculatorIcon} titleText="">
        <EmptyStateBody>{intl.formatMessage(messages.detailsEmptyState)}</EmptyStateBody>
      </EmptyState>
    );
  };

  private getSortBy = index => {
    const { query } = this.props;
    const { columns } = this.state;

    let direction;
    const column = columns[index];

    if (column.orderBy && !column.date) {
      direction = query?.order_by[column.orderBy];
    } else if (query?.order_by?.date === column.date) {
      direction = query?.order_by[column.orderBy];
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
      onSort: (_evt, i, direction) => this.handleOnSort(i, direction),
      columnIndex: index,
    };
  };

  private handleOnSelect = (isSelected, rowId) => {
    const { onSelect } = this.props;
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
      if (onSelect) {
        onSelect(items, isSelected);
      }
    });
  };

  private handleOnSort = (index, direction) => {
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
    const { columns, rows, showLabels } = this.state;

    const selectColWidth = this.selectColRef?.current?.clientWidth > 0 ? this.selectColRef.current.clientWidth : 53;
    const nameColWidth = this.nameColRef?.current?.clientWidth > 0 ? this.nameColRef.current.clientWidth : 200;
    const labelColWidth = this.labelColRef?.current?.clientWidth > 0 ? this.labelColRef.current.clientWidth : 100;

    return (
      <InnerScrollContainer>
        <Table
          aria-label={intl.formatMessage(messages.explorerTableAriaLabel)}
          className="explorerTableOverride"
          gridBreakPoint=""
          variant={TableVariant.compact}
        >
          <Thead>
            <Tr>
              {columns.map((col, index) =>
                index === 0 ? (
                  <Th isStickyColumn key={`col-${index}-${col.value}`} stickyMinWidth={`${selectColWidth}px`} />
                ) : index === 1 ? (
                  <Th
                    hasRightBorder={!showLabels}
                    isStickyColumn
                    key={`col-${index}-${col.value}`}
                    modifier="nowrap"
                    sort={col.isSortable ? this.getSortParams(index) : undefined}
                    stickyMinWidth={showLabels ? `${nameColWidth}px` : `100px`}
                    stickyLeftOffset={`${selectColWidth}px`}
                  >
                    {col.name}
                  </Th>
                ) : index === 2 && showLabels ? (
                  <Th
                    hasRightBorder
                    isStickyColumn
                    key={`col-${index}-${col.value}`}
                    modifier="nowrap"
                    stickyMinWidth={`${labelColWidth}px`}
                    stickyLeftOffset={`${selectColWidth + nameColWidth}px`}
                  >
                    {col.name}
                  </Th>
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
                        ref={this.selectColRef}
                        select={{
                          isDisabled: row.selectionDisabled, // Disable select for "no-project"
                          isSelected: row.selected,
                          onSelect: (_evt, isSelected) => this.handleOnSelect(isSelected, rowIndex),
                          rowIndex,
                        }}
                        stickyMinWidth={`${selectColWidth}px`}
                      />
                    ) : cellIndex === 1 ? (
                      <Td
                        className="stickyColumn"
                        dataLabel={columns[cellIndex].name}
                        hasRightBorder={!showLabels}
                        isStickyColumn
                        key={`cell-${rowIndex}-${cellIndex}`}
                        modifier="nowrap"
                        ref={this.nameColRef}
                        stickyMinWidth={showLabels ? `${nameColWidth}px` : `100px`}
                        stickyLeftOffset={`${selectColWidth}px`}
                      >
                        {item.value}
                      </Td>
                    ) : cellIndex === 2 && showLabels ? (
                      <Td
                        className="stickyColumn"
                        dataLabel={columns[cellIndex].name}
                        hasRightBorder
                        isStickyColumn
                        key={`cell-${rowIndex}-${cellIndex}`}
                        modifier="nowrap"
                        ref={this.labelColRef}
                        stickyMinWidth={`${labelColWidth}px`}
                        stickyLeftOffset={`${selectColWidth + nameColWidth}px`}
                      >
                        {item.value}
                      </Td>
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
        </Table>
        {rows.length === 0 && <div style={styles.emptyState}>{this.getEmptyState()}</div>}
      </InnerScrollContainer>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExplorerTableOwnProps, ExplorerTableStateProps>(() => {
  return {
    // TBD
  };
});

const mapDispatchToProps: ExplorerTableDispatchProps = {};

const ExplorerTableConnect = connect(mapStateToProps, mapDispatchToProps)(ExplorerTableBase);
const ExplorerTable = injectIntl(withRouter(ExplorerTableConnect));

export { ExplorerTable };
export type { ExplorerTableProps };
