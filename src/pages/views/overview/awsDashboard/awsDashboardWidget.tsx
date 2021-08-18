import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/views/overview/components/dashboardWidgetBase';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { awsDashboardActions, awsDashboardSelectors, AwsDashboardTab } from 'store/dashboard/awsDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { ComputedAwsReportItemsParams } from 'utils/computedReport/getComputedAwsReportItems';

interface AwsDashboardWidgetDispatchProps {
  fetchForecasts: typeof awsDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof awsDashboardActions.fetchWidgetReports;
  updateTab: typeof awsDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: AwsDashboardTab): ComputedAwsReportItemsParams['idKey'] => {
  switch (tab) {
    case AwsDashboardTab.services:
      return 'service';
    case AwsDashboardTab.accounts:
      return 'account';
    case AwsDashboardTab.regions:
      return 'region';
    case AwsDashboardTab.instanceType:
      return 'instance_type';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = awsDashboardSelectors.selectWidget(state, widgetId);
    const queries = awsDashboardSelectors.selectWidgetQueries(state, widgetId);
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

const mapDispatchToProps: AwsDashboardWidgetDispatchProps = {
  fetchForecasts: awsDashboardActions.fetchWidgetForecasts,
  fetchReports: awsDashboardActions.fetchWidgetReports,
  updateTab: awsDashboardActions.changeWidgetTab,
};

const AwsDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { AwsDashboardWidget };
