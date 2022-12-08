import { connect } from 'react-redux';
import { DashboardBase } from 'routes/views/overview/components';
import { createMapStateToProps } from 'store/common';
import { rhelDashboardSelectors } from 'store/dashboard/rhelDashboard';

import { RhelDashboardWidget } from './rhelDashboardWidget';

type RhelDashboardOwnProps = any;

interface RhelDashboardStateProps {
  DashboardWidget: typeof RhelDashboardWidget;
  widgets: number[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<RhelDashboardOwnProps, RhelDashboardStateProps>((state, props) => {
  return {
    DashboardWidget: RhelDashboardWidget,
    selectWidgets: rhelDashboardSelectors.selectWidgets(state),
    widgets: rhelDashboardSelectors.selectCurrentWidgets(state),
  };
});

const RhelDashboard = connect(mapStateToProps, {})(DashboardBase);

export default RhelDashboard;
