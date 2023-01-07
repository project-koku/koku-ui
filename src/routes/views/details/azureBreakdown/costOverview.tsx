import { connect } from 'react-redux';
import { CostOverviewBase } from 'routes/views/details/components/costOverview';
import { azureCostOverviewSelectors } from 'store/breakdown/costOverview/azureCostOverview';
import { createMapStateToProps } from 'store/common';

interface CostOverviewStateProps {
  widgets: number[];
}

interface CostOverviewOwnProps {
  // TBD...
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<CostOverviewOwnProps, CostOverviewStateProps>((state, props) => {
  return {
    selectWidgets: azureCostOverviewSelectors.selectWidgets(state),
    widgets: azureCostOverviewSelectors.selectCurrentWidgets(state),
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
