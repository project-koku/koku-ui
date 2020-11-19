import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpSupplementaryDashboardSelectors } from 'store/dashboard/ocpSupplementaryDashboard';

import { OcpSupplementaryDashboardWidget } from './ocpSupplementaryDashboardWidget';

type OcpSupplementaryDashboardOwnProps = WithTranslation;

interface OcpSupplementaryDashboardStateProps {
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<OcpSupplementaryDashboardOwnProps, OcpSupplementaryDashboardStateProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (state, props) => {
    return {
      DashboardWidget: OcpSupplementaryDashboardWidget,
      selectWidgets: ocpSupplementaryDashboardSelectors.selectWidgets(state),
      widgets: ocpSupplementaryDashboardSelectors.selectCurrentWidgets(state),
    };
  }
);

const OcpSupplementaryDashboard = withTranslation()(connect(mapStateToProps, {})(DashboardBase));

export default OcpSupplementaryDashboard;
