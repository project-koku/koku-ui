import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/views/overview/components/dashboardWidgetBase';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ociDashboardActions, ociDashboardSelectors, OciDashboardTab } from 'store/dashboard/ociDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import { ComputedOciReportItemsParams } from 'utils/computedReport/getComputedOciReportItems';

interface OciDashboardWidgetDispatchProps {
  fetchForecasts: typeof ociDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof ociDashboardActions.fetchWidgetReports;
  updateTab: typeof ociDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: OciDashboardTab): ComputedOciReportItemsParams['idKey'] => {
  switch (tab) {
    case OciDashboardTab.product_services:
      return 'product_service';
    case OciDashboardTab.payer_tenant_ids:
      return 'payer_tenant_id';
    case OciDashboardTab.regions:
      return 'region';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = ociDashboardSelectors.selectWidget(state, widgetId);
    const queries = ociDashboardSelectors.selectWidgetQueries(state, widgetId);
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

const mapDispatchToProps: OciDashboardWidgetDispatchProps = {
  fetchForecasts: ociDashboardActions.fetchWidgetForecasts,
  fetchReports: ociDashboardActions.fetchWidgetReports,
  updateTab: ociDashboardActions.changeWidgetTab,
};

const OciDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { OciDashboardWidget };
