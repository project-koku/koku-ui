import { DashboardBase } from 'routes/views/overview/components/dashboardBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpUsageDashboardSelectors } from 'store/dashboard/ocpUsageDashboard';

import { OcpUsageDashboardWidget } from './ocpUsageDashboardWidget';

type OcpUsageDashboardOwnProps = WithTranslation;

interface OcpUsageDashboardStateProps {
  DashboardWidget: typeof OcpUsageDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<OcpUsageDashboardOwnProps, OcpUsageDashboardStateProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (state, props) => {
    return {
      DashboardWidget: OcpUsageDashboardWidget,
      selectWidgets: ocpUsageDashboardSelectors.selectWidgets(state),
      widgets: ocpUsageDashboardSelectors.selectCurrentWidgets(state),
    };
  }
);

const OcpUsageDashboard = withTranslation()(connect(mapStateToProps, {})(DashboardBase));

export default OcpUsageDashboard;
