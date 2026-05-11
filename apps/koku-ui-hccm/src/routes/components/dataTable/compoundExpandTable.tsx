import { Bullseye, EmptyState, EmptyStateBody, Spinner } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import type { ThProps } from '@patternfly/react-table';
import {
  ExpandableRowContent,
  SortByDirection,
  Table,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './dataTable.styles';

interface CompoundExpandTableOwnProps {
  columns?: any[];
  emptyState?: React.ReactNode;
  filterBy: any;
  gridBreakPoint?: '' | 'grid' | 'grid-md' | 'grid-lg' | 'grid-xl' | 'grid-2xl';
  isAllExpanded?: boolean;
  isLoading?: boolean;
  onSort(sortType: string, isSortAscending: boolean);
  orderBy: any;
  rows?: any[];
  selectedItems?: ComputedReportItem[];
}

interface CompoundExpandTableState {
  expandedRows?: Set<any>;
  rows?: any[];
}

type CompoundExpandTableProps = CompoundExpandTableOwnProps & RouterComponentProps & WrappedComponentProps;

class CompoundExpandTable extends React.Component<CompoundExpandTableProps, CompoundExpandTableState> {
  public state: CompoundExpandTableState = {
    expandedRows: new Set(),
  };

  private getEmptyState = () => {
    const { emptyState, filterBy, intl } = this.props;

    if (filterBy) {
      for (const val of Object.values(filterBy)) {
        if (val !== '*') {
          return <EmptyFilterState filter={val as string} showMargin={false} />;
        }
      }
    }
    return emptyState ? (
      emptyState
    ) : (
      <EmptyState icon={CalculatorIcon} titleText="">
        <EmptyStateBody>{intl.formatMessage(messages.detailsEmptyState)}</EmptyStateBody>
      </EmptyState>
    );
  };

  private getSortBy = index => {
    const { columns, orderBy } = this.props;

    const direction = orderBy && orderBy[columns[index].orderBy];

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

  private handleOnSort = (index, direction) => {
    const { columns, onSort } = this.props;

    if (onSort) {
      const orderBy = columns[index].orderBy;
      const isSortAscending = direction === SortByDirection.asc;
      onSort(orderBy, isSortAscending);
    }
  };

  private handleOnToggle = (item: any) => {
    this.setState(prevState => {
      const expandedRows = new Set(prevState.expandedRows);
      if (expandedRows.has(item)) {
        expandedRows.delete(item);
      } else {
        expandedRows.add(item);
      }
      return { expandedRows };
    });
  };

  public render() {
    const { columns, gridBreakPoint = 'grid-2xl', intl, isAllExpanded, isLoading, rows } = this.props;
    const { expandedRows } = this.state;

    return (
      <>
        <Table
          aria-label={intl.formatMessage(messages.dataTableAriaLabel)}
          gridBreakPoint={gridBreakPoint}
          hasAnimations
          isExpandable
          variant={TableVariant.compact}
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
          {isLoading ? (
            <Tbody>
              <Tr>
                <Td colSpan={100}>
                  <Bullseye>
                    <div style={{ textAlign: 'center' }}>
                      <Spinner size="xl" />
                    </div>
                  </Bullseye>
                </Td>
              </Tr>
            </Tbody>
          ) : (
            rows.map((row, rowIndex) => {
              const rowId = `row-${rowIndex}`;
              const isExpanded = isAllExpanded || expandedRows.has(row?.item);
              const hasExpandableRow = row?.children?.rows?.length > 0;
              return (
                <Tbody isExpanded={isExpanded} key={rowId}>
                  <Tr isContentExpanded={isExpanded} isControlRow key={`${rowId}-${rowIndex}`}>
                    {row.cells?.map((cell, cellIndex) => (
                      <Td
                        compoundExpand={
                          hasExpandableRow && cell.isCompoundExpand
                            ? {
                                rowIndex,
                                isExpanded,
                                onToggle: () => this.handleOnToggle(row?.item),
                              }
                            : undefined
                        }
                        dataLabel={columns[cellIndex].name}
                        key={`cell-${rowIndex}-${cellIndex}`}
                        modifier="nowrap"
                        isActionCell={cell?.isActionsCell}
                        style={cell.style}
                      >
                        {cell.value}
                      </Td>
                    ))}
                  </Tr>
                  {hasExpandableRow && (
                    <Tr isExpanded={isExpanded} key={`child-row-${rowId}-${rowIndex}`}>
                      <Td colSpan={row?.cells?.length}>
                        <ExpandableRowContent>
                          <Table
                            borders={false}
                            variant={TableVariant.compact}
                            key={`child-table-${rowId}-${rowIndex}`}
                          >
                            <Thead>
                              <Tr>
                                {row?.children?.columns?.map((childCol, childColIndex) => (
                                  <Th
                                    key={`child-col-${rowId}-${rowIndex}-${childColIndex}`}
                                    sort={childCol.isSortable ? this.getSortParams(childColIndex) : undefined}
                                    style={childCol.style}
                                  >
                                    {childCol.name}
                                  </Th>
                                ))}
                              </Tr>
                            </Thead>
                            <Tbody>
                              {row?.children?.rows?.map((childRow, childRowIndex) => (
                                <Tr isExpanded={isExpanded} key={`child-row-${rowId}-${rowIndex}-${childRowIndex}`}>
                                  {childRow?.cells?.map((childCell, childCellIndex) => (
                                    <Td
                                      dataLabel={row?.children?.columns[childCellIndex]?.name}
                                      key={`child-cell-${rowId}-${rowIndex}-${childRowIndex}-${childCellIndex}`}
                                      isActionCell={childCell?.isActionsCell}
                                      style={{
                                        ...childCell.style,
                                      }}
                                    >
                                      {childCell.value}
                                    </Td>
                                  ))}
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </ExpandableRowContent>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              );
            })
          )}
        </Table>
        {rows.length === 0 && <div style={styles.emptyState}>{this.getEmptyState()}</div>}
      </>
    );
  }
}

export default injectIntl(withRouter(CompoundExpandTable));
