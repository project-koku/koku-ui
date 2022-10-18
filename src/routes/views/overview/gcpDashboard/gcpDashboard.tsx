import { connect } from 'react-redux';
import { DashboardBase } from 'routes/views/overview/components';
import { createMapStateToProps } from 'store/common';
import { gcpDashboardSelectors } from 'store/dashboard/gcpDashboard';

import { GcpDashboardWidget } from './gcpDashboardWidget';

type GcpDashboardOwnProps = any;

interface GcpDashboardStateProps {
  DashboardWidget: typeof GcpDashboardWidget;
  widgets: number[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<GcpDashboardOwnProps, GcpDashboardStateProps>((state, props) => {
  return {
    DashboardWidget: GcpDashboardWidget,
    selectWidgets: gcpDashboardSelectors.selectWidgets(state),
    widgets: gcpDashboardSelectors.selectCurrentWidgets(state),
  };
});

const GcpDashboard = connect(mapStateToProps, {})(DashboardBase);

export default GcpDashboard;
