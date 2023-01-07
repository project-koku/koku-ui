import { connect } from 'react-redux';
import { CostOverviewBase } from 'routes/views/details/components/costOverview';
import { gcpCostOverviewSelectors } from 'store/breakdown/costOverview/gcpCostOverview';
import { createMapStateToProps } from 'store/common';

interface CostOverviewStateProps {
  widgets: number[];
}

interface CostOverviewOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<CostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: gcpCostOverviewSelectors.selectWidgets(state),
    widgets: gcpCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
