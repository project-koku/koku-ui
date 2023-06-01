import { EmptyState, EmptyStateBody, EmptyStateHeader, EmptyStateVariant, Spinner } from '@patternfly/react-core';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface LoadingStateProps extends WrappedComponentProps {
  body?: string;
  heading?: string;
  icon?: string;
}

// defaultIntl required for testing
const LoadingStateBase: React.FC<LoadingStateProps> = ({
  intl = defaultIntl,

  body = intl.formatMessage(messages.loadingStateDesc),
  heading = intl.formatMessage(messages.loadingStateTitle),
}) => {
  return (
    <EmptyState variant={EmptyStateVariant.lg} className="pf-m-redhat-font">
      <Spinner size="lg" />
      <EmptyStateHeader titleText={<>{heading}</>} headingLevel="h5" />
      <EmptyStateBody>{body}</EmptyStateBody>
    </EmptyState>
  );
};

const LoadingState = injectIntl(LoadingStateBase);

export default LoadingState;
