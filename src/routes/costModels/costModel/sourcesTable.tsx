import { IAction, ICell, IRow, Table, TableBody, TableGridBreakpoint, TableHeader } from '@patternfly/react-table';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsSelectors } from 'store/costModels';
import { rbacSelectors } from 'store/rbac';

interface SourcesTableOwnProps {
  showDeleteDialog: (rowId: number) => void;
}

interface SourcesTableStateProps {
  canWrite: boolean;
  costModels: any[];
}

type SourcesTableProps = SourcesTableOwnProps & SourcesTableStateProps & WrappedComponentProps;

const SourcesTable: React.FunctionComponent<SourcesTableProps> = ({ canWrite, costModels, intl, showDeleteDialog }) => {
  const getActions = (): IAction[] => {
    if (canWrite) {
      return [
        {
          title: intl.formatMessage(messages.costModelsSourceDelete),
          onClick: (_evt, rowIndex: number) => showDeleteDialog(rowIndex),
        },
      ];
    }
    return [
      {
        style: { pointerEvents: 'auto' },
        tooltip: intl.formatMessage(messages.costModelsReadOnly),
        isDisabled: true,
        title: intl.formatMessage(messages.costModelsSourceDelete),
      },
    ];
  };

  const actions = getActions();
  const cells = [intl.formatMessage(messages.names, { count: 1 })] as (string | ICell)[];
  const rows: (IRow | string[])[] = costModels.length > 0 ? costModels[0].sources.map(source => [source.name]) : [];

  return (
    <Table
      actions={actions}
      aria-label={intl.formatMessage(messages.costModelsSourceTableAriaLabel)}
      cells={cells}
      gridBreakPoint={TableGridBreakpoint.grid2xl}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default injectIntl(
  connect(
    createMapStateToProps<SourcesTableOwnProps, SourcesTableStateProps>(state => {
      return {
        canWrite: rbacSelectors.isCostModelWritePermission(state),
        costModels: costModelsSelectors.costModels(state),
      };
    })
  )(SourcesTable)
);
