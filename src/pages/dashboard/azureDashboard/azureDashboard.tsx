import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { azureDashboardSelectors } from 'store/dashboard/azureDashboard';

import { AzureDashboardWidget } from './azureDashboardWidget';

type AzureDashboardOwnProps = InjectedTranslateProps;

interface AzureDashboardStateProps {
  DashboardWidget: typeof AzureDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<
  AzureDashboardOwnProps,
  AzureDashboardStateProps
>(state => {
  return {
    DashboardWidget: AzureDashboardWidget,
    selectWidgets: azureDashboardSelectors.selectWidgets(state),
    widgets: azureDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AzureDashboard = translate()(connect(mapStateToProps, {})(DashboardBase));

export default AzureDashboard;
