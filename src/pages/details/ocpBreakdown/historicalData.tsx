import { HistoricalDataBase } from 'pages/details/components/historicalData/historicalDataBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpHistoricalDataSelectors } from 'store/historicalData/ocpHistoricalData';

interface HistoricalDataStateProps {
  widgets: number[];
}

type HistoricalDataOwnProps = InjectedTranslateProps;

const mapStateToProps = createMapStateToProps<
  HistoricalDataOwnProps,
  HistoricalDataStateProps
>(state => {
  return {
    selectWidgets: ocpHistoricalDataSelectors.selectWidgets(state),
    widgets: ocpHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = translate()(
  connect(mapStateToProps, {})(HistoricalDataBase)
);

export { HistoricalData };
