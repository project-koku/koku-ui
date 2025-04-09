import { connect } from 'react-redux';
import type { CostOverviewStateProps } from 'routes/details/components/costOverview';
import { CostOverviewBase } from 'routes/details/components/costOverview';
import { azureCostOverviewSelectors } from 'store/breakdown/costOverview/azureCostOverview';
import { createMapStateToProps } from 'store/common';
import { selectIsCostBreakdownChartToggleEnabled } from 'store/featureToggle/featureToggleSelectors';

interface AzureCostOverviewOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AzureCostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    isCostBreakdownChartToggleEnabled: selectIsCostBreakdownChartToggleEnabled(state),
    selectWidgets: azureCostOverviewSelectors.selectWidgets(state),
    widgets: azureCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
