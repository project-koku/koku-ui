import { connect } from 'react-redux';
import type { CostOverviewStateProps } from 'routes/details/components/costOverview';
import { CostOverviewBase } from 'routes/details/components/costOverview';
import { ocpCostOverviewSelectors } from 'store/breakdown/costOverview/ocpCostOverview';
import { createMapStateToProps } from 'store/common';

interface OcpCostOverviewOwnProps {
  title?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OcpCostOverviewOwnProps, CostOverviewStateProps>((state, { title }) => {
  return {
    selectWidgets: ocpCostOverviewSelectors.selectWidgets(state),
    widgets: ocpCostOverviewSelectors.selectCurrentWidgets(state),
    title,
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
