import './dataTable.scss';

import { Bullseye, EmptyState, EmptyStateBody, Spinner } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import pfStyles from '@patternfly/react-styles/css/components/Table/table';
import type { TbodyProps, ThProps, TrProps } from '@patternfly/react-table';
import { SortByDirection, Table, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import messages from 'locales/messages';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState';

import { styles } from './dataTable.styles';

interface DraggableTableOwnProps {
  ariaLabel?: string;
  columns?: any[];
  emptyState?: React.ReactNode;
  exclude?: any;
  filterBy?: any;
  gridBreakPoint?: '' | 'grid-2xl' | 'grid' | 'grid-md' | 'grid-lg' | 'grid-xl';
  isActionsCell?: boolean;
  isDraggable?: boolean;
  isLoading?: boolean;
  isNoPadding?: boolean;
  isNoWrapCell?: boolean;
  isNoWrapHeader?: boolean;
  isSelectable?: boolean;
  onDrop?(rowIDs: string[]): void;
  onSelect?(items: any[], isSelected: boolean);
  onSort?(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  rows?: any[];
  variant?: 'checkbox' | 'radio';
}

type DraggableTableProps = DraggableTableOwnProps;

const DraggableTable: React.FC<DraggableTableProps> = ({
  ariaLabel,
  columns,
  emptyState,
  exclude,
  filterBy,
  gridBreakPoint = 'grid-2xl',
  isActionsCell,
  isDraggable,
  isLoading,
  isNoPadding,
  isNoWrapCell = true,
  isNoWrapHeader = true,
  isSelectable,
  onDrop,
  onSort,
  onSelect,
  orderBy,
  rows,
  variant,
}) => {
  const intl = useIntl();

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [draggingToItemIndex, setDraggingToItemIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [itemOrder, setItemOrder] = useState<string[]>([]);
  const [tempItemOrder, setTempItemOrder] = useState<string[]>([]);

  const bodyRef = useRef<HTMLTableSectionElement>(null);

  const prefixColumnCount = (isDraggable ? 1 : 0) + (isSelectable ? 1 : 0);

  // Getters

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

  // Drag and drop

  const isValidDrop = (evt: React.DragEvent<HTMLTableSectionElement | HTMLTableRowElement>) => {
    const ulRect = bodyRef.current?.getBoundingClientRect();
    if (!ulRect) {
      return false;
    }
    return (
      evt.clientX > ulRect.x &&
      evt.clientX < ulRect.x + ulRect.width &&
      evt.clientY > ulRect.y &&
      evt.clientY < ulRect.y + ulRect.height
    );
  };

  const move = (items: string[]) => {
    const ulNode = bodyRef.current;
    const nodes = Array.from(ulNode.children);
    if (nodes.map(node => node.id).every((id, i) => id === items[i])) {
      return;
    }
    while (ulNode.firstChild) {
      ulNode.removeChild(ulNode.lastChild);
    }

    items.forEach(id => {
      const node = nodes.find(n => n.id === id);
      if (node) {
        ulNode.appendChild(node);
      }
    });
  };

  const moveItem = (arr: string[], i1: string, toIndex: number) => {
    const fromIndex = arr.indexOf(i1);
    if (fromIndex === toIndex) {
      return arr;
    }
    const temp = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, temp[0]);

    return arr;
  };

  // Handlers

  const handleOnDragCancel = () => {
    Array.from(bodyRef.current.children).forEach(el => {
      el.classList.remove(pfStyles.modifiers.ghostRow);
      el.setAttribute('aria-pressed', 'false');
    });
    setDraggedItemId(null);
    setDraggingToItemIndex(null);
    setIsDragging(false);
  };

  const handleOnDragEnd: TrProps['onDragEnd'] = evt => {
    const target = evt.target as HTMLTableRowElement;
    target.classList.remove(pfStyles.modifiers.ghostRow);
    target.setAttribute('aria-pressed', 'false');
    setDraggedItemId(null);
    setDraggingToItemIndex(null);
    setIsDragging(false);
  };

  const handleOnDragLeave: TbodyProps['onDragLeave'] = evt => {
    if (!isValidDrop(evt)) {
      move(itemOrder);
      setDraggingToItemIndex(null);
    }
  };

  const handleOnDragOver: TbodyProps['onDragOver'] = evt => {
    evt.preventDefault();

    if (!draggedItemId) {
      return;
    }

    const curListItem = (evt.target as HTMLTableSectionElement).closest('tr');
    if (!curListItem || !bodyRef.current.contains(curListItem) || curListItem.id === draggedItemId) {
      return null;
    } else {
      const dragId = curListItem.id;
      const newDraggingToItemIndex = Array.from(bodyRef.current.children).findIndex(item => item.id === dragId);
      if (newDraggingToItemIndex !== draggingToItemIndex) {
        const newItemOrder = moveItem([...itemOrder], draggedItemId, newDraggingToItemIndex);
        move(newItemOrder);
        setDraggingToItemIndex(newDraggingToItemIndex);
        setTempItemOrder(newItemOrder);
      }
    }
  };

  const handleOnDragStart: TrProps['onDragStart'] = evt => {
    const id = evt.currentTarget.id;

    evt.dataTransfer.effectAllowed = 'move';
    evt.dataTransfer.setData('text/plain', id);
    evt.currentTarget.classList.add(pfStyles.modifiers.ghostRow);
    evt.currentTarget.setAttribute('aria-pressed', 'true');

    setDraggedItemId(id);
    setIsDragging(true);
  };

  const handleOnDrop: TrProps['onDrop'] = evt => {
    if (isValidDrop(evt)) {
      setItemOrder(tempItemOrder);
      onDrop?.(tempItemOrder);
    } else {
      handleOnDragCancel();
    }
  };

  const handleOnSelect = (isSelected, rowId) => {
    let newRows;
    let items = [];
    if (rowId !== -1) {
      newRows = [...rows];
      newRows[rowId].selected = isSelected;
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

  // Effects

  useEffect(() => {
    setItemOrder(rows?.map((row, i) => String(row.id ?? 'row-' + i)) || []);
  }, [rows]);

  return (
    <>
      <Table
        aria-label={ariaLabel ? ariaLabel : intl.formatMessage(messages.dataTableAriaLabel)}
        className={isDragging ? `tableOverride ${pfStyles.modifiers.dragOver}` : 'tableOverride'}
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
        <Tbody ref={bodyRef} onDragOver={handleOnDragOver} onDrop={handleOnDragOver} onDragLeave={handleOnDragLeave}>
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
                key={row.id ?? `row-${rowIndex}`}
                id={row.id ?? `row-${rowIndex}`}
                draggable={isDraggable}
                onDrop={handleOnDrop}
                onDragEnd={handleOnDragEnd}
                onDragStart={handleOnDragStart}
              >
                {row.cells.map((item, cellIndex) =>
                  cellIndex === 0 && isDraggable ? (
                    <Td
                      className={item.className}
                      dataLabel={columns[0]?.name}
                      draggableRow={{ id: `drag-${rowIndex}-${cellIndex}` }}
                      key={`drag-${rowIndex}-${cellIndex}`}
                      modifier={isNoWrapCell ? 'nowrap' : undefined}
                      noPadding={isNoPadding}
                    />
                  ) : (cellIndex === 0 || (cellIndex === 1 && isDraggable)) && isSelectable ? (
                    <Td
                      className={item.className}
                      dataLabel={columns[isDraggable ? 1 : 0]?.name}
                      key={`select-${rowIndex}-${cellIndex}`}
                      modifier={isNoWrapCell ? 'nowrap' : undefined}
                      noPadding={isNoPadding}
                      select={{
                        isDisabled: row.selectionDisabled, // Disable select for "no-project"
                        isSelected: row.selected,
                        onSelect: (_evt, isSelected) => handleOnSelect(isSelected, rowIndex),
                        rowIndex,
                        variant,
                      }}
                      style={item.style ?? styles.selectColumn}
                    />
                  ) : (
                    <Td
                      className={item.className}
                      dataLabel={columns[cellIndex + prefixColumnCount]?.name}
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

export default DraggableTable;
