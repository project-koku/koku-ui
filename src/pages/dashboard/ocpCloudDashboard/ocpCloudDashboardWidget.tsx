import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/dashboard/components/dashboardWidgetBase';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ocpCloudDashboardActions,
  ocpCloudDashboardSelectors,
  OcpCloudDashboardTab,
} from 'store/dashboard/ocpCloudDashboard';
import { ocpCloudReportsSelectors } from 'store/reports/ocpCloudReports';
import { ComputedOcpCloudReportItemsParams } from 'utils/computedReport/getComputedOcpCloudReportItems';

interface OcpCloudDashboardWidgetDispatchProps {
  fetchReports: typeof ocpCloudDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpCloudDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (
  tab: OcpCloudDashboardTab
): ComputedOcpCloudReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpCloudDashboardTab.accounts:
      return 'account';
    case OcpCloudDashboardTab.regions:
      return 'region';
    case OcpCloudDashboardTab.services:
      return 'service';
  }
};

const mapStateToProps = createMapStateToProps<
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps
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
