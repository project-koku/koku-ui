import { connect } from 'react-redux';
import { DashboardBase } from 'routes/overview/components';
import type { DashboardStateProps } from 'routes/overview/components/dashboardBase';
import { createMapStateToProps } from 'store/common';
import { gcpDashboardSelectors } from 'store/dashboard/gcpDashboard';

import { GcpDashboardWidget } from './gcpDashboardWidget';

type GcpDashboardOwnProps = any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<GcpDashboardOwnProps, DashboardStateProps>((state, props) => {
  return {
    DashboardWidget: GcpDashboardWidget,
    selectWidgets: gcpDashboardSelectors.selectWidgets(state),
    widgets: gcpDashboardSelectors.selectCurrentWidgets(state),
  };
});

const GcpDashboard = connect(mapStateToProps, {})(DashboardBase);

export default GcpDashboard;
