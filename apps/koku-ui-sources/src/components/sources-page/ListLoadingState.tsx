import { EmptyState, EmptyStateBody, EmptyStateVariant, Spinner } from '@patternfly/react-core';
import { messages } from 'i18n/messages';
import React from 'react';
import { useIntl } from 'react-intl';

/** Matches HCCM `routes/components/state/loadingState/loadingState.tsx` for Settings tab parity. */
export const ListLoadingState: React.FC = () => {
  const intl = useIntl();
  return (
    <EmptyState
      headingLevel="h5"
      titleText={intl.formatMessage(messages.loadingStateTitle)}
      variant={EmptyStateVariant.lg}
      className="pf-m-redhat-font"
    >
      <Spinner size="lg" />
      <EmptyStateBody>{intl.formatMessage(messages.loadingStateDesc)}</EmptyStateBody>
    </EmptyState>
  );
};

ListLoadingState.displayName = 'ListLoadingState';
