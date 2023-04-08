import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { DashboardWidgetOwnProps, DashboardWidgetStateProps } from 'routes/views/overview/components';
import { DashboardWidgetBase } from 'routes/views/overview/components';
import { createMapStateToProps } from 'store/common';
import { rhelDashboardActions, rhelDashboardSelectors, RhelDashboardTab } from 'store/dashboard/rhelDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import type { ComputedRhelReportItemsParams } from 'utils/computedReport/getComputedRhelReportItems';
import { getCurrency } from 'utils/localStorage';

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

const mapDispatchToProps: RhelDashboardWidgetDispatchProps = {
  fetchForecasts: rhelDashboardActions.fetchWidgetForecasts,
  fetchReports: rhelDashboardActions.fetchWidgetReports,
  updateTab: rhelDashboardActions.changeWidgetTab,
};

const RhelDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { RhelDashboardWidget };
