import { Bullseye, Checkbox, EmptyState, EmptyStateBody, Spinner, Tooltip } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import type { ThProps } from '@patternfly/react-table';
import { SortByDirection, Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState';

import { styles } from './dataTable.styles';

interface DataTableOwnProps {
  ariaLabel?: string;
  columns?: any[];
  emptyState?: React.ReactNode;
  exclude?: any;
  filterBy?: any;
  gridBreakPoint?: '' | 'grid-2xl' | 'grid' | 'grid-md' | 'grid-lg' | 'grid-xl';
  isActionsCell?: boolean;
  isLoading?: boolean;
  isNoPadding?: boolean;
  isNoWrapCell?: boolean;
  isNoWrapHeader?: boolean;
  isSelectable?: boolean;
  onSelect?(items: any[], isSelected: boolean);
  onSort?(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  rows?: any[];
  variant?: 'checkbox' | 'radio';
}

type DataTableProps = DataTableOwnProps;

const DataTable: React.FC<DataTableProps> = ({
  ariaLabel,
  columns,
  emptyState,
  exclude,
  filterBy,
  gridBreakPoint = 'grid-2xl',
  isActionsCell,
  isLoading,
  isNoPadding,
  isNoWrapCell = true,
  isNoWrapHeader = true,
  isSelectable,
  onSort,
  onSelect,
  orderBy,
  rows = [],
  variant,
}) => {
  const intl = useIntl();

  const getEmptyState = () => {
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

  const getSortBy = index => {
    const direction = orderBy && orderBy[columns[index].orderBy];

    return direction
      ? {
          index,
          direction,
        }
      : {};
  };

  const getSortParams = (index: number): ThProps['sort'] => {
    return {
      sortBy: getSortBy(index),
      onSort: (_evt, i, direction) => handleOnSort(i, direction),
      columnIndex: index,
    };
  };

  const handleOnSelect = (isSelected, rowId) => {
    let items = [];
    if (rowId !== -1) {
      const newRows = [...rows];
      newRows[rowId] = { ...newRows[rowId], selected: isSelected };
      items = [newRows[rowId].item];
    }
    onSelect?.(items, isSelected);
  };

  const handleOnSort = (index, direction) => {
    if (onSort) {
      const isSortAscending = direction === SortByDirection.asc;
      onSort(columns[index].orderBy, isSortAscending);
    }
  };

  return (
    <>
      <Table
        aria-label={ariaLabel ? ariaLabel : intl.formatMessage(messages.dataTableAriaLabel)}
        className="tableOverride"
        gridBreakPoint={gridBreakPoint}
        variant={TableVariant.compact}
      >
        <Thead>
          <Tr>
            {columns.map((col, index) => (
              <Th
                key={`col-${index}-${col.value}`}
                modifier={isNoWrapHeader ? 'nowrap' : undefined}
                sort={col.isSortable ? getSortParams(index) : undefined}
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
            rows?.map((row, rowIndex) => (
              <Tr key={`row-${rowIndex}`}>
                {row.cells.map((item, cellIndex) =>
                  cellIndex === 0 && isSelectable ? (
                    row.selectionTooltip ? (
                      <Td
                        className={item.className}
                        dataLabel={columns[cellIndex].name}
                        key={`cell-${cellIndex}-${rowIndex}`}
                        modifier={isNoWrapCell ? 'nowrap' : undefined}
                        noPadding={isNoPadding}
                        style={item.style}
                      >
                        <Tooltip content={row.selectionTooltip}>
                          <Checkbox
                            checked={row.selected}
                            id={`cell-${cellIndex}-${rowIndex}`}
                            isDisabled={row.selectionDisabled}
                            key={`cell-${cellIndex}-${rowIndex}`}
                            onChange={(_event, checked) => handleOnSelect(checked, rowIndex)}
                          />
                        </Tooltip>
                      </Td>
                    ) : (
                      <Td
                        className={item.className}
                        dataLabel={columns[cellIndex].name}
                        key={`cell-${cellIndex}-${rowIndex}`}
                        modifier={isNoWrapCell ? 'nowrap' : undefined}
                        noPadding={isNoPadding}
                        select={{
                          isDisabled: row.selectionDisabled, // Disable select for "no-project"
                          isSelected: row.selected,
                          onSelect: (_evt, isSelected) => handleOnSelect(isSelected, rowIndex),
                          rowIndex,
                          variant,
                        }}
                        style={item.style}
                      />
                    )
                  ) : (
                    <Td
                      className={item.className}
                      dataLabel={columns[cellIndex].name}
                      key={`cell-${rowIndex}-${cellIndex}`}
                      modifier={isNoWrapCell ? 'nowrap' : undefined}
                      noPadding={isNoPadding}
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
      {rows.length === 0 && <div style={styles.emptyState}>{getEmptyState()}</div>}
    </>
  );
};

export default DataTable;
