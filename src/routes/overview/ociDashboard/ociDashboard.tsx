import { connect } from 'react-redux';
import { DashboardBase } from 'routes/overview/components';
import type { DashboardStateProps } from 'routes/overview/components/dashboardBase';
import { createMapStateToProps } from 'store/common';
import { ociDashboardSelectors } from 'store/dashboard/ociDashboard';

import { OciDashboardWidget } from './ociDashboardWidget';

type OciDashboardOwnProps = any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OciDashboardOwnProps, DashboardStateProps>((state, props) => {
  return {
    DashboardWidget: OciDashboardWidget,
    selectWidgets: ociDashboardSelectors.selectWidgets(state),
    widgets: ociDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OciDashboard = connect(mapStateToProps, {})(DashboardBase);

export default OciDashboard;
