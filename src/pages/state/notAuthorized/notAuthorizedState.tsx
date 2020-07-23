import { NotAuthorized as _NotAuthorized } from '@redhat-cloud-services/frontend-components/components/NotAuthorized';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

const NotAuthorizedStateBase: React.SFC<InjectedTranslateProps> = ({
  t
}) => {
  return (
    <_NotAuthorized serviceName={t('cost_management')} />
  );
};

const NotAuthorizedState = translate()(NotAuthorizedStateBase);

export { NotAuthorizedState }
