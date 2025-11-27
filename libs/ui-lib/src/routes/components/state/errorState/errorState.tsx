import messages from '@koku-ui/i18n/locales/messages';
import { EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons/dist/esm/icons/error-circle-o-icon';
import { LockIcon } from '@patternfly/react-icons/dist/esm/icons/lock-icon';
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface ErrorStateProps extends WrappedComponentProps {
  error: AxiosError;
  icon?: any;
}

const ErrorStateBase: React.FC<ErrorStateProps> = ({ error, icon = ErrorCircleOIcon, intl }) => {
  let title = intl.formatMessage(messages.errorStateUnexpectedTitle);
  let subTitle = intl.formatMessage(messages.errorStateUnexpectedDesc);

  if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
    icon = LockIcon;
    title = intl.formatMessage(messages.errorStateNotAuthorizedTitle);
    subTitle = intl.formatMessage(messages.errorStateNotAuthorizedDesc);
  }

  return (
    <EmptyState
      headingLevel="h5"
      icon={icon}
      titleText={title}
      variant={EmptyStateVariant.lg}
      className="pf-m-redhat-font"
    >
      <EmptyStateBody>{subTitle}</EmptyStateBody>
    </EmptyState>
  );
};

const ErrorState = injectIntl(ErrorStateBase);

export default ErrorState;
