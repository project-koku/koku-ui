import { connect } from 'react-redux';
import type { HistoricalDataStateProps } from 'routes/details/components/historicalData';
import { HistoricalDataBase } from 'routes/details/components/historicalData';
import { azureHistoricalDataSelectors } from 'store/breakdown/historicalData/azureHistoricalData';
import { createMapStateToProps } from 'store/common';

interface AzureHistoricalDataOwnProps {
  timeScopeValue?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AzureHistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    selectWidgets: azureHistoricalDataSelectors.selectWidgets(state),
    widgets: azureHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = connect(mapStateToProps, {})(HistoricalDataBase);

export { HistoricalData };
