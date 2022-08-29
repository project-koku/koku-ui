import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'routes/views/overview/components/dashboardWidgetBase';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ocpSupplementaryDashboardActions,
  ocpSupplementaryDashboardSelectors,
  OcpSupplementaryDashboardTab,
} from 'store/dashboard/ocpSupplementaryDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { ComputedOcpReportItemsParams } from 'utils/computedReport/getComputedOcpReportItems';

interface OcpSupplementaryDashboardWidgetDispatchProps {
  fetchForecasts: typeof ocpSupplementaryDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof ocpSupplementaryDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpSupplementaryDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: OcpSupplementaryDashboardTab): ComputedOcpReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpSupplementaryDashboardTab.clusters:
      return 'cluster';
    case OcpSupplementaryDashboardTab.nodes:
      return 'node';
    case OcpSupplementaryDashboardTab.projects:
      return 'project';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = ocpSupplementaryDashboardSelectors.selectWidget(state, widgetId);
    const queries = ocpSupplementaryDashboardSelectors.selectWidgetQueries(state, widgetId);
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

const mapDispatchToProps: OcpSupplementaryDashboardWidgetDispatchProps = {
  fetchForecasts: ocpSupplementaryDashboardActions.fetchWidgetForecasts,
  fetchReports: ocpSupplementaryDashboardActions.fetchWidgetReports,
  updateTab: ocpSupplementaryDashboardActions.changeWidgetTab,
};

const OcpSupplementaryDashboardWidget = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase)
);

export { OcpSupplementaryDashboardWidget };
