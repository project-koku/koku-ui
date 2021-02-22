import { DashboardBase } from 'pages/view/dashboard/components/dashboardBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { awsCloudDashboardSelectors } from 'store/dashboard/awsCloudDashboard';

import { AwsCloudDashboardWidget } from './awsCloudDashboardWidget';

type AwsCloudDashboardOwnProps = WithTranslation;

interface AwsCloudDashboardStateProps {
  DashboardWidget: typeof AwsCloudDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<AwsCloudDashboardOwnProps, AwsCloudDashboardStateProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (state, props) => {
    return {
      DashboardWidget: AwsCloudDashboardWidget,
      selectWidgets: awsCloudDashboardSelectors.selectWidgets(state),
      widgets: awsCloudDashboardSelectors.selectCurrentWidgets(state),
    };
  }
);

const AwsCloudDashboard = withTranslation()(connect(mapStateToProps, {})(DashboardBase));

export default AwsCloudDashboard;
