import { connect } from 'react-redux';
import { DashboardBase } from 'routes/views/overview/components';
import type { DashboardStateProps } from 'routes/views/overview/components/dashboardBase';
import { createMapStateToProps } from 'store/common';
import { azureOcpDashboardSelectors } from 'store/dashboard/azureOcpDashboard';

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
