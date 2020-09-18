import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons/dist/js/icons/error-circle-o-icon';
import { LockIcon } from '@patternfly/react-icons/dist/js/icons/lock-icon';
import { AxiosError } from 'axios';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

interface ErrorStateProps extends WithTranslation {
  error: AxiosError;
  icon?: any;
}

const ErrorStateBase: React.SFC<ErrorStateProps> = ({ error, icon = ErrorCircleOIcon, t }) => {
  let title = t('error_state.unexpected_title');
  let subTitle = t('error_state.unexpected_desc');

  if (error && error.response && (error.response.status === 401 || error.response.status === 403)) {
    icon = LockIcon;
    title = t('error_state.unauthorized_title');
    subTitle = t('error_state.unauthorized_desc');
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

const ErrorState = withTranslation()(ErrorStateBase);

export { ErrorState };
