import { HistoricalDataBase } from 'pages/views/details/components/historicalData/historicalDataBase';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { ociHistoricalDataSelectors } from 'store/breakdown/historicalData/ociHistoricalData';
import { createMapStateToProps } from 'store/common';

interface HistoricalDataStateProps {
  widgets: number[];
}

type HistoricalDataOwnProps = WrappedComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<HistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    selectWidgets: ociHistoricalDataSelectors.selectWidgets(state),
    widgets: ociHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = injectIntl(connect(mapStateToProps, {})(HistoricalDataBase));

export { HistoricalData };
