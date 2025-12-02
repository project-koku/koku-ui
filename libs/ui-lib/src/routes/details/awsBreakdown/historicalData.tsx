import { connect } from 'react-redux';

import { awsHistoricalDataSelectors } from '../../../store/breakdown/historicalData/awsHistoricalData';
import { createMapStateToProps } from '../../../store/common';
import type { HistoricalDataStateProps } from '../components/historicalData';
import { HistoricalDataBase } from '../components/historicalData';

interface AwsHistoricalDataOwnProps {
  timeScopeValue?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AwsHistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    selectWidgets: awsHistoricalDataSelectors.selectWidgets(state),
    widgets: awsHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = connect(mapStateToProps, {})(HistoricalDataBase);

export { HistoricalData };
