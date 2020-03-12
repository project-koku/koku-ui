import { OcpCloudReport } from 'api/reports/ocpCloudReports';
import { DashboardWidgetBase } from 'pages/dashboard/components/dashboardWidgetBase';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ocpCloudDashboardActions,
  ocpCloudDashboardSelectors,
  OcpCloudDashboardTab,
  OcpCloudDashboardWidget as OcpCloudDashboardWidgetStatic,
} from 'store/dashboard/ocpCloudDashboard';
import { ocpCloudReportsSelectors } from 'store/reports/ocpCloudReports';
import { ComputedOcpCloudReportItemsParams } from 'utils/computedReport/getComputedOcpCloudReportItems';

interface OcpCloudDashboardWidgetOwnProps {
  appNavPath: string;
  detailsPath: string;
  getIdKeyForTab: (tab: OcpCloudDashboardTab) => string;
  widgetId: number;
}

interface OcpCloudDashboardWidgetStateProps
  extends OcpCloudDashboardWidgetStatic {
  currentQuery: string;
  currentReport: OcpCloudReport;
  currentReportFetchStatus: number;
  previousQuery: string;
  previousReport: OcpCloudReport;
  tabsQuery: string;
  tabsReport: OcpCloudReport;
  tabsReportFetchStatus: number;
}

interface OcpCloudDashboardWidgetDispatchProps {
  fetchReports: typeof ocpCloudDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpCloudDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (
  tab: OcpCloudDashboardTab
): ComputedOcpCloudReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpCloudDashboardTab.clusters:
      return 'cluster';
    case OcpCloudDashboardTab.nodes:
      return 'node';
    case OcpCloudDashboardTab.projects:
      return 'project';
  }
};

const mapStateToProps = createMapStateToProps<
  OcpCloudDashboardWidgetOwnProps,
  OcpCloudDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = ocpCloudDashboardSelectors.selectWidget(state, widgetId);
  const queries = ocpCloudDashboardSelectors.selectWidgetQueries(
    state,
    widgetId
  );
  return {
    ...widget,
    getIdKeyForTab,
    appNavPath: 'ocp-cloud',
    detailsPath: '/ocp-cloud',
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

const mapDispatchToProps: OcpCloudDashboardWidgetDispatchProps = {
  fetchReports: ocpCloudDashboardActions.fetchWidgetReports,
  updateTab: ocpCloudDashboardActions.changeWidgetTab,
};

const OcpCloudDashboardWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase)
);

export { OcpCloudDashboardWidget };
