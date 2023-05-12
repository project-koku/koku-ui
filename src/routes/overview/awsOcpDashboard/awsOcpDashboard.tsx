import { connect } from 'react-redux';
import { DashboardBase } from 'routes/overview/components';
import type { DashboardStateProps } from 'routes/overview/components/dashboardBase';
import { createMapStateToProps } from 'store/common';
import { awsOcpDashboardSelectors } from 'store/dashboard/awsOcpDashboard';

import { AwsOcpDashboardWidget } from './awsOcpDashboardWidget';

type AwsOcpDashboardOwnProps = any;

const mapStateToProps = createMapStateToProps<AwsOcpDashboardOwnProps, DashboardStateProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (state, props) => {
    return {
      DashboardWidget: AwsOcpDashboardWidget,
      selectWidgets: awsOcpDashboardSelectors.selectWidgets(state),
      widgets: awsOcpDashboardSelectors.selectCurrentWidgets(state),
    };
  }
);

const AwsOcpDashboard = connect(mapStateToProps, {})(DashboardBase);

export default AwsOcpDashboard;
