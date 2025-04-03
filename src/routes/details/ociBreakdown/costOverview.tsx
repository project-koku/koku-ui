import { connect } from 'react-redux';
import type { CostOverviewStateProps } from 'routes/details/components/costOverview';
import { CostOverviewBase } from 'routes/details/components/costOverview';
import { ociCostOverviewSelectors } from 'store/breakdown/costOverview/ociCostOverview';
import { createMapStateToProps } from 'store/common';
import { selectIsCostBreakdownChartToggleEnabled } from 'store/featureToggle/featureToggleSelectors';

interface OciCostOverviewOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OciCostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    isCostBreakdownChartToggleEnabled: selectIsCostBreakdownChartToggleEnabled(state),
    selectWidgets: ociCostOverviewSelectors.selectWidgets(state),
    widgets: ociCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
