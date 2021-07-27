import { DashboardBase } from 'pages/views/overview/components/dashboardBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { awsOcpDashboardSelectors } from 'store/dashboard/awsOcpDashboard';

import { AwsOcpDashboardWidget } from './awsOcpDashboardWidget';

type AwsOcpDashboardOwnProps = WithTranslation;

interface AwsOcpDashboardStateProps {
  DashboardWidget: typeof AwsOcpDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<AwsOcpDashboardOwnProps, AwsOcpDashboardStateProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (state, props) => {
    return {
      DashboardWidget: AwsOcpDashboardWidget,
      selectWidgets: awsOcpDashboardSelectors.selectWidgets(state),
      widgets: awsOcpDashboardSelectors.selectCurrentWidgets(state),
    };
  }
);

const AwsOcpDashboard = withTranslation()(connect(mapStateToProps, {})(DashboardBase));

export default AwsOcpDashboard;
