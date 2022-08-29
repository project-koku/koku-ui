import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'routes/views/overview/components/dashboardWidgetBase';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { gcpDashboardActions, gcpDashboardSelectors, GcpDashboardTab } from 'store/dashboard/gcpDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { ComputedGcpReportItemsParams } from 'utils/computedReport/getComputedGcpReportItems';

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
      getIdKeyForTab,
      currentQuery: queries.current,
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

const mapDispatchToProps: GcpDashboardWidgetDispatchProps = {
  fetchForecasts: gcpDashboardActions.fetchWidgetForecasts,
  fetchReports: gcpDashboardActions.fetchWidgetReports,
  updateTab: gcpDashboardActions.changeWidgetTab,
};

const GcpDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { GcpDashboardWidget };
