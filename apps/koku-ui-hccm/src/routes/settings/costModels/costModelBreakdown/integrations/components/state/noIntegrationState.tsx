import { EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateVariant } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { AddIntegrationAction } from 'routes/settings/costModels/costModelBreakdown/integrations/components/actions';

interface NoIntegrationStateOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDisabled?: boolean;
  onAdd?: (uuids: string[]) => void;
}

// defaultIntl required for testing
const NoIntegrationState: React.FC<NoIntegrationStateOwnProps> = ({ canWrite, costModel, isDisabled, onAdd }) => {
  const intl = useIntl();

  return (
    <>
      <EmptyState
        headingLevel="h5"
        icon={PlusCircleIcon}
        titleText={intl.formatMessage(messages.costModelsSourceEmptyStateDesc)}
        variant={EmptyStateVariant.lg}
      >
        <EmptyStateBody>{intl.formatMessage(messages.costModelsSourceEmptyStateTitle)}</EmptyStateBody>
        <EmptyStateFooter>
          <AddIntegrationAction isDisabled={isDisabled} canWrite={canWrite} costModel={costModel} onAdd={onAdd} />
        </EmptyStateFooter>
      </EmptyState>
    </>
  );
};

export { NoIntegrationState };
