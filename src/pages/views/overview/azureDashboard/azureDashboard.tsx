import { DashboardBase } from 'pages/views/overview/components/dashboardBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { azureDashboardSelectors } from 'store/dashboard/azureDashboard';

import { AzureDashboardWidget } from './azureDashboardWidget';

type AzureDashboardOwnProps = WithTranslation;

interface AzureDashboardStateProps {
  DashboardWidget: typeof AzureDashboardWidget;
  widgets: number[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AzureDashboardOwnProps, AzureDashboardStateProps>((state, props) => {
  return {
    DashboardWidget: AzureDashboardWidget,
    selectWidgets: azureDashboardSelectors.selectWidgets(state),
    widgets: azureDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AzureDashboard = withTranslation()(connect(mapStateToProps, {})(DashboardBase));

export default AzureDashboard;
