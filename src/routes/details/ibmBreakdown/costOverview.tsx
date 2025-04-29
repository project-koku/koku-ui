import { connect } from 'react-redux';
import type { CostOverviewStateProps } from 'routes/details/components/costOverview';
import { CostOverviewBase } from 'routes/details/components/costOverview';
import { ibmCostOverviewSelectors } from 'store/breakdown/costOverview/ibmCostOverview';
import { createMapStateToProps } from 'store/common';

interface IbmCostOverviewOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<IbmCostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: ibmCostOverviewSelectors.selectWidgets(state),
    widgets: ibmCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
