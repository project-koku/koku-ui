import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'routes/views/overview/components/dashboardWidgetBase';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ibmDashboardActions, ibmDashboardSelectors, IbmDashboardTab } from 'store/dashboard/ibmDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { ComputedIbmReportItemsParams } from 'utils/computedReport/getComputedIbmReportItems';

interface IbmDashboardWidgetDispatchProps {
  fetchForecasts: typeof ibmDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof ibmDashboardActions.fetchWidgetReports;
  updateTab: typeof ibmDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: IbmDashboardTab): ComputedIbmReportItemsParams['idKey'] => {
  switch (tab) {
    case IbmDashboardTab.services:
      return 'service';
    case IbmDashboardTab.projects:
      return 'project';
    case IbmDashboardTab.regions:
      return 'region';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = ibmDashboardSelectors.selectWidget(state, widgetId);
    const queries = ibmDashboardSelectors.selectWidgetQueries(state, widgetId);
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

const mapDispatchToProps: IbmDashboardWidgetDispatchProps = {
  fetchForecasts: ibmDashboardActions.fetchWidgetForecasts,
  fetchReports: ibmDashboardActions.fetchWidgetReports,
  updateTab: ibmDashboardActions.changeWidgetTab,
};

const IbmDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { IbmDashboardWidget };
