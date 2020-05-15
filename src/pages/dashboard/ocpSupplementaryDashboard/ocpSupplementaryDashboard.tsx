import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpSupplementaryDashboardSelectors } from 'store/dashboard/ocpSupplementaryDashboard';
import { OcpSupplementaryDashboardWidget } from './ocpSupplementaryDashboardWidget';

type OcpSupplementaryDashboardOwnProps = WrappedComponentProps;

interface OcpSupplementaryDashboardStateProps {
  widgets: number[];
}
const mapStateToProps = createMapStateToProps<
  OcpSupplementaryDashboardOwnProps,
  OcpSupplementaryDashboardStateProps
>(state => {
  return {
    DashboardWidget: OcpSupplementaryDashboardWidget,
    selectWidgets: ocpSupplementaryDashboardSelectors.selectWidgets(state),
    widgets: ocpSupplementaryDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpSupplementaryDashboard = injectIntl(
  connect(mapStateToProps, {})(DashboardBase)
);

export default OcpSupplementaryDashboard;
