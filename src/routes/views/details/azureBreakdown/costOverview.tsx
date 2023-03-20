import { connect } from 'react-redux';
import type { CostOverviewStateProps } from 'routes/views/details/components/costOverview';
import { CostOverviewBase } from 'routes/views/details/components/costOverview';
import { azureCostOverviewSelectors } from 'store/breakdown/costOverview/azureCostOverview';
import { createMapStateToProps } from 'store/common';

interface AzureCostOverviewOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AzureCostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: azureCostOverviewSelectors.selectWidgets(state),
    widgets: azureCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
