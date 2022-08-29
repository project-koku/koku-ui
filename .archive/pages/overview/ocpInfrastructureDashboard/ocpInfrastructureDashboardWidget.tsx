import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'routes/views/overview/components/dashboardWidgetBase';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ocpInfrastructureDashboardActions,
  ocpInfrastructureDashboardSelectors,
  OcpInfrastructureDashboardTab,
} from 'store/dashboard/ocpInfrastructureDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { ComputedOcpReportItemsParams } from 'utils/computedReport/getComputedOcpReportItems';

interface OcpInfrastructureDashboardWidgetDispatchProps {
  fetchForecasts: typeof ocpInfrastructureDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof ocpInfrastructureDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpInfrastructureDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: OcpInfrastructureDashboardTab): ComputedOcpReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpInfrastructureDashboardTab.clusters:
      return 'cluster';
    case OcpInfrastructureDashboardTab.nodes:
      return 'node';
    case OcpInfrastructureDashboardTab.projects:
      return 'project';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = ocpInfrastructureDashboardSelectors.selectWidget(state, widgetId);
    const queries = ocpInfrastructureDashboardSelectors.selectWidgetQueries(state, widgetId);
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

const mapDispatchToProps: OcpInfrastructureDashboardWidgetDispatchProps = {
  fetchForecasts: ocpInfrastructureDashboardActions.fetchWidgetForecasts,
  fetchReports: ocpInfrastructureDashboardActions.fetchWidgetReports,
  updateTab: ocpInfrastructureDashboardActions.changeWidgetTab,
};

const OcpInfrastructureDashboardWidget = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase)
);

export { OcpInfrastructureDashboardWidget };
