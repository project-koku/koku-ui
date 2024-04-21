import { connect } from 'react-redux';
import type { HistoricalDataStateProps } from 'routes/details/components/historicalData';
import { HistoricalDataBase } from 'routes/details/components/historicalData';
import { ocpHistoricalDataSelectors } from 'store/breakdown/historicalData/ocpHistoricalData';
import { createMapStateToProps } from 'store/common';
import { FeatureToggleSelectors } from 'store/featureToggle';

interface OcpHistoricalDataOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OcpHistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    isOcpCloudNetworkingToggleEnabled: FeatureToggleSelectors.selectIsOcpCloudNetworkingToggleEnabled(state),
    isOcpProjectStorageToggleEnabled: FeatureToggleSelectors.selectIsOcpProjectStorageToggleEnabled(state),
    selectWidgets: ocpHistoricalDataSelectors.selectWidgets(state),
    widgets: ocpHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = connect(mapStateToProps, {})(HistoricalDataBase);

export { HistoricalData };
