import { EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

interface NoExchangeRateStateOwnProps {
  // TBD...
}

// defaultIntl required for testing
const NoExchangeRateState: React.FC<NoExchangeRateStateOwnProps> = () => {
  const intl = useIntl();

  return (
    <>
      <EmptyState
        headingLevel="h5"
        titleText={intl.formatMessage(messages.exchangeRateEmpty)}
        variant={EmptyStateVariant.lg}
      >
        <EmptyStateBody>{intl.formatMessage(messages.exchangeRateEmptyDesc)}</EmptyStateBody>
      </EmptyState>
    </>
  );
};

export { NoExchangeRateState };
