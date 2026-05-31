import { EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateVariant } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { CreatePriceListAction } from 'routes/settings/priceLists/priceListCreate/components/actions';

interface NoPriceListStateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
}

// defaultIntl required for testing
const NoPriceListState: React.FC<NoPriceListStateOwnProps> = ({ canWrite, isDisabled }) => {
  const intl = useIntl();

  return (
    <>
      <EmptyState
        headingLevel="h5"
        titleText={intl.formatMessage(messages.priceListEmptyPriceLists)}
        variant={EmptyStateVariant.lg}
      >
        <EmptyStateBody>{intl.formatMessage(messages.priceListEmptyPriceListsDesc)}</EmptyStateBody>
        <EmptyStateFooter>
          <CreatePriceListAction canWrite={canWrite} isDisabled={isDisabled} />
        </EmptyStateFooter>
      </EmptyState>
    </>
  );
};

export { NoPriceListState };
