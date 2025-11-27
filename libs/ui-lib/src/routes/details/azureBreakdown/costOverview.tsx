import { connect } from 'react-redux';

import { azureCostOverviewSelectors } from '../../../store/breakdown/costOverview/azureCostOverview';
import { createMapStateToProps } from '../../../store/common';
import type { CostOverviewStateProps } from '../components/costOverview';
import { CostOverviewBase } from '../components/costOverview';

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
