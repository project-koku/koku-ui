import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { HistoricalDataBase } from 'routes/views/details/components/historicalData';
import { gcpHistoricalDataSelectors } from 'store/breakdown/historicalData/gcpHistoricalData';
import { createMapStateToProps } from 'store/common';

interface HistoricalDataStateProps {
  widgets: number[];
}

type HistoricalDataOwnProps = WrappedComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<HistoricalDataOwnProps, HistoricalDataStateProps>((state, props) => {
  return {
    selectWidgets: gcpHistoricalDataSelectors.selectWidgets(state),
    widgets: gcpHistoricalDataSelectors.selectCurrentWidgets(state),
  };
});

const HistoricalData = injectIntl(connect(mapStateToProps, {})(HistoricalDataBase));

export { HistoricalData };
