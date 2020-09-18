import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { azureCloudDashboardSelectors } from 'store/dashboard/azureCloudDashboard';

import { AzureCloudDashboardWidget } from './azureCloudDashboardWidget';

type AzureCloudDashboardOwnProps = WithTranslation;

interface AzureCloudDashboardStateProps {
  DashboardWidget: typeof AzureCloudDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<AzureCloudDashboardOwnProps, AzureCloudDashboardStateProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (state, props) => {
    return {
      DashboardWidget: AzureCloudDashboardWidget,
      selectWidgets: azureCloudDashboardSelectors.selectWidgets(state),
      widgets: azureCloudDashboardSelectors.selectCurrentWidgets(state),
    };
  }
);

const AzureCloudDashboard = withTranslation()(connect(mapStateToProps, {})(DashboardBase));

export default AzureCloudDashboard;
