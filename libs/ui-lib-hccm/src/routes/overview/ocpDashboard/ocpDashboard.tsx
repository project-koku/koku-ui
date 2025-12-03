import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { ocpDashboardSelectors } from '../../../store/dashboard/ocpDashboard';
import { DashboardBase } from '../components';
import type { DashboardStateProps } from '../components/dashboardBase';
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
