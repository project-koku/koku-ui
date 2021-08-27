import { EmptyState, EmptyStateBody, EmptyStateVariant, Spinner, Title } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface LoadingStateProps extends WrappedComponentProps {
  icon?: string;
}

const LoadingStateBase: React.SFC<LoadingStateProps> = ({ intl }) => {
  const title = intl.formatMessage(messages.LoadingStateTitle);
  const subTitle = intl.formatMessage(messages.LoadingStateDesc);

  return (
    <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
      <Spinner size="lg" />
      <Title headingLevel="h5" size="lg">
        {title}
      </Title>
      <EmptyStateBody>{subTitle}</EmptyStateBody>
    </EmptyState>
  );
};

const LoadingState = injectIntl(LoadingStateBase);

export { LoadingState };
