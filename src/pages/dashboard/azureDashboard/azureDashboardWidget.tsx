import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/dashboard/components/dashboardWidgetBase';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  azureDashboardActions,
  azureDashboardSelectors,
  AzureDashboardTab,
} from 'store/dashboard/azureDashboard';
import { azureReportsSelectors } from 'store/reports/azureReports';
import { ComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';

interface AzureDashboardWidgetDispatchProps {
  fetchReports: typeof azureDashboardActions.fetchWidgetReports;
  updateTab: typeof azureDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (
  tab: AzureDashboardTab
): ComputedAzureReportItemsParams['idKey'] => {
  switch (tab) {
    case AzureDashboardTab.service_names:
      return 'service_name';
    case AzureDashboardTab.subscription_guids:
      return 'subscription_guid';
    case AzureDashboardTab.resource_locations:
      return 'resource_location';
    case AzureDashboardTab.instanceType:
      return 'instance_type';
  }
};

const mapStateToProps = createMapStateToProps<
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = azureDashboardSelectors.selectWidget(state, widgetId);
  const queries = azureDashboardSelectors.selectWidgetQueries(state, widgetId);
  return {
    ...widget,
    getIdKeyForTab,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: azureReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: azureReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
    previousReport: azureReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabsReport: azureReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    tabsReportFetchStatus: azureReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: AzureDashboardWidgetDispatchProps = {
  fetchReports: azureDashboardActions.fetchWidgetReports,
  updateTab: azureDashboardActions.changeWidgetTab,
};

const AzureDashboardWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase)
);

export { AzureDashboardWidget };
