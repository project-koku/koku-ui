import { connect } from 'react-redux';

import { gcpHistoricalDataSelectors } from '../../../store/breakdown/historicalData/gcpHistoricalData';
import { createMapStateToProps } from '../../../store/common';
import type { HistoricalDataStateProps } from '../components/historicalData';
import { HistoricalDataBase } from '../components/historicalData';

interface GcpHistoricalDataOwnProps {
  timeScopeValue?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<GcpHistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    selectWidgets: gcpHistoricalDataSelectors.selectWidgets(state),
    widgets: gcpHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = connect(mapStateToProps, {})(HistoricalDataBase);

export { HistoricalData };
