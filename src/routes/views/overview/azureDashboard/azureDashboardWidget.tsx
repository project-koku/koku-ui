import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'routes/views/overview/components/dashboardWidgetBase';
import { createMapStateToProps } from 'store/common';
import { azureDashboardActions, azureDashboardSelectors, AzureDashboardTab } from 'store/dashboard/azureDashboard';
import { featureFlagsSelectors } from 'store/featureFlags';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { ComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';
import { getCurrency } from 'utils/currency';

interface AzureDashboardWidgetDispatchProps {
  fetchForecasts: typeof azureDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof azureDashboardActions.fetchWidgetReports;
  updateTab: typeof azureDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: AzureDashboardTab): ComputedAzureReportItemsParams['idKey'] => {
  switch (tab) {
    case AzureDashboardTab.service_names:
      return 'service_name';
    case AzureDashboardTab.subscription_guids:
      return 'subscription_guid';
    case AzureDashboardTab.resource_locations:
      return 'resource_location';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = azureDashboardSelectors.selectWidget(state, widgetId);
    const queries = azureDashboardSelectors.selectWidgetQueries(state, widgetId);
    return {
      ...widget,
      ...(featureFlagsSelectors.selectIsCurrencyFeatureEnabled(state) && { currency: getCurrency() }),
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

const mapDispatchToProps: AzureDashboardWidgetDispatchProps = {
  fetchForecasts: azureDashboardActions.fetchWidgetForecasts,
  fetchReports: azureDashboardActions.fetchWidgetReports,
  updateTab: azureDashboardActions.changeWidgetTab,
};

const AzureDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { AzureDashboardWidget };
