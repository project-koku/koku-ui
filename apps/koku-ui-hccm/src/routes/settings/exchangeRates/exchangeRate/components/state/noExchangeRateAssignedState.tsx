import { EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateVariant } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { CreateExchangeRateAction } from 'routes/settings/exchangeRates/exchangeRateCreate/components/actions';

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
          <CreateExchangeRateAction canWrite={canWrite} isDisabled={isDisabled} />
        </EmptyStateFooter>
      </EmptyState>
    </>
  );
};

export { NoExchangeRateAssignedState };
