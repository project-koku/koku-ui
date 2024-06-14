import { connect } from 'react-redux';
import type { CostOverviewStateProps } from 'routes/details/components/costOverview';
import { CostOverviewBase } from 'routes/details/components/costOverview';
import { rhelCostOverviewSelectors } from 'store/breakdown/costOverview/rhelCostOverview';
import { createMapStateToProps } from 'store/common';

interface RhelCostOverviewOwnProps {
  title?: string;
}

const mapStateToProps = createMapStateToProps<RhelCostOverviewOwnProps, CostOverviewStateProps>((state, { title }) => {
  return {
    selectWidgets: rhelCostOverviewSelectors.selectWidgets(state),
    widgets: rhelCostOverviewSelectors.selectCurrentWidgets(state),
    title,
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
