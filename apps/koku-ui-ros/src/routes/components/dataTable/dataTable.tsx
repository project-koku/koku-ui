import './dataTable.scss';

import { Bullseye, EmptyState, EmptyStateBody, Spinner } from '@patternfly/react-core';
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

interface DataTableOwnProps {
  columns?: any[];
  emptyState?: React.ReactNode;
  filterBy: any;
  isActionsCell?: boolean;
  isLoading?: boolean;
  isSelectable?: boolean;
  nestedColumns?: any[];
  onSelect(items: any[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
  orderBy: any;
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

  private handleOnSelect = (isSelected, rowId) => {
    const { onSelect, rows } = this.props;

    let newRows;
    let items = [];
    if (rowId !== -1) {
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
    const { columns, onSort } = this.props;

    if (onSort) {
      const orderBy = columns[index].orderBy;
      const isSortAscending = direction === SortByDirection.asc;
      onSort(orderBy, isSortAscending);
    }
  };

  public render() {
    const { columns, intl, isActionsCell = false, isLoading, isSelectable, nestedColumns, rows } = this.props;
    const hasNestedHeader = nestedColumns?.length > 0;

    return (
      <>
        <Table
          aria-label={intl.formatMessage(messages.dataTableAriaLabel)}
          className="tableOverride"
          gridBreakPoint="grid-2xl"
          variant={TableVariant.compact}
        >
          <Thead hasNestedHeader={hasNestedHeader}>
            {hasNestedHeader && (
              <Tr>
                {nestedColumns.map((col, index) => (
                  <Th
                    colSpan={col.colSpan}
                    hasRightBorder={col.hasRightBorder}
                    key={`nested-col-${index}`}
                    modifier={col.modifier || 'nowrap'}
                    rowSpan={col.rowSpan}
                    sort={col.isSortable ? this.getSortParams(index) : undefined}
                    style={col.style}
                  >
                    {col.name}
                  </Th>
                ))}
              </Tr>
            )}
            <Tr>
              {columns.map((col, index) => (
                <Th
                  colSpan={col.colSpan}
                  hasRightBorder={col.hasRightBorder}
                  key={`col-${index}-${col.value}`}
                  modifier={col.modifier || 'nowrap'}
                  rowSpan={col.rowSpan}
                  sort={col.isSortable ? this.getSortParams(index) : undefined}
                  style={col.style}
                >
                  {col.name || ''}
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
                    cellIndex === 0 && isSelectable ? (
                      <Td
                        dataLabel={columns[cellIndex]?.name}
                        key={`cell-${cellIndex}-${rowIndex}`}
                        modifier="nowrap"
                        select={{
                          isDisabled: row.selectionDisabled, // Disable select for "no-project"
                          isSelected: row.selected,
                          onSelect: (_evt, isSelected) => this.handleOnSelect(isSelected, rowIndex),
                          rowIndex,
                        }}
                        style={item.style}
                      />
                    ) : (
                      <Td
                        dataLabel={columns[cellIndex]?.name}
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
              ))
            )}
          </Tbody>
        </Table>
        {rows.length === 0 && <div style={styles.emptyState}>{this.getEmptyState()}</div>}
      </>
    );
  }
}

export default injectIntl(withRouter(DataTable));
