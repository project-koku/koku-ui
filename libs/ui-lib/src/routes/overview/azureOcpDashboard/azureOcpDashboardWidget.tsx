import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import {
  azureOcpDashboardActions,
  azureOcpDashboardSelectors,
  AzureOcpDashboardTab,
} from '../../../store/dashboard/azureOcpDashboard';
import { forecastSelectors } from '../../../store/forecasts';
import { reportSelectors } from '../../../store/reports';
import { getCurrency } from '../../../utils/sessionStorage';
import type { ComputedAzureReportItemsParams } from '../../utils/computedReport/getComputedAzureReportItems';
import type { DashboardWidgetOwnProps, DashboardWidgetStateProps } from '../components';
import { DashboardWidgetBase } from '../components';

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
      currency: getCurrency(),
      getIdKeyForTab,
      ...(widget.forecastPathsType &&
        widget.forecastType && {
          forecast: forecastSelectors.selectForecast(
            state,
            widget.forecastPathsType,
            widget.forecastType,
            queries.forecast
          ),
          forecastError: forecastSelectors.selectForecastError(
            state,
            widget.forecastPathsType,
            widget.forecastType,
            queries.forecast
          ),
          forecastFetchStatus: forecastSelectors.selectForecastFetchStatus(
            state,
            widget.forecastPathsType,
            widget.forecastType,
            queries.forecast
          ),
        }),
      ...(widget.reportPathsType &&
        widget.reportType && {
          currentReport: reportSelectors.selectReport(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.current
          ),
          currentReportError: reportSelectors.selectReportError(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.current
          ),
          currentReportFetchStatus: reportSelectors.selectReportFetchStatus(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.current
          ),
          previousReport: reportSelectors.selectReport(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.previous
          ),
          previousReportError: reportSelectors.selectReportError(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.previous
          ),
          previousReportFetchStatus: reportSelectors.selectReportFetchStatus(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.previous
          ),
          tabsReport: reportSelectors.selectReport(state, widget.reportPathsType, widget.reportType, queries.tabs),
          tabsReportError: reportSelectors.selectReportError(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.tabs
          ),
          tabsReportFetchStatus: reportSelectors.selectReportFetchStatus(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.tabs
          ),
        }),
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
