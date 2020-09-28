import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { awsCloudDashboardSelectors } from 'store/dashboard/awsCloudDashboard';

import { AwsCloudDashboardWidget } from './awsCloudDashboardWidget';

type AwsCloudDashboardOwnProps = InjectedTranslateProps;

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

const AwsCloudDashboard = translate()(connect(mapStateToProps, {})(DashboardBase));

export default AwsCloudDashboard;
