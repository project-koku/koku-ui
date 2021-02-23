import { DashboardBase } from 'pages/views/overview/components/dashboardBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { gcpDashboardSelectors } from 'store/dashboard/gcpDashboard';

import { GcpDashboardWidget } from './gcpDashboardWidget';

type GcpDashboardOwnProps = WithTranslation;

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

const GcpDashboard = withTranslation()(connect(mapStateToProps, {})(DashboardBase));

export default GcpDashboard;
