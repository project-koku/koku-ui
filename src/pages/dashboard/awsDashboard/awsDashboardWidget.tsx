import { AwsReport } from 'api/awsReports';
import { DashboardWidgetBase } from 'pages/dashboard/components/dashboardWidgetBase';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  awsDashboardActions,
  awsDashboardSelectors,
  AwsDashboardTab,
  AwsDashboardWidget as AwsDashboardWidgetStatic,
} from 'store/dashboard/awsDashboard';
import { awsReportsSelectors } from 'store/reports/awsReports';
import { ComputedAwsReportItemsParams } from 'utils/computedReport/getComputedAwsReportItems';

interface AwsDashboardWidgetOwnProps {
  appNavPath: string;
  detailsPath: string;
  getIdKeyForTab: (tab: string) => string;
  widgetId: number;
}

interface AwsDashboardWidgetStateProps extends AwsDashboardWidgetStatic {
  currentQuery: string;
  currentReport: AwsReport;
  currentReportFetchStatus: number;
  previousQuery: string;
  previousReport: AwsReport;
  tabsQuery: string;
  tabsReport: AwsReport;
  tabsReportFetchStatus: number;
}

interface AwsDashboardWidgetDispatchProps {
  fetchReports: typeof awsDashboardActions.fetchWidgetReports;
  updateTab: typeof awsDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (
  tab: AwsDashboardTab
): ComputedAwsReportItemsParams['idKey'] => {
  switch (tab) {
    case AwsDashboardTab.services:
      return 'service';
    case AwsDashboardTab.accounts:
      return 'account';
    case AwsDashboardTab.regions:
      return 'region';
    case AwsDashboardTab.instanceType:
      return 'instance_type';
  }
};

const mapStateToProps = createMapStateToProps<
  AwsDashboardWidgetOwnProps,
  AwsDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = awsDashboardSelectors.selectWidget(state, widgetId);
  const queries = awsDashboardSelectors.selectWidgetQueries(state, widgetId);
  return {
    ...widget,
    getIdKeyForTab,
    appNavPath: 'aws',
    detailsPath: '/aws',
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: awsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: awsReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
    previousReport: awsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabsReport: awsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    tabsReportFetchStatus: awsReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: AwsDashboardWidgetDispatchProps = {
  fetchReports: awsDashboardActions.fetchWidgetReports,
  updateTab: awsDashboardActions.changeWidgetTab,
};

const AwsDashboardWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase)
);

export { AwsDashboardWidget };
