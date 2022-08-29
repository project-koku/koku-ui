import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'routes/views/overview/components/dashboardWidgetBase';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ocpUsageDashboardActions,
  ocpUsageDashboardSelectors,
  OcpUsageDashboardTab,
} from 'store/dashboard/ocpUsageDashboard';
import { reportSelectors } from 'store/reports';
import { ComputedOcpCloudReportItemsParams } from 'utils/computedReport/getComputedOcpCloudReportItems';

interface OcpUsageDashboardWidgetDispatchProps {
  fetchReports: typeof ocpUsageDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpUsageDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: OcpUsageDashboardTab): ComputedOcpCloudReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpUsageDashboardTab.clusters:
      return 'cluster';
    case OcpUsageDashboardTab.nodes:
      return 'node';
    case OcpUsageDashboardTab.projects:
      return 'project';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = ocpUsageDashboardSelectors.selectWidget(state, widgetId);
    const queries = ocpUsageDashboardSelectors.selectWidgetQueries(state, widgetId);
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

const mapDispatchToProps: OcpUsageDashboardWidgetDispatchProps = {
  fetchReports: ocpUsageDashboardActions.fetchWidgetReports,
  updateTab: ocpUsageDashboardActions.changeWidgetTab,
};

const OcpUsageDashboardWidget = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase));

export { OcpUsageDashboardWidget };
