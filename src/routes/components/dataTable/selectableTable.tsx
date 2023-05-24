import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Spinner } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import type { ThProps } from '@patternfly/react-table';
import { SortByDirection, TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import messages from 'locales/messages';
import type { ReactNode } from 'react';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './dataTable.styles';
interface SelectableTableOwnProps {
  columns?: any[];
  emptyState?: ReactNode;
  filterBy: any;
  isLoading?: boolean;
  onSort(value: string, isSortAscending: boolean);
  onRowClick(event: React.KeyboardEvent | React.MouseEvent, rowIndex: number);
  orderBy: any;
  rows?: any[];
}

type SelectableTableProps = SelectableTableOwnProps & RouterComponentProps & WrappedComponentProps;

class SelectableTable extends React.Component<SelectableTableProps, any> {
  constructor(props: SelectableTableProps) {
    super(props);
    this.handleOnSort = this.handleOnSort.bind(this);
  }

  private getEmptyState = () => {
    const { emptyState, filterBy, intl } = this.props;

    if (filterBy) {
      for (const val of Object.values(filterBy)) {
        if (val !== '*') {
          return <EmptyFilterState filter={val as string} showMargin={false} />;
        }
      }
    }
    // Return custom empty state
    if (emptyState) {
      return emptyState;
    }
    return (
      <EmptyState>
        <EmptyStateIcon icon={CalculatorIcon} />
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
      onSort: this.handleOnSort,
      columnIndex: index,
    };
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
    const { columns, intl, isLoading, rows } = this.props;

    return (
      <>
        <TableComposable
          aria-label={intl.formatMessage(messages.selectableTableAriaLabel)}
          gridBreakPoint="grid-2xl"
          hasSelectableRowCaption
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
              rows.map((row, rowIndex) => (
                <Tr
                  aria-label={intl.formatMessage(messages.selectableTableRowAriaLabel)}
                  isSelectable
                  isHoverable
                  isRowSelected={row.selected}
                  onRowClick={_event => this.handleOnRowClick(_event, rowIndex)}
                  key={`row-${rowIndex}`}
                >
                  {row.cells.map((item, cellIndex) =>
                    cellIndex === 0 ? (
                      <Th
                        aria-label={intl.formatMessage(messages.selectableTableHeaderAriaLabel)}
                        dataLabel={columns[cellIndex].name}
                        key={`cell-${rowIndex}-${cellIndex}`}
                        modifier="nowrap"
                        style={item.style}
                      >
                        {item.value}
                      </Th>
                    ) : (
                      <Td
                        dataLabel={columns[cellIndex].name}
                        key={`cell-${rowIndex}-${cellIndex}`}
                        modifier="nowrap"
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
        {rows.length === 0 && <div style={styles.emptyState}>{this.getEmptyState()}</div>}
      </>
    );
  }
}

export default injectIntl(withRouter(SelectableTable));
