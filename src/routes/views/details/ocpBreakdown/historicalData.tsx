import { connect } from 'react-redux';
import { HistoricalDataBase } from 'routes/views/details/components/historicalData';
import { ocpHistoricalDataSelectors } from 'store/breakdown/historicalData/ocpHistoricalData';
import { createMapStateToProps } from 'store/common';

interface HistoricalDataStateProps {
  widgets: number[];
}

interface HistoricalDataOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<HistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    selectWidgets: ocpHistoricalDataSelectors.selectWidgets(state),
    widgets: ocpHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = connect(mapStateToProps, {})(HistoricalDataBase);

export { HistoricalData };
