import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsCloudDashboardSelectors } from 'store/awsCloudDashboard';
import { createMapStateToProps } from 'store/common';
import { AwsCloudDashboardWidget } from './awsCloudDashboardWidget';

type AwsCloudDashboardOwnProps = InjectedTranslateProps;

interface AwsCloudDashboardStateProps {
  DashboardWidget: typeof AwsCloudDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<
  AwsCloudDashboardOwnProps,
  AwsCloudDashboardStateProps
>(state => {
  return {
    DashboardWidget: AwsCloudDashboardWidget,
    selectWidgets: awsCloudDashboardSelectors.selectWidgets(state),
    widgets: awsCloudDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AwsCloudDashboard = translate()(
  connect(mapStateToProps, {})(DashboardBase)
);

export default AwsCloudDashboard;
