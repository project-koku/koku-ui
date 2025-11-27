import { connect } from 'react-redux';

import { azureHistoricalDataSelectors } from '../../../store/breakdown/historicalData/azureHistoricalData';
import { createMapStateToProps } from '../../../store/common';
import type { HistoricalDataStateProps } from '../components/historicalData';
import { HistoricalDataBase } from '../components/historicalData';

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
