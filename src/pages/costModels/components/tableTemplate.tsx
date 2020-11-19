import { Table, TableBody, TableGridBreakpoint, TableHeader, TableProps } from '@patternfly/react-table';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

export type TableTemplateProps = TableProps;

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
  const actions = props.actions
    ? props.actions.map(action => {
        let act = { ...action };
        if (typeof action.title === 'string') {
          act = { ...act, title: t(action.title) };
        }
        if (action.tooltip && typeof action.tooltip === 'string') {
          act = { ...act, tooltip: t(action.tooltip) };
        }
        return act;
      })
    : null;
  return {
    ...props,
    cells,
    actions,
  };
};

export const TableTemplate: React.FunctionComponent<TableTemplateProps> = props => {
  const { t } = useTranslation();
  return (
    <Table gridBreakPoint={TableGridBreakpoint.grid2xl} {...translateTableProps(t, props)}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};
