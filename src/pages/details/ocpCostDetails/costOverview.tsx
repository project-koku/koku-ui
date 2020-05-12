import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

// tslint:disable-next-line:no-empty-interface
interface CostOverviewOwnProps {}

// tslint:disable-next-line:no-empty-interface
interface CostOverviewState {}

type CostOverviewProps = CostOverviewOwnProps & InjectedTranslateProps;

class CostOverviewBase extends React.Component<CostOverviewProps> {
  protected defaultState: CostOverviewState = {};
  public state: CostOverviewState = { ...this.defaultState };

  public render() {
    return <div>Cost Overview</div>;
  }
}

const CostOverview = translate()(CostOverviewBase);

export { CostOverview };
