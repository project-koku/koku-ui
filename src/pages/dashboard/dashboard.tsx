import { LineChart } from 'patternfly-react/dist/js/components/Chart';
import React from 'react';
import { I18n } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps<{}> {}

const Dashboard: React.SFC<Props> = () => (
  <I18n>
    {t => (
      <div className="page-header">
        <h2>{t('dashboard')}</h2>
        <LineChart
          data={{
            columns: [
              ['data1', 30, 200, 100, 400, 150, 250],
              ['data2', 50, 20, 10, 40, 15, 25],
            ],
          }}
        />
      </div>
    )}
  </I18n>
);

export default Dashboard;
