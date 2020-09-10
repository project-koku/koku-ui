import { HistoricalDataBase } from 'pages/details/components/historicalData/historicalDataBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { awsHistoricalDataSelectors } from 'store/historicalData/awsHistoricalData';

interface HistoricalDataStateProps {
  widgets: number[];
}

type HistoricalDataOwnProps = InjectedTranslateProps;

const mapStateToProps = createMapStateToProps<HistoricalDataOwnProps, HistoricalDataStateProps>(state => {
  return {
    selectWidgets: awsHistoricalDataSelectors.selectWidgets(state),
    widgets: awsHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = translate()(connect(mapStateToProps, {})(HistoricalDataBase));

export { HistoricalData };
