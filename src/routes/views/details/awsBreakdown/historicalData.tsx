import { HistoricalDataBase } from 'routes/views/details/components/historicalData/historicalDataBase';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { awsHistoricalDataSelectors } from 'store/breakdown/historicalData/awsHistoricalData';
import { createMapStateToProps } from 'store/common';

interface HistoricalDataStateProps {
  widgets: number[];
}

type HistoricalDataOwnProps = WrappedComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<HistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    selectWidgets: awsHistoricalDataSelectors.selectWidgets(state),
    widgets: awsHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = injectIntl(connect(mapStateToProps, {})(HistoricalDataBase));

export { HistoricalData };
