import { DashboardBase } from 'pages/views/overview/components/dashboardBase';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpCloudDashboardSelectors } from 'store/dashboard/ocpCloudDashboard';

import { OcpCloudDashboardWidget } from './ocpCloudDashboardWidget';

type OcpCloudDashboardOwnProps = any;

interface OcpCloudDashboardStateProps {
  DashboardWidget: typeof OcpCloudDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<OcpCloudDashboardOwnProps, OcpCloudDashboardStateProps>(
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
