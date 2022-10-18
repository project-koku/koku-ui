import { DashboardBase } from 'routes/views/overview/components/dashboardBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpSupplementaryDashboardSelectors } from 'store/dashboard/ocpSupplementaryDashboard';

import { OcpInfrastructureDashboardWidget } from './ocpInfrastructureDashboardWidget';

type OcpSupplementaryDashboardOwnProps = WithTranslation;

interface OcpSupplementaryDashboardStateProps {
  DashboardWidget: typeof OcpInfrastructureDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<OcpSupplementaryDashboardOwnProps, OcpSupplementaryDashboardStateProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (state, props) => {
    return {
      DashboardWidget: OcpInfrastructureDashboardWidget,
      selectWidgets: ocpSupplementaryDashboardSelectors.selectWidgets(state),
      widgets: ocpSupplementaryDashboardSelectors.selectCurrentWidgets(state),
    };
  }
);

const OcpInfrastructureDashboard = withTranslation()(connect(mapStateToProps, {})(DashboardBase));

export default OcpInfrastructureDashboard;
