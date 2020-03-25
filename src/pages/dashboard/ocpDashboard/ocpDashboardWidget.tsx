import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/dashboard/components/dashboardWidgetBase';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ocpDashboardActions,
  ocpDashboardSelectors,
  OcpDashboardTab,
} from 'store/dashboard/ocpDashboard';
import { reportSelectors } from 'store/reports';
import { ComputedOcpReportItemsParams } from 'utils/computedReport/getComputedOcpReportItems';
import { chartStyles } from './ocpDashboardWidget.styles';

interface OcpDashboardWidgetDispatchProps {
  fetchReports: typeof ocpDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (
  tab: OcpDashboardTab
): ComputedOcpReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpDashboardTab.clusters:
      return 'cluster';
    case OcpDashboardTab.nodes:
      return 'node';
    case OcpDashboardTab.projects:
      return 'project';
  }
};

const mapStateToProps = createMapStateToProps<
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = ocpDashboardSelectors.selectWidget(state, widgetId);
  const queries = ocpDashboardSelectors.selectWidgetQueries(state, widgetId);
  return {
    ...widget,
    getIdKeyForTab,
    chartAltHeight: chartStyles.chartAltHeight,
    containerAltHeight: chartStyles.containerAltHeight,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: reportSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: reportSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
    previousReport: reportSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabsReport: reportSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    tabsReportFetchStatus: reportSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: OcpDashboardWidgetDispatchProps = {
  fetchReports: ocpDashboardActions.fetchWidgetReports,
  updateTab: ocpDashboardActions.changeWidgetTab,
};

const OcpDashboardWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase)
);

export { OcpDashboardWidget };
