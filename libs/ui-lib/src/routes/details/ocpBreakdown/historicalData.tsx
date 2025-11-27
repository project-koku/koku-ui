import { connect } from 'react-redux';

import { ocpHistoricalDataSelectors } from '../../../store/breakdown/historicalData/ocpHistoricalData';
import { createMapStateToProps } from '../../../store/common';
import type { HistoricalDataStateProps } from '../components/historicalData';
import { HistoricalDataBase } from '../components/historicalData';

interface OcpHistoricalDataOwnProps {
  timeScopeValue?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OcpHistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    selectWidgets: ocpHistoricalDataSelectors.selectWidgets(state),
    widgets: ocpHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = connect(mapStateToProps, {})(HistoricalDataBase);

export { HistoricalData };
