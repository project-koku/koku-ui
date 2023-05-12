import { connect } from 'react-redux';
import type { HistoricalDataStateProps } from 'routes/details/components/historicalData';
import { HistoricalDataBase } from 'routes/details/components/historicalData';
import { gcpHistoricalDataSelectors } from 'store/breakdown/historicalData/gcpHistoricalData';
import { createMapStateToProps } from 'store/common';

interface GcpHistoricalDataOwnProps {
  // TBD...
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
