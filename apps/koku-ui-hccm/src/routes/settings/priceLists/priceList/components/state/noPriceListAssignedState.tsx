import { EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateVariant } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { CreatePriceListAction } from 'routes/settings/priceLists/priceListCreate/components/actions';

interface NoPriceListAssignedStateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isWizard?: boolean;
}

// defaultIntl required for testing
const NoPriceListAssignedState: React.FC<NoPriceListAssignedStateOwnProps> = ({ canWrite, isDisabled, isWizard }) => {
  const intl = useIntl();

  return (
    <>
      <EmptyState
        headingLevel="h5"
        titleText={intl.formatMessage(
          isWizard ? messages.priceListEmptyPriceListsAvailable : messages.priceListEmptyPriceListsAssigned
        )}
        variant={EmptyStateVariant.lg}
      >
        <EmptyStateBody>
          {intl.formatMessage(
            isWizard
              ? messages.priceListEmptyPriceListsAssignedWizardDesc
              : messages.priceListEmptyPriceListsAssignedDesc
          )}
        </EmptyStateBody>
        <EmptyStateFooter>
          <CreatePriceListAction canWrite={canWrite} isDisabled={isDisabled} />
        </EmptyStateFooter>
      </EmptyState>
    </>
  );
};

export { NoPriceListAssignedState };
