import { connect } from 'react-redux';

import { awsCostOverviewSelectors } from '../../../store/breakdown/costOverview/awsCostOverview';
import { createMapStateToProps } from '../../../store/common';
import type { CostOverviewStateProps } from '../components/costOverview';
import { CostOverviewBase, type CostOverviewOwnProps } from '../components/costOverview';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<CostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: awsCostOverviewSelectors.selectWidgets(state),
    widgets: awsCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
