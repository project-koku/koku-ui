import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

// tslint:disable-next-line:no-empty-interface
interface DetailsHistoricalDataOwnProps {}

// tslint:disable-next-line:no-empty-interface
interface DetailsHistoricalDataState {}

type DetailsHistoricalDataProps = DetailsHistoricalDataOwnProps &
  InjectedTranslateProps;

class DetailsHistoricalDataBase extends React.Component<
  DetailsHistoricalDataProps
> {
  protected defaultState: DetailsHistoricalDataState = {};
  public state: DetailsHistoricalDataState = { ...this.defaultState };

  public render() {
    return <div>Ocp Historical Data</div>;
  }
}

const DetailsDetailsHistoricalData = translate()(DetailsHistoricalDataBase);

export { DetailsDetailsHistoricalData };
