import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'routes/views/overview/components/dashboardWidgetBase';
import { createMapStateToProps } from 'store/common';
import {
  azureOcpDashboardActions,
  azureOcpDashboardSelectors,
  AzureOcpDashboardTab,
} from 'store/dashboard/azureOcpDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { ComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';

interface AzureOcpDashboardWidgetDispatchProps {
  fetchForecasts: typeof azureOcpDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof azureOcpDashboardActions.fetchWidgetReports;
  updateTab: typeof azureOcpDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: AzureOcpDashboardTab): ComputedAzureReportItemsParams['idKey'] => {
  switch (tab) {
    case AzureOcpDashboardTab.service_names:
      return 'service_name';
    case AzureOcpDashboardTab.subscription_guids:
      return 'subscription_guid';
    case AzureOcpDashboardTab.resource_locations:
      return 'resource_location';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = azureOcpDashboardSelectors.selectWidget(state, widgetId);
    const queries = azureOcpDashboardSelectors.selectWidgetQueries(state, widgetId);
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

const mapDispatchToProps: AzureOcpDashboardWidgetDispatchProps = {
  fetchForecasts: azureOcpDashboardActions.fetchWidgetForecasts,
  fetchReports: azureOcpDashboardActions.fetchWidgetReports,
  updateTab: azureOcpDashboardActions.changeWidgetTab,
};

const AzureOcpDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { AzureOcpDashboardWidget };
