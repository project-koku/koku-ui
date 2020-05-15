import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpDashboardSelectors } from 'store/dashboard/ocpDashboard';
import { OcpDashboardWidget } from './ocpDashboardWidget';

type OcpDashboardOwnProps = WrappedComponentProps;

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

const OcpDashboard = injectIntl(connect(mapStateToProps, {})(DashboardBase));

export default OcpDashboard;
