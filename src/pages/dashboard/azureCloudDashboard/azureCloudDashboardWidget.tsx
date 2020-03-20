import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/dashboard/components/dashboardWidgetBase';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  azureCloudDashboardActions,
  azureCloudDashboardSelectors,
  AzureCloudDashboardTab,
} from 'store/dashboard/azureCloudDashboard';
import { azureReportsSelectors } from 'store/reports/azureReports';
import { ComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';

interface AzureCloudDashboardWidgetDispatchProps {
  fetchReports: typeof azureCloudDashboardActions.fetchWidgetReports;
  updateTab: typeof azureCloudDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (
  tab: AzureCloudDashboardTab
): ComputedAzureReportItemsParams['idKey'] => {
  switch (tab) {
    case AzureCloudDashboardTab.service_names:
      return 'service_name';
    case AzureCloudDashboardTab.subscription_guids:
      return 'subscription_guid';
    case AzureCloudDashboardTab.resource_locations:
      return 'resource_location';
    case AzureCloudDashboardTab.instanceType:
      return 'instance_type';
  }
};

const mapStateToProps = createMapStateToProps<
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = azureCloudDashboardSelectors.selectWidget(state, widgetId);
  const queries = azureCloudDashboardSelectors.selectWidgetQueries(
    state,
    widgetId
  );
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

const mapDispatchToProps: AzureCloudDashboardWidgetDispatchProps = {
  fetchReports: azureCloudDashboardActions.fetchWidgetReports,
  updateTab: azureCloudDashboardActions.changeWidgetTab,
};

const AzureCloudDashboardWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase)
);

export { AzureCloudDashboardWidget };
