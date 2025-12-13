import { connect } from 'react-redux';
import type { CostOverviewStateProps } from 'routes/details/components/costOverview';
import { CostOverviewBase } from 'routes/details/components/costOverview';
import { ocpCostOverviewSelectors } from 'store/breakdown/costOverview/ocpCostOverview';
import { createMapStateToProps } from 'store/common';
import { selectIsGpuToggleEnabled } from 'store/featureToggle/featureToggleSelectors';

interface OcpCostOverviewOwnProps {
  title?: string;
}

const mapStateToProps = createMapStateToProps<OcpCostOverviewOwnProps, CostOverviewStateProps>((state, { title }) => {
  return {
    isGpuToggleEnabled: selectIsGpuToggleEnabled(state),
    selectWidgets: ocpCostOverviewSelectors.selectWidgets(state),
    widgets: ocpCostOverviewSelectors.selectCurrentWidgets(state),
    title,
  };
});

const CostOverview = connect(mapStateToProps, {})(CostOverviewBase);

export { CostOverview };
