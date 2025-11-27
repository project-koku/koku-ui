import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { awsOcpDashboardSelectors } from '../../../store/dashboard/awsOcpDashboard';
import { DashboardBase } from '../components';
import type { DashboardStateProps } from '../components/dashboardBase';
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
