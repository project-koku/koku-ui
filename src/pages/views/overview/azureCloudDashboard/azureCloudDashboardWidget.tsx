import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/views/overview/components/dashboardWidgetBase';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  azureCloudDashboardActions,
  azureCloudDashboardSelectors,
  AzureCloudDashboardTab,
} from 'store/dashboard/azureCloudDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { ComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';

interface AzureCloudDashboardWidgetDispatchProps {
  fetchForecasts: typeof azureCloudDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof azureCloudDashboardActions.fetchWidgetReports;
  updateTab: typeof azureCloudDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: AzureCloudDashboardTab): ComputedAzureReportItemsParams['idKey'] => {
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

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = azureCloudDashboardSelectors.selectWidget(state, widgetId);
    const queries = azureCloudDashboardSelectors.selectWidgetQueries(state, widgetId);
    return {
      ...widget,
      getIdKeyForTab,
      currentQuery: queries.current,
      forecastQuery: queries.forecast,
      previousQuery: queries.previous,
      tabsQuery: queries.tabs,
      currentReport: reportSelectors.selectReport(state, widget.reportPathsType, widget.reportType, queries.current),
      currentReportFetchStatus: reportSelectors.selectReportFetchStatus(
        state,
        widget.reportPathsType,
        widget.reportType,
        queries.current
      ),
      forecast: forecastSelectors.selectForecast(
        state,
        widget.forecastPathsType,
        widget.forecastType,
        queries.forecast
      ),
      previousReport: reportSelectors.selectReport(state, widget.reportPathsType, widget.reportType, queries.previous),
      tabsReport: reportSelectors.selectReport(state, widget.reportPathsType, widget.reportType, queries.tabs),
      tabsReportFetchStatus: reportSelectors.selectReportFetchStatus(
        state,
        widget.reportPathsType,
        widget.reportType,
        queries.tabs
      ),
    };
  }
);

const mapDispatchToProps: AzureCloudDashboardWidgetDispatchProps = {
  fetchForecasts: azureCloudDashboardActions.fetchWidgetForecasts,
  fetchReports: azureCloudDashboardActions.fetchWidgetReports,
  updateTab: azureCloudDashboardActions.changeWidgetTab,
};

const AzureCloudDashboardWidget = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { AzureCloudDashboardWidget };
