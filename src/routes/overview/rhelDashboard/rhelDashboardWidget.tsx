import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { DashboardWidgetOwnProps, DashboardWidgetStateProps } from 'routes/overview/components';
import { DashboardWidgetBase } from 'routes/overview/components';
import type { ComputedRhelReportItemsParams } from 'routes/utils/computedReport/getComputedRhelReportItems';
import { createMapStateToProps } from 'store/common';
import { rhelDashboardActions, rhelDashboardSelectors, RhelDashboardTab } from 'store/dashboard/rhelDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { getCurrency } from 'utils/sessionStorage';

import { chartStyles } from './rhelDashboardWidget.styles';

interface RhelDashboardWidgetDispatchProps {
  fetchForecasts: typeof rhelDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof rhelDashboardActions.fetchWidgetReports;
  updateTab: typeof rhelDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: RhelDashboardTab): ComputedRhelReportItemsParams['idKey'] => {
  switch (tab) {
    case RhelDashboardTab.clusters:
      return 'cluster';
    case RhelDashboardTab.nodes:
      return 'node';
    case RhelDashboardTab.projects:
      return 'project';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = rhelDashboardSelectors.selectWidget(state, widgetId);
    const queries = rhelDashboardSelectors.selectWidgetQueries(state, widgetId);
    return {
      ...widget,
      currency: getCurrency(),
      getIdKeyForTab,
      chartAltHeight: chartStyles.chartAltHeight,
      containerAltHeight: chartStyles.containerAltHeight,
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

const mapDispatchToProps: RhelDashboardWidgetDispatchProps = {
  fetchForecasts: rhelDashboardActions.fetchWidgetForecasts,
  fetchReports: rhelDashboardActions.fetchWidgetReports,
  updateTab: rhelDashboardActions.changeWidgetTab,
};

const RhelDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { RhelDashboardWidget };
