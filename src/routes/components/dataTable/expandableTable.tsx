import './dataTable.scss';

import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  Spinner,
} from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import type { ThProps } from '@patternfly/react-table';
import { SortByDirection, Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './dataTable.styles';

interface ExpandableTableOwnProps {
  columns?: any[];
  emptyState?: React.ReactNode;
  filterBy: any;
  isActionsCell?: boolean;
  isAllExpanded?: boolean;
  isLoading?: boolean;
  onSort(sortType: string, isSortAscending: boolean);
  orderBy: any;
  rows?: any[];
  selectedItems?: ComputedReportItem[];
}

interface ExpandableTableState {
  expandedRows?: Set<any>;
  rows?: any[];
}

type ExpandableTableProps = ExpandableTableOwnProps & RouterComponentProps & WrappedComponentProps;

class ExpandableTable extends React.Component<ExpandableTableProps, ExpandableTableState> {
  public state: ExpandableTableState = {
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
      <EmptyState>
        <EmptyStateHeader icon={<EmptyStateIcon icon={CalculatorIcon} />} />
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
    const { expandedRows } = this.state;

    if (expandedRows.has(item)) {
      expandedRows.delete(item);
    } else {
      expandedRows.add(item);
    }
    this.setState({ expandedRows });
  };

  public render() {
    const { columns, intl, isActionsCell, isAllExpanded, isLoading, rows } = this.props;
    const { expandedRows } = this.state;

    return (
      <>
        <Table
          aria-label={intl.formatMessage(messages.dataTableAriaLabel)}
          className="tableOverride"
          gridBreakPoint="grid-2xl"
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
              rows.map((row, rowIndex) => {
                const isExpanded = isAllExpanded || expandedRows.has(row?.item);
                return (
                  <React.Fragment key={`fragment-${rowIndex}`}>
                    <Tr key={`row-${rowIndex}`} style={isExpanded ? styles.expandableRowBorder : undefined}>
                      {row.cells.map((item, cellIndex) =>
                        cellIndex === 0 ? (
                          <Td
                            expand={{
                              rowIndex,
                              isExpanded: isAllExpanded || expandedRows.has(row?.item),
                              onToggle: () => this.handleOnToggle(row?.item),
                            }}
                            key={`cell-${cellIndex}-${rowIndex}`}
                          />
                        ) : (
                          <Td
                            dataLabel={columns[cellIndex].name}
                            key={`cell-${rowIndex}-${cellIndex}`}
                            modifier="nowrap"
                            isActionCell={isActionsCell && cellIndex === row.cells.length - 1}
                            style={item.style}
                          >
                            {item.value}
                          </Td>
                        )
                      )}
                    </Tr>
                    {row?.children?.map((child, childIndex) => (
                      <Tr
                        isExpanded={isExpanded}
                        key={`row-children-${childIndex}-${rowIndex}`}
                        style={childIndex !== row.children.length - 1 ? styles.expandableRowBorder : undefined}
                      >
                        {child.cells.map((item, cellIndex) =>
                          cellIndex === 0 ? (
                            <Td key={`child-cell-${cellIndex}-${rowIndex}`} />
                          ) : (
                            <Td
                              dataLabel={columns[cellIndex].name}
                              key={`child-cell-${rowIndex}-${cellIndex}`}
                              modifier="nowrap"
                              isActionCell={isActionsCell && cellIndex === child.cells.length - 1}
                              style={item.style}
                            >
                              {item.value}
                            </Td>
                          )
                        )}
                      </Tr>
                    ))}
                  </React.Fragment>
                );
              })
            )}
          </Tbody>
        </Table>
        {rows.length === 0 && <div style={styles.emptyState}>{this.getEmptyState()}</div>}
      </>
    );
  }
}

export default injectIntl(withRouter(ExpandableTable));
