import { CostReport, getCostReport } from 'api/reports';
import React from 'react';
import { I18n } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps<{}> {}
interface State {
  costReport: CostReport;
}

class Dashboard extends React.Component<Props, State> {
  public state: State = {
    costReport: {} as any,
  };

  public componentDidMount() {
    this.cost();
  }

  public cost() {
    getCostReport().then(({ data }) => {
      this.setState({
        costReport: data,
      });
    });
  }

  public render() {
    return (
      <I18n>
        {t => (
          <div className="page-header">
            <h2>{t('dashboard')}</h2>
            <h4>{t('cost')}</h4>
            <pre>{JSON.stringify(this.state.costReport, null, 2)}</pre>
          </div>
        )}
      </I18n>
    );
  }
}

export default Dashboard;
