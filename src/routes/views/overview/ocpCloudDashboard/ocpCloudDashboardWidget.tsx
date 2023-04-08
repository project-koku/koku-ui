import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { DashboardWidgetOwnProps, DashboardWidgetStateProps } from 'routes/views/overview/components';
import { DashboardWidgetBase } from 'routes/views/overview/components';
import { createMapStateToProps } from 'store/common';
import {
  ocpCloudDashboardActions,
  ocpCloudDashboardSelectors,
  OcpCloudDashboardTab,
} from 'store/dashboard/ocpCloudDashboard';
import { forecastSelectors } from 'store/forecasts';
import { reportSelectors } from 'store/reports';
import type { ComputedOcpCloudReportItemsParams } from 'utils/computedReport/getComputedOcpCloudReportItems';
import { getCurrency } from 'utils/localStorage';

interface OcpCloudDashboardWidgetDispatchProps {
  fetchForecasts: typeof ocpCloudDashboardActions.fetchWidgetForecasts;
  fetchReports: typeof ocpCloudDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpCloudDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: OcpCloudDashboardTab): ComputedOcpCloudReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpCloudDashboardTab.accounts:
      return 'account';
    case OcpCloudDashboardTab.regions:
      return 'region';
    case OcpCloudDashboardTab.services:
      return 'service';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = ocpCloudDashboardSelectors.selectWidget(state, widgetId);
    const queries = ocpCloudDashboardSelectors.selectWidgetQueries(state, widgetId);
    return {
      ...widget,
      currency: getCurrency(),
      getIdKeyForTab,
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

const mapDispatchToProps: OcpCloudDashboardWidgetDispatchProps = {
  fetchForecasts: ocpCloudDashboardActions.fetchWidgetForecasts,
  fetchReports: ocpCloudDashboardActions.fetchWidgetReports,
  updateTab: ocpCloudDashboardActions.changeWidgetTab,
};

const OcpCloudDashboardWidget = injectIntl(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { OcpCloudDashboardWidget };
