import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/dashboard/components/dashboardWidgetBase';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ocpSupplementaryDashboardActions,
  ocpSupplementaryDashboardSelectors,
  OcpSupplementaryDashboardTab,
} from 'store/dashboard/ocpSupplementaryDashboard';
import { ocpReportsSelectors } from 'store/reports/ocpReports';
import { ComputedOcpReportItemsParams } from 'utils/computedReport/getComputedOcpReportItems';
import { chartStyles } from './ocpSupplementaryDashboardWidget.styles';

interface OcpSupplementaryDashboardWidgetDispatchProps {
  fetchReports: typeof ocpSupplementaryDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpSupplementaryDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (
  tab: OcpSupplementaryDashboardTab
): ComputedOcpReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpSupplementaryDashboardTab.clusters:
      return 'cluster';
    case OcpSupplementaryDashboardTab.nodes:
      return 'node';
    case OcpSupplementaryDashboardTab.projects:
      return 'project';
  }
};

const mapStateToProps = createMapStateToProps<
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = ocpSupplementaryDashboardSelectors.selectWidget(
    state,
    widgetId
  );
  const queries = ocpSupplementaryDashboardSelectors.selectWidgetQueries(
    state,
    widgetId
  );
  return {
    ...widget,
    getIdKeyForTab,
    appNavPath: 'ocp-supplementary',
    detailsPath: '/ocp-supplementary',
    chartAltHeight: chartStyles.chartAltHeight,
    containerAltHeight: chartStyles.containerAltHeight,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: ocpReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: ocpReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
    previousReport: ocpReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabsReport: ocpReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    tabsReportFetchStatus: ocpReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: OcpSupplementaryDashboardWidgetDispatchProps = {
  fetchReports: ocpSupplementaryDashboardActions.fetchWidgetReports,
  updateTab: ocpSupplementaryDashboardActions.changeWidgetTab,
};

const OcpSupplementaryDashboardWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase)
);

export { OcpSupplementaryDashboardWidget };
