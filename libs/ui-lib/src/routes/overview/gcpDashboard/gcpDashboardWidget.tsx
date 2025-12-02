import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { gcpDashboardActions, gcpDashboardSelectors, GcpDashboardTab } from '../../../store/dashboard/gcpDashboard';
import { forecastSelectors } from '../../../store/forecasts';
import { reportSelectors } from '../../../store/reports';
import { getCurrency } from '../../../utils/sessionStorage';
import type { ComputedGcpReportItemsParams } from '../../utils/computedReport/getComputedGcpReportItems';
import type { DashboardWidgetOwnProps, DashboardWidgetStateProps } from '../components';
import { DashboardWidgetBase } from '../components';

interface GcpDashboardWidgetDispatchProps {
  fetchForecasts: typeof gcpDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof gcpDashboardActions.fetchWidgetReports;
  updateTab: typeof gcpDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: GcpDashboardTab): ComputedGcpReportItemsParams['idKey'] => {
  switch (tab) {
    case GcpDashboardTab.gcpProjects:
      return 'gcp_project';
    case GcpDashboardTab.regions:
      return 'region';
    case GcpDashboardTab.services:
      return 'service';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = gcpDashboardSelectors.selectWidget(state, widgetId);
    const queries = gcpDashboardSelectors.selectWidgetQueries(state, widgetId);
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

const mapDispatchToProps: GcpDashboardWidgetDispatchProps = {
  fetchForecasts: gcpDashboardActions.fetchWidgetForecasts,
  fetchReports: gcpDashboardActions.fetchWidgetReports,
  updateTab: gcpDashboardActions.changeWidgetTab,
};

const GcpDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { GcpDashboardWidget };
