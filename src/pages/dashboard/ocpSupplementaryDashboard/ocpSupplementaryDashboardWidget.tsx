import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/dashboard/components/dashboardWidgetBase';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  ocpSupplementaryDashboardActions,
  ocpSupplementaryDashboardSelectors,
  OcpSupplementaryDashboardTab,
} from 'store/dashboard/ocpSupplementaryDashboard';
import { reportSelectors } from 'store/reports';
import { ComputedOcpReportItemsParams } from 'utils/computedReport/getComputedOcpReportItems';

interface OcpSupplementaryDashboardWidgetDispatchProps {
  fetchReports: typeof ocpSupplementaryDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpSupplementaryDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (tab: OcpSupplementaryDashboardTab): ComputedOcpReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpSupplementaryDashboardTab.clusters:
      return 'cluster';
    case OcpSupplementaryDashboardTab.nodes:
      return 'node';
    case OcpSupplementaryDashboardTab.projects:
      return 'project';
  }
};

const mapStateToProps = createMapStateToProps<DashboardWidgetOwnProps, DashboardWidgetStateProps>(
  (state, { widgetId }) => {
    const widget = ocpSupplementaryDashboardSelectors.selectWidget(state, widgetId);
    const queries = ocpSupplementaryDashboardSelectors.selectWidgetQueries(state, widgetId);
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

const mapDispatchToProps: OcpSupplementaryDashboardWidgetDispatchProps = {
  fetchReports: ocpSupplementaryDashboardActions.fetchWidgetReports,
  updateTab: ocpSupplementaryDashboardActions.changeWidgetTab,
};

const OcpSupplementaryDashboardWidget = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase)
);

export { OcpSupplementaryDashboardWidget };
