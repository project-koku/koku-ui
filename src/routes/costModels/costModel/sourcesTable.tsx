import type { IAction, IRow } from '@patternfly/react-table';
import { ActionsColumn, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { TableGridBreakpoint } from '@patternfly/react-table';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
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

const SourcesTable: React.FC<SourcesTableProps> = ({ canWrite, costModels, intl, showDeleteDialog }) => {
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
  const rows: (IRow | string[])[] = costModels.length > 0 ? costModels[0].sources.map(source => [source.name]) : [];

  return (
    <TableComposable
      aria-label={intl.formatMessage(messages.costModelsSourceTableAriaLabel)}
      gridBreakPoint={TableGridBreakpoint.grid2xl}
    >
      <Thead>
        <Tr>
          <Th>{intl.formatMessage(messages.names, { count: 1 })}</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((r, rowIndex) => (
          <Tr key={rowIndex}>
            <Td>{r}</Td>
            <Td isActionCell>
              <ActionsColumn
                items={actions.map(a => {
                  return {
                    ...a,
                    onClick: () => a.onClick(null, rowIndex, r, null),
                  };
                })}
              ></ActionsColumn>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
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
