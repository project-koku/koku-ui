import { DashboardBase } from 'pages/views/overview/components/dashboardBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { azureOcpDashboardSelectors } from 'store/dashboard/azureOcpDashboard';

import { AzureOcpDashboardWidget } from './azureOcpDashboardWidget';

type AzureOcpDashboardOwnProps = WithTranslation;

interface AzureOcpDashboardStateProps {
  DashboardWidget: typeof AzureOcpDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<AzureOcpDashboardOwnProps, AzureOcpDashboardStateProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (state, props) => {
    return {
      DashboardWidget: AzureOcpDashboardWidget,
      selectWidgets: azureOcpDashboardSelectors.selectWidgets(state),
      widgets: azureOcpDashboardSelectors.selectCurrentWidgets(state),
    };
  }
);

const AzureOcpDashboard = withTranslation()(connect(mapStateToProps, {})(DashboardBase));

export default AzureOcpDashboard;
