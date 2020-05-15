import {
  EmptyState as PfEmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { ErrorCircleOIcon, LockIcon } from '@patternfly/react-icons';
import { AxiosError } from 'axios';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { styles } from './errorState.styles';

interface ErrorStateProps extends WrappedComponentProps {
  error: AxiosError;
  icon?: string;
}

const ErrorStateBase: React.SFC<ErrorStateProps> = ({
  error,
  icon = ErrorCircleOIcon,
  intl,
}) => {
  let title = intl.formatMessage({ id: 'error_state.unexpected_title' });
  let subTitle = intl.formatMessage({ id: 'error_state.unexpected_desc' });

  if (
    error &&
    error.response &&
    (error.response.status === 401 || error.response.status === 403)
  ) {
    icon = LockIcon;
    title = intl.formatMessage({ id: 'error_state.unauthorized_title' });
    subTitle = intl.formatMessage({ id: 'error_state.unauthorized_desc' });
  }

  return (
    <div style={styles.container}>
      <PfEmptyState>
        <EmptyStateIcon icon={icon} />
        <Title size="lg">{title}</Title>
        <EmptyStateBody>{subTitle}</EmptyStateBody>
      </PfEmptyState>
    </div>
  );
};

const ErrorState = injectIntl(ErrorStateBase);

export { ErrorState };
