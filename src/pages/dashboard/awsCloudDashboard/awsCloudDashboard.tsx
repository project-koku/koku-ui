import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { awsCloudDashboardSelectors } from 'store/dashboard/awsCloudDashboard';
import { AwsCloudDashboardWidget } from './awsCloudDashboardWidget';

type AwsCloudDashboardOwnProps = WrappedComponentProps;

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

const AwsCloudDashboard = injectIntl(
  connect(mapStateToProps, {})(DashboardBase)
);

export default AwsCloudDashboard;
