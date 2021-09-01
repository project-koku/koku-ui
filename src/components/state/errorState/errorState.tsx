import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons/dist/esm/icons/error-circle-o-icon';
import { LockIcon } from '@patternfly/react-icons/dist/esm/icons/lock-icon';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface ErrorStateProps extends WrappedComponentProps {
  error: AxiosError;
  icon?: any;
}

const ErrorStateBase: React.SFC<ErrorStateProps> = ({ error, icon = ErrorCircleOIcon, intl }) => {
  let title = intl.formatMessage(messages.ErrorStateUnexpectedTitle);
  let subTitle = intl.formatMessage(messages.ErrorStateUnexpectedDesc);

  if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
    icon = LockIcon;
    title = intl.formatMessage(messages.ErrorStateNotAuthorizedTitle);
    subTitle = intl.formatMessage(messages.ErrorStateNotAuthorizedDesc);
  }

  return (
    <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
      <EmptyStateIcon icon={icon} />
      <Title headingLevel="h5" size="lg">
        {title}
      </Title>
      <EmptyStateBody>{subTitle}</EmptyStateBody>
    </EmptyState>
  );
};

const ErrorState = injectIntl(ErrorStateBase);

export { ErrorState };
