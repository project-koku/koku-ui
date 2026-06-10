import { EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { ChartAreaIcon } from '@patternfly/react-icons/dist/esm/icons/chart-area-icon';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

interface NoSelectionsStateOwnProps {
  // TBD...
}

// defaultIntl required for testing
const NoSelectionsState: React.FC<NoSelectionsStateOwnProps> = () => {
  const intl = useIntl();

  return (
    <>
      <EmptyState
        headingLevel="h5"
        icon={ChartAreaIcon}
        titleText={intl.formatMessage(messages.priceListEmptySelections)}
        variant={EmptyStateVariant.lg}
      >
        <EmptyStateBody>{intl.formatMessage(messages.priceListEmptySelectionsDesc)}</EmptyStateBody>
      </EmptyState>
    </>
  );
};

export { NoSelectionsState };
