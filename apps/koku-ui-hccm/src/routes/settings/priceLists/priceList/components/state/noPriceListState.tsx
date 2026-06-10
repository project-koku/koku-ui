import { EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

interface NoPriceListStateOwnProps {
  // TBD...
}

// defaultIntl required for testing
const NoPriceListState: React.FC<NoPriceListStateOwnProps> = () => {
  const intl = useIntl();

  return (
    <>
      <EmptyState
        headingLevel="h5"
        titleText={intl.formatMessage(messages.priceListEmptyPriceLists)}
        variant={EmptyStateVariant.lg}
      >
        <EmptyStateBody>{intl.formatMessage(messages.priceListEmptyPriceListsDesc)}</EmptyStateBody>
      </EmptyState>
    </>
  );
};

export { NoPriceListState };
