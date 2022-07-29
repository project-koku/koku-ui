import { DashboardBase } from 'pages/views/overview/components/dashboardBase';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ociDashboardSelectors } from 'store/dashboard/ociDashboard';

import { OciDashboardWidget } from './ociDashboardWidget';

type OciDashboardOwnProps = any;

interface OciDashboardStateProps {
  DashboardWidget: typeof OciDashboardWidget;
  widgets: number[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OciDashboardOwnProps, OciDashboardStateProps>((state, props) => {
  return {
    DashboardWidget: OciDashboardWidget,
    selectWidgets: ociDashboardSelectors.selectWidgets(state),
    widgets: ociDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OciDashboard = connect(mapStateToProps, {})(DashboardBase);

export default OciDashboard;
