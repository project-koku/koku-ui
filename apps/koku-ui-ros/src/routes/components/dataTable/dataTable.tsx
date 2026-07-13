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
  gridBreakPoint?: '' | 'grid-2xl' | 'grid' | 'grid-md' | 'grid-lg' | 'grid-xl';
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

  private getSortBy = (index: number, isNested: boolean) => {
    const { columns, nestedColumns, orderBy } = this.props;

    const key = isNested ? nestedColumns?.[index]?.orderBy : columns?.[index]?.orderBy;
    const direction = orderBy && key ? orderBy[key] : undefined;

    return direction
      ? {
          index,
          direction,
        }
      : {};
  };

  private getSortParams = (index: number, isNested: boolean): ThProps['sort'] => {
    return {
      sortBy: this.getSortBy(index, isNested),
      onSort: (_evt, i, direction) => this.handleOnSort(i, direction, isNested),
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

  private handleOnSort = (index: number, direction: string, isNested: boolean) => {
    const { columns, nestedColumns, onSort } = this.props;

    const orderBy = isNested ? nestedColumns?.[index]?.orderBy : columns?.[index]?.orderBy;

    if (onSort && orderBy) {
      const isSortAscending = direction === SortByDirection.asc;
      onSort(orderBy, isSortAscending);
    }
  };

  public render() {
    const {
      columns,
      gridBreakPoint = 'grid-2xl',
      intl,
      isActionsCell = false,
      isLoading,
      isSelectable,
      nestedColumns,
      rows,
    } = this.props;
    const hasNestedHeader = nestedColumns?.length > 0;

    return (
      <>
        <Table
          aria-label={intl.formatMessage(messages.dataTableAriaLabel)}
          className="tableOverride"
          gridBreakPoint={gridBreakPoint}
          variant={TableVariant.compact}
        >
          <Thead hasNestedHeader={hasNestedHeader}>
            {hasNestedHeader && (
              <Tr>
                {nestedColumns.map((col, index) => (
                  <Th
                    colSpan={col.colSpan}
                    hasRightBorder={col.hasRightBorder}
                    isSubheader={col.isSubheader}
                    key={`nested-col-${index}`}
                    modifier={col.modifier || 'nowrap'}
                    rowSpan={col.rowSpan}
                    sort={col.isSortable ? this.getSortParams(index, true) : undefined}
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
                  isSubheader={col.isSubheader}
                  key={`col-${index}-${col.value}`}
                  modifier={col.modifier || 'nowrap'}
                  rowSpan={col.rowSpan}
                  sort={col.isSortable ? this.getSortParams(index, false) : undefined}
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
