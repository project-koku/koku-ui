import { EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateVariant } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { AddRate } from 'routes/settings/exchangeRates/exchangeRate/components/add';

interface NoPriceListAssignedStateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
}

// defaultIntl required for testing
const NoExchangeRateAssignedState: React.FC<NoPriceListAssignedStateOwnProps> = ({ canWrite, isDisabled }) => {
  const intl = useIntl();

  return (
    <>
      <EmptyState
        headingLevel="h5"
        titleText={intl.formatMessage(messages.exchangeRateNotAssigned)}
        variant={EmptyStateVariant.lg}
      >
        <EmptyStateBody>{intl.formatMessage(messages.priceListEmptyPriceListsAssignedDesc)}</EmptyStateBody>
        <EmptyStateFooter>
          <AddRate canWrite={canWrite} isDisabled={isDisabled} />
        </EmptyStateFooter>
      </EmptyState>
    </>
  );
};

export { NoExchangeRateAssignedState };
