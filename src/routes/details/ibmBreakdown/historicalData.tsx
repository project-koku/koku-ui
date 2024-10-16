import { connect } from 'react-redux';
import type { HistoricalDataStateProps } from 'routes/details/components/historicalData';
import { HistoricalDataBase } from 'routes/details/components/historicalData';
import { ibmHistoricalDataSelectors } from 'store/breakdown/historicalData/ibmHistoricalData';
import { createMapStateToProps } from 'store/common';

interface IbmHistoricalDataOwnProps {
  timeScopeValue?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<IbmHistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    selectWidgets: ibmHistoricalDataSelectors.selectWidgets(state),
    widgets: ibmHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = connect(mapStateToProps, {})(HistoricalDataBase);

export { HistoricalData };
