import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { azureDashboardSelectors } from '../../../store/dashboard/azureDashboard';
import { DashboardBase } from '../components';
import type { DashboardStateProps } from '../components/dashboardBase';
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
