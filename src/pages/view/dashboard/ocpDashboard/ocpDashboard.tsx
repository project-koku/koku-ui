import { DashboardBase } from 'pages/view/dashboard/components/dashboardBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpDashboardSelectors } from 'store/dashboard/ocpDashboard';

import { OcpDashboardWidget } from './ocpDashboardWidget';

type OcpDashboardOwnProps = WithTranslation;

interface OcpDashboardStateProps {
  DashboardWidget: typeof OcpDashboardWidget;
  widgets: number[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OcpDashboardOwnProps, OcpDashboardStateProps>((state, props) => {
  return {
    DashboardWidget: OcpDashboardWidget,
    selectWidgets: ocpDashboardSelectors.selectWidgets(state),
    widgets: ocpDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpDashboard = withTranslation()(connect(mapStateToProps, {})(DashboardBase));

export default OcpDashboard;
