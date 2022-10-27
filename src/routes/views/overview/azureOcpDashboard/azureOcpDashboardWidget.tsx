import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { DashboardWidgetOwnProps, DashboardWidgetStateProps } from 'routes/views/overview/components';
import { DashboardWidgetBase } from 'routes/views/overview/components';
import { createMapStateToProps } from 'store/common';
import {
  azureOcpDashboardActions,
  azureOcpDashboardSelectors,
  AzureOcpDashboardTab,
} from 'store/dashboard/azureOcpDashboard';
import { featureFlagsSelectors } from 'store/featureFlags';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import type { ComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';
import { getCurrency } from 'utils/currency';

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

const mapDispatchToProps: AzureOcpDashboardWidgetDispatchProps = {
  fetchForecasts: azureOcpDashboardActions.fetchWidgetForecasts,
  fetchReports: azureOcpDashboardActions.fetchWidgetReports,
  updateTab: azureOcpDashboardActions.changeWidgetTab,
};

const AzureOcpDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { AzureOcpDashboardWidget };
