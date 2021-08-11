import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/views/overview/components/dashboardWidgetBase';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { awsOcpDashboardActions, awsOcpDashboardSelectors, AwsOcpDashboardTab } from 'store/dashboard/awsOcpDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { ComputedAwsReportItemsParams } from 'utils/computedReport/getComputedAwsReportItems';

interface AwsOcpDashboardWidgetDispatchProps {
  fetchForecasts: typeof awsOcpDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof awsOcpDashboardActions.fetchWidgetReports;
  updateTab: typeof awsOcpDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: AwsOcpDashboardTab): ComputedAwsReportItemsParams['idKey'] => {
  switch (tab) {
    case AwsOcpDashboardTab.services:
      return 'service';
    case AwsOcpDashboardTab.accounts:
      return 'account';
    case AwsOcpDashboardTab.regions:
      return 'region';
    case AwsOcpDashboardTab.instanceType:
      return 'instance_type';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = awsOcpDashboardSelectors.selectWidget(state, widgetId);
    const queries = awsOcpDashboardSelectors.selectWidgetQueries(state, widgetId);
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

const mapDispatchToProps: AwsOcpDashboardWidgetDispatchProps = {
  fetchForecasts: awsOcpDashboardActions.fetchWidgetForecasts,
  fetchReports: awsOcpDashboardActions.fetchWidgetReports,
  updateTab: awsOcpDashboardActions.changeWidgetTab,
};

const AwsOcpDashboardWidget = connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase);

export { AwsOcpDashboardWidget };
