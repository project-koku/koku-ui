import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/dashboard/components/dashboardWidgetBase';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ocpUsageDashboardActions,
  ocpUsageDashboardSelectors,
  OcpUsageDashboardTab,
} from 'store/dashboard/ocpUsageDashboard';
import { ocpCloudReportsSelectors } from 'store/reports/ocpCloudReports';
import { ComputedOcpCloudReportItemsParams } from 'utils/computedReport/getComputedOcpCloudReportItems';

interface OcpUsageDashboardWidgetDispatchProps {
  fetchReports: typeof ocpUsageDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpUsageDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (
  tab: OcpUsageDashboardTab
): ComputedOcpCloudReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpUsageDashboardTab.clusters:
      return 'cluster';
    case OcpUsageDashboardTab.nodes:
      return 'node';
    case OcpUsageDashboardTab.projects:
      return 'project';
  }
};

const mapStateToProps = createMapStateToProps<
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = ocpUsageDashboardSelectors.selectWidget(state, widgetId);
  const queries = ocpUsageDashboardSelectors.selectWidgetQueries(
    state,
    widgetId
  );
  return {
    ...widget,
    getIdKeyForTab,
    appNavPath: 'ocp-usage',
    detailsPath: '/ocp-usage',
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: ocpCloudReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: ocpCloudReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
    previousReport: ocpCloudReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabsReport: ocpCloudReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    tabsReportFetchStatus: ocpCloudReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: OcpUsageDashboardWidgetDispatchProps = {
  fetchReports: ocpUsageDashboardActions.fetchWidgetReports,
  updateTab: ocpUsageDashboardActions.changeWidgetTab,
};

const OcpUsageDashboardWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase)
);

export { OcpUsageDashboardWidget };
