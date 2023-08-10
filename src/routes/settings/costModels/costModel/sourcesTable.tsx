import { Button, ButtonVariant } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import type { IRow } from '@patternfly/react-table';
import { TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { TableGridBreakpoint } from '@patternfly/react-table';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ReadOnlyTooltip } from 'routes/settings/costModels/components/readOnlyTooltip';
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
  const rows: (IRow | string[])[] = costModels.length > 0 ? costModels[0].sources.map(source => [source.name]) : [];

  return (
    <TableComposable
      aria-label={intl.formatMessage(messages.costModelsSourceTableAriaLabel)}
      gridBreakPoint={TableGridBreakpoint.grid2xl}
      variant={TableVariant.compact}
    >
      <Thead>
        <Tr>
          <Th>{intl.formatMessage(messages.names, { count: 1 })}</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((r: any, rowIndex) => (
          <Tr key={rowIndex}>
            <Td>{r}</Td>
            <Td isActionCell>
              <ReadOnlyTooltip key="action" isDisabled={!canWrite}>
                <Button
                  aria-label={intl.formatMessage(messages.costModelsSourceDelete)}
                  isAriaDisabled={!canWrite}
                  isSmall
                  onClick={() => showDeleteDialog(rowIndex)}
                  variant={ButtonVariant.plain}
                >
                  <MinusCircleIcon />
                </Button>
              </ReadOnlyTooltip>
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
