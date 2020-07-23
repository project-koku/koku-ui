import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { NotAuthorized as _NotAuthorized } from '@redhat-cloud-services/frontend-components/components/NotAuthorized';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

const NotAuthorizedBase: React.SFC<InjectedTranslateProps> = ({
  t
}) => {
  return (
    <Main>
      <_NotAuthorized serviceName={t('cost_management')} />
    </Main>
  );
};

const NotAuthorized = translate()(NotAuthorizedBase);

export { NotAuthorized };
