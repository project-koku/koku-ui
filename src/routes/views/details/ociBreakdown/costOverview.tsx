import { connect } from 'react-redux';
import type { CostOverviewStateProps } from 'routes/views/details/components/costOverview';
import { CostOverviewBase } from 'routes/views/details/components/costOverview';
import { ociCostOverviewSelectors } from 'store/breakdown/costOverview/ociCostOverview';
import { createMapStateToProps } from 'store/common';

interface OciCostOverviewOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OciCostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: ociCostOverviewSelectors.selectWidgets(state),
    widgets: ociCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
