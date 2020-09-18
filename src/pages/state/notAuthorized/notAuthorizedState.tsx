import { NotAuthorized as _NotAuthorized } from '@redhat-cloud-services/frontend-components/components/NotAuthorized';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

interface NotAuthorizedStateOwnProps {
  serviceName?: string;
}

type NotAuthorizedStateProps = NotAuthorizedStateOwnProps & WithTranslation;

const NotAuthorizedStateBase: React.SFC<NotAuthorizedStateProps> = ({
  t,
  serviceName = t('error_state.unauthorized_service_name'),
}) => {
  return <_NotAuthorized serviceName={serviceName} />;
};

const NotAuthorizedState = withTranslation()(NotAuthorizedStateBase);

export { NotAuthorizedState };
