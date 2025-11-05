import { EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
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

  body = intl.formatMessage(messages.optimizedStateDesc),
  heading = intl.formatMessage(messages.optimizedStateTitle),
}) => {
  return (
    <EmptyState
      headingLevel="h5"
      icon={CheckCircleIcon}
      titleText={heading}
      variant={EmptyStateVariant.lg}
      className="pf-m-redhat-font"
      isFullHeight
    >
      <EmptyStateBody>{body}</EmptyStateBody>
    </EmptyState>
  );
};

const OptimizedState = injectIntl(LoadingStateBase);

export default OptimizedState;
