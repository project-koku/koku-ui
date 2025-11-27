import './dataTable.scss';

import messages from '@koku-ui/i18n/locales/messages';
import { Bullseye, EmptyState, EmptyStateBody, Spinner } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import type { ThProps } from '@patternfly/react-table';
import { SortByDirection, Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import type { ComputedReportItem } from '../../utils/computedReport/getComputedReportItems';
import { EmptyFilterState } from '../state/emptyFilterState';
import { styles } from './dataTable.styles';

interface DataTableOwnProps {
  ariaLabel?: string;
  columns?: any[];
  emptyState?: React.ReactNode;
  exclude?: any;
  filterBy?: any;
  isActionsCell?: boolean;
  isLoading?: boolean;
  isSelectable?: boolean;
  onSelect(items: any[], isSelected: boolean);
  onSort(sortType: string, isSortAscending: boolean);
  orderBy: any;
  rows?: any[];
  selectedItems?: ComputedReportItem[];
  variant?: 'checkbox' | 'radio';
}

type DataTableProps = DataTableOwnProps & RouterComponentProps & WrappedComponentProps;

class DataTable extends React.Component<DataTableProps, any> {
  private getEmptyState = () => {
    const { emptyState, exclude, filterBy, intl } = this.props;

    if (filterBy) {
      for (const val of Object.values(filterBy)) {
        if (val !== '*') {
          return <EmptyFilterState filter={val as string} showMargin={false} />;
        }
      }
    }
    if (exclude) {
      for (const val of Object.values(exclude)) {
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
    const { columns, onSort } = this.props;

    if (onSort) {
      const orderBy = columns[index].orderBy;
      const isSortAscending = direction === SortByDirection.asc;
      onSort(orderBy, isSortAscending);
    }
  };

  public render() {
    const { ariaLabel, columns, intl, isActionsCell, isLoading, isSelectable, rows, variant } = this.props;

    return (
      <>
        <Table
          aria-label={ariaLabel ? ariaLabel : intl.formatMessage(messages.dataTableAriaLabel)}
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
              rows.map((row, rowIndex) => (
                <Tr key={`row-${rowIndex}`}>
                  {row.cells.map((item, cellIndex) =>
                    cellIndex === 0 && isSelectable ? (
                      <Td
                        className={item.className}
                        dataLabel={columns[cellIndex].name}
                        key={`cell-${cellIndex}-${rowIndex}`}
                        modifier="nowrap"
                        select={{
                          isDisabled: row.selectionDisabled, // Disable select for "no-project"
                          isSelected: row.selected,
                          onSelect: (_evt, isSelected) => this.handleOnSelect(isSelected, rowIndex),
                          rowIndex,
                          variant,
                        }}
                        style={item.style}
                      />
                    ) : (
                      <Td
                        className={item.className}
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
