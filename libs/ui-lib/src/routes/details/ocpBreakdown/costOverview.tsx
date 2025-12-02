import { connect } from 'react-redux';

import { ocpCostOverviewSelectors } from '../../../store/breakdown/costOverview/ocpCostOverview';
import { createMapStateToProps } from '../../../store/common';
import type { CostOverviewStateProps } from '../components/costOverview';
import { CostOverviewBase } from '../components/costOverview';

interface OcpCostOverviewOwnProps {
  title?: string;
}

const mapStateToProps = createMapStateToProps<OcpCostOverviewOwnProps, CostOverviewStateProps>((state, { title }) => {
  return {
    selectWidgets: ocpCostOverviewSelectors.selectWidgets(state),
    widgets: ocpCostOverviewSelectors.selectCurrentWidgets(state),
    title,
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
