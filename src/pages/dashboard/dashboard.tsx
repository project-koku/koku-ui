import React from 'react';
import { I18n } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps<{}> {}

const Dashboard: React.SFC<Props> = () => (
  <I18n>
    {t => (
      <div className="page-header">
        <h2>{t('dashboard')}</h2>
      </div>
    )}
  </I18n>
);

export default Dashboard;
