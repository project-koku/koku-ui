import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

// tslint:disable-next-line:no-empty-interface
interface HistoricalDataOwnProps {}

// tslint:disable-next-line:no-empty-interface
interface HistoricalDataState {}

type HistoricalDataProps = HistoricalDataOwnProps & InjectedTranslateProps;

class HistoricalDataBase extends React.Component<HistoricalDataProps> {
  protected defaultState: HistoricalDataState = {};
  public state: HistoricalDataState = { ...this.defaultState };

  public render() {
    return <div>Historical Data</div>;
  }
}

const HistoricalData = translate()(HistoricalDataBase);

export { HistoricalData };
