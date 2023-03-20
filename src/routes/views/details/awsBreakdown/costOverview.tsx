import { connect } from 'react-redux';
import type { CostOverviewStateProps } from 'routes/views/details/components/costOverview';
import { CostOverviewBase } from 'routes/views/details/components/costOverview';
import { awsCostOverviewSelectors } from 'store/breakdown/costOverview/awsCostOverview';
import { createMapStateToProps } from 'store/common';

interface AwsCostOverviewOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AwsCostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: awsCostOverviewSelectors.selectWidgets(state),
    widgets: awsCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
