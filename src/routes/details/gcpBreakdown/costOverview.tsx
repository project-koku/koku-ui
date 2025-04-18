import { connect } from 'react-redux';
import type { CostOverviewStateProps } from 'routes/details/components/costOverview';
import { CostOverviewBase } from 'routes/details/components/costOverview';
import { gcpCostOverviewSelectors } from 'store/breakdown/costOverview/gcpCostOverview';
import { createMapStateToProps } from 'store/common';
import { selectIsCostBreakdownChartToggleEnabled } from 'store/featureToggle/featureToggleSelectors';

interface GcpCostOverviewOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<GcpCostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    isCostBreakdownChartToggleEnabled: selectIsCostBreakdownChartToggleEnabled(state),
    selectWidgets: gcpCostOverviewSelectors.selectWidgets(state),
    widgets: gcpCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
