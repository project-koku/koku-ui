import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { ocpCloudDashboardSelectors } from '../../../store/dashboard/ocpCloudDashboard';
import { DashboardBase } from '../components';
import type { DashboardStateProps } from '../components/dashboardBase';
import { OcpCloudDashboardWidget } from './ocpCloudDashboardWidget';

type OcpCloudDashboardOwnProps = any;

const mapStateToProps = createMapStateToProps<OcpCloudDashboardOwnProps, DashboardStateProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (state, props) => {
    return {
      DashboardWidget: OcpCloudDashboardWidget,
      selectWidgets: ocpCloudDashboardSelectors.selectWidgets(state),
      widgets: ocpCloudDashboardSelectors.selectCurrentWidgets(state),
    };
  }
);

const OcpCloudDashboard = connect(mapStateToProps, {})(DashboardBase);

export default OcpCloudDashboard;
