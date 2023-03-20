import { connect } from 'react-redux';
import type { HistoricalDataStateProps } from 'routes/views/details/components/historicalData';
import { HistoricalDataBase } from 'routes/views/details/components/historicalData';
import { rhelHistoricalDataSelectors } from 'store/breakdown/historicalData/rhelHistoricalData';
import { createMapStateToProps } from 'store/common';

interface RhelHistoricalDataOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<RhelHistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    selectWidgets: rhelHistoricalDataSelectors.selectWidgets(state),
    widgets: rhelHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = connect(mapStateToProps, {})(HistoricalDataBase);

export { HistoricalData };
