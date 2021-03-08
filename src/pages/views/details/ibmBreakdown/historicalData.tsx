import { HistoricalDataBase } from 'pages/views/details/components/historicalData/historicalDataBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ibmHistoricalDataSelectors } from 'store/breakdown/historicalData/ibmHistoricalData';
import { createMapStateToProps } from 'store/common';

interface HistoricalDataStateProps {
  widgets: number[];
}

type HistoricalDataOwnProps = WithTranslation;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<HistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    selectWidgets: ibmHistoricalDataSelectors.selectWidgets(state),
    widgets: ibmHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = withTranslation()(connect(mapStateToProps, {})(HistoricalDataBase));

export { HistoricalData };
