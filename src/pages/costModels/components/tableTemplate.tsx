import { Table, TableBody, TableGridBreakpoint, TableHeader, TableProps } from '@patternfly/react-table';
import { TFunction } from 'i18next';
import React from 'react';
import { Translation } from 'react-i18next';

export type TableTemplateProps = Pick<TableProps, 'aria-label' | 'actions' | 'cells' | 'rows' | 'onSort' | 'sortBy'>;

export const translateTableProps = (t: TFunction, props: TableTemplateProps) => {
  const cells = props.cells.map(cell => {
    if (typeof cell === 'string') {
      return t(cell);
    }
    if (typeof cell.title === 'string') {
      return { ...cell, title: t(cell.title) };
    }
    return cell;
  });
  const actions = props.actions.map(action => {
    let act = { ...action };
    if (typeof action.title === 'string') {
      act = { ...act, title: t(action.title) };
    }
    if (action.tooltip && typeof action.tooltip === 'string') {
      act = { ...act, tooltip: t(action.tooltip) };
    }
    return act;
  });
  return {
    ...props,
    cells,
    actions,
  };
};

export const TableTemplate: React.FunctionComponent<TableTemplateProps> = props => {
  return (
    <Translation>
      {t => {
        const translatedProps = translateTableProps(t, props);
        const { actions, cells, rows, onSort, sortBy, 'aria-label': ariaLabel } = translatedProps;
        return (
          <Table
            aria-label={ariaLabel}
            gridBreakPoint={TableGridBreakpoint.grid2xl}
            cells={cells}
            rows={rows}
            sortBy={sortBy}
            onSort={onSort}
            actions={actions}
          >
            <TableHeader />
            <TableBody />
          </Table>
        );
      }}
    </Translation>
  );
};
