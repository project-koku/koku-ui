import './dataTable.scss';

import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Spinner } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import type { ThProps } from '@patternfly/react-table';
import { SortByDirection, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { parseQuery } from 'api/queries/ocpQuery';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { OptimizationIcon } from 'routes/components/icons/optimizationIcon';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './dataTable.styles';

interface DataTableOwnProps {
  columns?: any[];
  isLoading?: boolean;
  isOptimizations?: boolean;
  onSelected(items: ComputedReportItem[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
  onRowClick(event: React.KeyboardEvent | React.MouseEvent, rowIndex: number);
  rows?: any[];
  selectedItems?: ComputedReportItem[];
}

type DataTableProps = DataTableOwnProps & RouterComponentProps & WrappedComponentProps;

class DataTable extends React.Component<DataTableProps, any> {
  constructor(props: DataTableProps) {
    super(props);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSort = this.handleOnSort.bind(this);
  }

  private getEmptyState = () => {
    const { intl, isOptimizations, router } = this.props;

    const queryFromRoute = parseQuery<OcpQuery>(router.location.search);
    if (queryFromRoute.filter_by) {
      for (const val of Object.values(queryFromRoute.filter_by)) {
        if (val !== '*') {
          return <EmptyFilterState filter={val as string} showMargin={false} />;
        }
      }
    }
    return (
      <EmptyState>
        <EmptyStateIcon icon={isOptimizations ? (OptimizationIcon as any) : CalculatorIcon} />
        <EmptyStateBody>
          {intl.formatMessage(isOptimizations ? messages.optimizationsEmptyState : messages.detailsEmptyState)}
        </EmptyStateBody>
      </EmptyState>
    );
  };

  private getSortBy = index => {
    const { columns, router } = this.props;

    const orderBy = columns[index].orderBy;
    const queryFromRoute = parseQuery<OcpQuery>(router.location.search);
    const direction = queryFromRoute && queryFromRoute.order_by && queryFromRoute.order_by[orderBy];

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
    const { onSelected, rows } = this.props;

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
    const { columns, onSort } = this.props;

    if (onSort) {
      const orderBy = columns[index].orderBy;
      const isSortAscending = direction === SortByDirection.asc;
      onSort(orderBy, isSortAscending);
    }
  };

  private handleOnRowClick = (event, rowIndex) => {
    const { onRowClick, rows } = this.props;

    rows.map(row => (row.selected = false));
    rows[rowIndex].selected = true;

    this.setState({ rows }, () => {
      if (onRowClick) {
        onRowClick(event, rowIndex);
      }
    });
  };

  public render() {
    const { columns, intl, isLoading, isOptimizations, rows } = this.props;

    return (
      <>
        <TableComposable
          aria-label={intl.formatMessage(messages.dataTableAriaLabel)}
          className="tableOverride"
          gridBreakPoint="grid-2xl"
          hasSelectableRowCaption={isOptimizations}
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
                <Tr
                  isSelectable={isOptimizations}
                  isHoverable={isOptimizations}
                  isRowSelected={isOptimizations && row.selected}
                  onRowClick={isOptimizations ? _event => this.handleOnRowClick(_event, rowIndex) : undefined}
                  key={`row-${rowIndex}`}
                >
                  {row.cells.map((item, cellIndex) =>
                    cellIndex === 0 && !isOptimizations ? (
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
                        style={item.style}
                      />
                    ) : (
                      <Td
                        dataLabel={columns[cellIndex].name}
                        key={`cell-${rowIndex}-${cellIndex}`}
                        modifier="nowrap"
                        isActionCell={!isOptimizations && cellIndex === row.cells.length - 1}
                        style={item.style}
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
      </>
    );
  }
}

export default injectIntl(withRouter(DataTable));
