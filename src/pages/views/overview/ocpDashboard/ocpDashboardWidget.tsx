import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/views/overview/components/dashboardWidgetBase';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpDashboardActions, ocpDashboardSelectors, OcpDashboardTab } from 'store/dashboard/ocpDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { ComputedOcpReportItemsParams } from 'utils/computedReport/getComputedOcpReportItems';

import { chartStyles } from './ocpDashboardWidget.styles';

interface OcpDashboardWidgetDispatchProps {
  fetchForecasts: typeof ocpDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof ocpDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: OcpDashboardTab): ComputedOcpReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpDashboardTab.clusters:
      return 'cluster';
    case OcpDashboardTab.nodes:
      return 'node';
    case OcpDashboardTab.projects:
      return 'project';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = ocpDashboardSelectors.selectWidget(state, widgetId);
    const queries = ocpDashboardSelectors.selectWidgetQueries(state, widgetId);
    return {
      ...widget,
      getIdKeyForTab,
      chartAltHeight: chartStyles.chartAltHeight,
      containerAltHeight: chartStyles.containerAltHeight,
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

const mapDispatchToProps: OcpDashboardWidgetDispatchProps = {
  fetchForecasts: ocpDashboardActions.fetchWidgetForecasts,
  fetchReports: ocpDashboardActions.fetchWidgetReports,
  updateTab: ocpDashboardActions.changeWidgetTab,
};

const OcpDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { OcpDashboardWidget };
