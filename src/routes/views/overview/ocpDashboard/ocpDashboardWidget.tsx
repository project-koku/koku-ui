import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { DashboardWidgetOwnProps, DashboardWidgetStateProps } from 'routes/views/overview/components';
import { DashboardWidgetBase } from 'routes/views/overview/components';
import { createMapStateToProps } from 'store/common';
import { ocpDashboardActions, ocpDashboardSelectors, OcpDashboardTab } from 'store/dashboard/ocpDashboard';
import { featureFlagsSelectors } from 'store/featureFlags';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { rosSelectors } from 'store/ros';
import type { ComputedOcpReportItemsParams } from 'utils/computedReport/getComputedOcpReportItems';
import { getCurrency } from 'utils/localStorage';

import { chartStyles } from './ocpDashboardWidget.styles';

interface OcpDashboardWidgetDispatchProps {
  fetchForecasts: typeof ocpDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof ocpDashboardActions.fetchWidgetReports;
  fetchRosReports: typeof ocpDashboardActions.fetchWidgetRosReports;
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
      currency: getCurrency(),
      getIdKeyForTab,
      chartAltHeight: chartStyles.chartAltHeight,
      containerAltHeight: chartStyles.containerAltHeight,
      currentQuery: queries.current,
      forecastQuery: queries.forecast,
      previousQuery: queries.previous,
      tabsQuery: queries.tabs,
      ...(widget.forecastPathsType &&
        widget.forecastType && {
          forecast: forecastSelectors.selectForecast(
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
          previousReportFetchStatus: reportSelectors.selectReportFetchStatus(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.previous
          ),
          tabsReport: reportSelectors.selectReport(state, widget.reportPathsType, widget.reportType, queries.tabs),
          tabsReportFetchStatus: reportSelectors.selectReportFetchStatus(
            state,
            widget.reportPathsType,
            widget.reportType,
            queries.tabs
          ),
        }),
      ...(widget.rosPathsType &&
        widget.rosType && {
          isRosFeatureEnabled: featureFlagsSelectors.selectIsRosFeatureEnabled(state),
          rosReport: rosSelectors.selectRos(state, widget.rosPathsType, widget.rosType, queries.recommendations),
          rosReportFetchStatus: rosSelectors.selectRosFetchStatus(
            state,
            widget.rosPathsType,
            widget.rosType,
            queries.recommendations
          ),
        }),
    };
  }
);

const mapDispatchToProps: OcpDashboardWidgetDispatchProps = {
  fetchForecasts: ocpDashboardActions.fetchWidgetForecasts,
  fetchReports: ocpDashboardActions.fetchWidgetReports,
  fetchRosReports: ocpDashboardActions.fetchWidgetRosReports,
  updateTab: ocpDashboardActions.changeWidgetTab,
};

const OcpDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { OcpDashboardWidget };
