import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { azureOcpDashboardSelectors } from '../../../store/dashboard/azureOcpDashboard';
import { DashboardBase } from '../components';
import type { DashboardStateProps } from '../components/dashboardBase';
import { AzureOcpDashboardWidget } from './azureOcpDashboardWidget';

type AzureOcpDashboardOwnProps = any;

const mapStateToProps = createMapStateToProps<AzureOcpDashboardOwnProps, DashboardStateProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (state, props) => {
    return {
      DashboardWidget: AzureOcpDashboardWidget,
      selectWidgets: azureOcpDashboardSelectors.selectWidgets(state),
      widgets: azureOcpDashboardSelectors.selectCurrentWidgets(state),
    };
  }
);

const AzureOcpDashboard = connect(mapStateToProps, {})(DashboardBase);

export default AzureOcpDashboard;
