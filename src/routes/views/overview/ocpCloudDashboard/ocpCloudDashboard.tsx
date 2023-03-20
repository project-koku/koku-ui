import { connect } from 'react-redux';
import { DashboardBase } from 'routes/views/overview/components';
import type { DashboardStateProps } from 'routes/views/overview/components/dashboardBase';
import { createMapStateToProps } from 'store/common';
import { ocpCloudDashboardSelectors } from 'store/dashboard/ocpCloudDashboard';

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
