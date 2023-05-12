import { connect } from 'react-redux';
import { DashboardBase } from 'routes/overview/components';
import type { DashboardStateProps } from 'routes/overview/components/dashboardBase';
import { createMapStateToProps } from 'store/common';
import { ibmDashboardSelectors } from 'store/dashboard/ibmDashboard';

import { IbmDashboardWidget } from './ibmDashboardWidget';

type IbmDashboardOwnProps = any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<IbmDashboardOwnProps, DashboardStateProps>((state, props) => {
  return {
    DashboardWidget: IbmDashboardWidget,
    selectWidgets: ibmDashboardSelectors.selectWidgets(state),
    widgets: ibmDashboardSelectors.selectCurrentWidgets(state),
  };
});

const IbmDashboard = connect(mapStateToProps, {})(DashboardBase);

export default IbmDashboard;
