import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpDashboardSelectors } from 'store/ocpDashboard';
import { OcpDashboardWidget } from './ocpDashboardWidget';

type OcpDashboardOwnProps = InjectedTranslateProps;

interface OcpDashboardStateProps {
  DashboardWidget: typeof OcpDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<
  OcpDashboardOwnProps,
  OcpDashboardStateProps
>(state => {
  return {
    DashboardWidget: OcpDashboardWidget,
    selectWidgets: ocpDashboardSelectors.selectWidgets(state),
    widgets: ocpDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpDashboard = translate()(connect(mapStateToProps, {})(DashboardBase));

export default OcpDashboard;
