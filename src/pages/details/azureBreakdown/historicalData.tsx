import { HistoricalDataBase } from 'pages/details/components/historicalData/historicalDataBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { azureHistoricalDataSelectors } from 'store/historicalData/azureHistoricalData';

interface HistoricalDataStateProps {
  widgets: number[];
}

type HistoricalDataOwnProps = WithTranslation;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<HistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    selectWidgets: azureHistoricalDataSelectors.selectWidgets(state),
    widgets: azureHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = withTranslation()(connect(mapStateToProps, {})(HistoricalDataBase));

export { HistoricalData };
