import { connect } from 'react-redux';

import { gcpCostOverviewSelectors } from '../../../store/breakdown/costOverview/gcpCostOverview';
import { createMapStateToProps } from '../../../store/common';
import type { CostOverviewStateProps } from '../components/costOverview';
import { CostOverviewBase } from '../components/costOverview';

interface GcpCostOverviewOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<GcpCostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: gcpCostOverviewSelectors.selectWidgets(state),
    widgets: gcpCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
