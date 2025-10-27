import { connect } from 'react-redux';
import { DashboardBase } from 'routes/overview/components';
import type { DashboardStateProps } from 'routes/overview/components/dashboardBase';
import { createMapStateToProps } from 'store/common';
import { azureDashboardSelectors } from 'store/dashboard/azureDashboard';

import { AzureDashboardWidget } from './azureDashboardWidget';

type AzureDashboardOwnProps = any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AzureDashboardOwnProps, DashboardStateProps>((state, props) => {
  return {
    DashboardWidget: AzureDashboardWidget,
    selectWidgets: azureDashboardSelectors.selectWidgets(state),
    widgets: azureDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AzureDashboard = connect(mapStateToProps, {})(DashboardBase);

export default AzureDashboard;
