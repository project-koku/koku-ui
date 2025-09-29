import { Button, ButtonVariant, Label, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import type { IRow } from '@patternfly/react-table';
import { Table, TableGridBreakpoint, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { type Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ReadOnlyTooltip } from 'routes/settings/costModels/components/readOnlyTooltip';
import { createMapStateToProps } from 'store/common';
import { costModelsSelectors } from 'store/costModels';
import { providersQuery, providersSelectors } from 'store/providers';
import { rbacSelectors } from 'store/rbac';

interface SourcesTableOwnProps {
  showDeleteDialog: (rowId: number) => void;
}

interface SourcesTableStateProps {
  canWrite: boolean;
  costModels: any[];
  providers: Providers;
}

type SourcesTableProps = SourcesTableOwnProps & SourcesTableStateProps & WrappedComponentProps;

const SourcesTable: React.FC<SourcesTableProps> = ({ canWrite, costModels, intl, providers, showDeleteDialog }) => {
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
          <Th>{intl.formatMessage(messages.operatorVersion)}</Th>
          <Th>{intl.formatMessage(messages.lastProcessed)}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row: any, rowIndex) => {
          const providerData = providers?.data?.find(p => p.uuid === row.uuid);

          let operatorLabel;
          if (providerData.additional_context?.operator_update_available === true) {
            operatorLabel = (
              <Tooltip content={intl.formatMessage(messages.newOperatorAvailable)}>
                <Label status="warning" variant="outline">
                  {intl.formatMessage(messages.newVersionAvailable)}
                </Label>
              </Tooltip>
            );
          } else if (providerData.additional_context?.operator_update_available === false) {
            operatorLabel = (
              <Label status="success" variant="outline">
                {intl.formatMessage(messages.upToDate)}
              </Label>
            );
          } else {
            operatorLabel = (
              <Label status="info" variant="outline">
                {intl.formatMessage(messages.notAvailable)}
              </Label>
            );
          }

          return (
            <Tr key={rowIndex}>
              <Td>{row.name}</Td>
              <Td>{operatorLabel}</Td>
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
          );
        })}
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
