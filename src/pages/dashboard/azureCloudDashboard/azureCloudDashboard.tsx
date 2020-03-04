import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { azureCloudDashboardSelectors } from 'store/azureCloudDashboard';
import { createMapStateToProps } from 'store/common';
import { AzureCloudDashboardWidget } from './azureCloudDashboardWidget';

type AzureCloudDashboardOwnProps = InjectedTranslateProps;

interface AzureCloudDashboardStateProps {
  DashboardWidget: typeof AzureCloudDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<
  AzureCloudDashboardOwnProps,
  AzureCloudDashboardStateProps
>(state => {
  return {
    DashboardWidget: AzureCloudDashboardWidget,
    selectWidgets: azureCloudDashboardSelectors.selectWidgets(state),
    widgets: azureCloudDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AzureCloudDashboard = translate()(
  connect(mapStateToProps, {})(DashboardBase)
);

export default AzureCloudDashboard;
