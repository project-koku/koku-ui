import { Alert } from 'patternfly-react';
import React from 'react';
import { I18n } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps<{}> {}

const Home: React.SFC<Props> = () => (
  <Alert type="success">
    <I18n>{t => <div>{t('hello')}</div>}</I18n>
  </Alert>
);

export default Home;
