import { type Providers, ProviderType } from '@koku-ui/api/providers';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import type { IRow } from '@patternfly/react-table';
import { Table, TableGridBreakpoint, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../../store/common';
import { costModelsSelectors } from '../../../../store/costModels';
import { providersQuery, providersSelectors } from '../../../../store/providers';
import { rbacSelectors } from '../../../../store/rbac';
import { getOperatorStatus } from '../../../utils/operatorStatus';
import { ReadOnlyTooltip } from '../components/readOnlyTooltip';

interface SourcesTableOwnProps {
  showDeleteDialog: (rowId: number) => void;
  showOperatorVersion?: boolean;
}

interface SourcesTableStateProps {
  canWrite: boolean;
  costModels: any[];
  providers: Providers;
}

type SourcesTableProps = SourcesTableOwnProps & SourcesTableStateProps & WrappedComponentProps;

const SourcesTable: React.FC<SourcesTableProps> = ({
  canWrite,
  costModels,
  intl,
  providers,
  showDeleteDialog,
  showOperatorVersion,
}) => {
  const rows: (IRow | string[])[] = costModels.length > 0 ? costModels[0].sources : [];

  return (
    <Table
      aria-label={intl.formatMessage(messages.costModelsSourceTableAriaLabel)}
      gridBreakPoint={TableGridBreakpoint.grid2xl}
      variant={TableVariant.compact}
    >
      <Thead>
        <Tr>
          <Th>{intl.formatMessage(messages.names, { count: 1 })}</Th>
          {showOperatorVersion && <Th>{intl.formatMessage(messages.operatorVersion)}</Th>}
          <Th>{intl.formatMessage(messages.lastProcessed)}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row: any, rowIndex) => (
          <Tr key={rowIndex}>
            <Td>{row.name}</Td>
            {showOperatorVersion && (
              <Td>
                {getOperatorStatus(
                  providers?.data?.find(p => p.uuid === row.uuid)?.additional_context?.operator_update_available
                )}
              </Td>
            )}
            <Td>
              {intl.formatDate(row.last_processed, {
                day: 'numeric',
                hour: 'numeric',
                hour12: false,
                minute: 'numeric',
                month: 'short',
                timeZone: 'UTC',
                timeZoneName: 'short',
                year: 'numeric',
              })}
            </Td>
            <Td isActionCell>
              <ReadOnlyTooltip defaultMsg={messages.costModelsSourceDeleteSource} key="action" isDisabled={!canWrite}>
                <Button
                  icon={<MinusCircleIcon />}
                  aria-label={intl.formatMessage(messages.costModelsSourceDelete)}
                  isAriaDisabled={!canWrite}
                  onClick={() => showDeleteDialog(rowIndex)}
                  size="sm"
                  variant={ButtonVariant.plain}
                ></Button>
              </ReadOnlyTooltip>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default injectIntl(
  connect(
    createMapStateToProps<SourcesTableOwnProps, SourcesTableStateProps>(state => {
      const providersQueryString = getProvidersQuery(providersQuery);
      const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
      return {
        canWrite: rbacSelectors.isCostModelWritePermission(state),
        costModels: costModelsSelectors.costModels(state),
        providers,
      };
    })
  )(SourcesTable)
);
