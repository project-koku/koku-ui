import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { gcpOcpDashboardSelectors } from '../../../store/dashboard/gcpOcpDashboard';
import { DashboardBase } from '../components';
import type { DashboardStateProps } from '../components/dashboardBase';
import { GcpOcpDashboardWidget } from './gcpOcpDashboardWidget';

type GcpOcpDashboardOwnProps = any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<GcpOcpDashboardOwnProps, DashboardStateProps>((state, props) => {
  return {
    DashboardWidget: GcpOcpDashboardWidget,
    selectWidgets: gcpOcpDashboardSelectors.selectWidgets(state),
    widgets: gcpOcpDashboardSelectors.selectCurrentWidgets(state),
  };
});

const GcpOcpDashboard = connect(mapStateToProps, {})(DashboardBase);

export default GcpOcpDashboard;
