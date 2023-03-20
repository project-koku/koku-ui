import { connect } from 'react-redux';
import { DashboardBase } from 'routes/views/overview/components';
import type { DashboardStateProps } from 'routes/views/overview/components/dashboardBase';
import { createMapStateToProps } from 'store/common';
import { ocpDashboardSelectors } from 'store/dashboard/ocpDashboard';

import { OcpDashboardWidget } from './ocpDashboardWidget';

type OcpDashboardOwnProps = any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OcpDashboardOwnProps, DashboardStateProps>((state, props) => {
  return {
    DashboardWidget: OcpDashboardWidget,
    selectWidgets: ocpDashboardSelectors.selectWidgets(state),
    widgets: ocpDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpDashboard = connect(mapStateToProps, {})(DashboardBase);

export default OcpDashboard;
