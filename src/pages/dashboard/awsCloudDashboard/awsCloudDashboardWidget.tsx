import {
  DashboardWidgetBase,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
} from 'pages/dashboard/components/dashboardWidgetBase';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  awsCloudDashboardActions,
  awsCloudDashboardSelectors,
  AwsCloudDashboardTab,
} from 'store/dashboard/awsCloudDashboard';
import { reportSelectors } from 'store/reports';
import { ComputedAwsReportItemsParams } from 'utils/computedReport/getComputedAwsReportItems';

interface AwsCloudDashboardWidgetDispatchProps {
  fetchReports: typeof awsCloudDashboardActions.fetchWidgetReports;
  updateTab: typeof awsCloudDashboardActions.changeWidgetTab;
}

export const getIdKeyForTab = (
  tab: AwsCloudDashboardTab
): ComputedAwsReportItemsParams['idKey'] => {
  switch (tab) {
    case AwsCloudDashboardTab.services:
      return 'service';
    case AwsCloudDashboardTab.accounts:
      return 'account';
    case AwsCloudDashboardTab.regions:
      return 'region';
    case AwsCloudDashboardTab.instanceType:
      return 'instance_type';
  }
};

const mapStateToProps = createMapStateToProps<
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = awsCloudDashboardSelectors.selectWidget(state, widgetId);
  const queries = awsCloudDashboardSelectors.selectWidgetQueries(
    state,
    widgetId
  );
  return {
    ...widget,
    getIdKeyForTab,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: reportSelectors.selectReport(
      state,
      widget.reportPathsType,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: reportSelectors.selectReportFetchStatus(
      state,
      widget.reportPathsType,
      widget.reportType,
      queries.current
    ),
    previousReport: reportSelectors.selectReport(
      state,
      widget.reportPathsType,
      widget.reportType,
      queries.previous
    ),
    tabsReport: reportSelectors.selectReport(
      state,
      widget.reportPathsType,
      widget.reportType,
      queries.tabs
    ),
    tabsReportFetchStatus: reportSelectors.selectReportFetchStatus(
      state,
      widget.reportPathsType,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: AwsCloudDashboardWidgetDispatchProps = {
  fetchReports: awsCloudDashboardActions.fetchWidgetReports,
  updateTab: awsCloudDashboardActions.changeWidgetTab,
};

const AwsCloudDashboardWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DashboardWidgetBase)
);

export { AwsCloudDashboardWidget };
