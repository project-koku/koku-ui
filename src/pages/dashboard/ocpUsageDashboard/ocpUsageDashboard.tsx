import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpUsageDashboardSelectors } from 'store/dashboard/ocpUsageDashboard';

import { OcpUsageDashboardWidget } from './ocpUsageDashboardWidget';

type OcpUsageDashboardOwnProps = InjectedTranslateProps;

interface OcpUsageDashboardStateProps {
  DashboardWidget: typeof OcpUsageDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<
  OcpUsageDashboardOwnProps,
  OcpUsageDashboardStateProps
>(state => {
  return {
    DashboardWidget: OcpUsageDashboardWidget,
    selectWidgets: ocpUsageDashboardSelectors.selectWidgets(state),
    widgets: ocpUsageDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpUsageDashboard = translate()(
  connect(mapStateToProps, {})(DashboardBase)
);

export default OcpUsageDashboard;
