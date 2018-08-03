import { Report, ReportType } from 'api/reports';
import {
  ReportSummary,
  ReportSummaryDetails,
  ReportSummaryTrend,
} from 'components/reportSummary';
import { DatumValueFormatter } from 'components/trendChart';
import React from 'react';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportsActions, reportsSelectors } from 'store/reports';
import { getQueryForTimeScope } from './dashboardUtils';

const {
  selectReport,
  selectReportError,
  selectReportFetchStatus,
} = reportsSelectors;

interface DashboardWidgetOwnProps {
  reportType: ReportType;
  title: string;
  detailLabel: string;
  detailDescription: string;
  trendTitle: string;
  formatDetailsValue(value: number): string | number;
  formatTrendValue: DatumValueFormatter;
}

interface DashboardWidgetStateProps {
  currentMonthQuery: string;
  currentMonth: Report;
  currentMonthFetchStatus: FetchStatus;
  currentMonthError: any;
  prevMonthQuery: string;
  prevMonth: Report;
  prevMonthFetchStatus: FetchStatus;
  prevMonthError: any;
}

interface DashboardWidgetDispatchProps {
  fetchReport: typeof reportsActions.fetchReport;
}

type DashboardWidgetProps = DashboardWidgetOwnProps &
  DashboardWidgetStateProps &
  DashboardWidgetDispatchProps;

class DashboardWidgetBase extends React.Component<DashboardWidgetProps> {
  public componentDidMount() {
    const {
      currentMonthQuery,
      prevMonthQuery,
      fetchReport,
      reportType,
    } = this.props;

    fetchReport(reportType, currentMonthQuery);
    fetchReport(reportType, prevMonthQuery);
  }

  public render() {
    const {
      currentMonth,
      prevMonth,
      formatDetailsValue,
      title,
      detailLabel,
      detailDescription,
      trendTitle,
      formatTrendValue,
    } = this.props;

    return (
      <ReportSummary title={title}>
        <ReportSummaryDetails
          report={currentMonth}
          formatValue={formatDetailsValue}
          label={detailLabel}
          description={detailDescription}
        />
        <ReportSummaryTrend
          title={trendTitle}
          current={currentMonth}
          previous={prevMonth}
          formatDatumValue={formatTrendValue}
        />
      </ReportSummary>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps
>((state, ownProps) => {
  const { reportType } = ownProps;

  const currentMonthQuery = getQueryForTimeScope(-1);
  const prevMonthQuery = getQueryForTimeScope(-2);

  return {
    currentMonthQuery,
    prevMonthQuery,
    currentMonth: selectReport(state, reportType, currentMonthQuery),
    currentMonthFetchStatus: selectReportFetchStatus(
      state,
      reportType,
      currentMonthQuery
    ),
    currentMonthError: selectReportError(state, reportType, currentMonthQuery),
    prevMonth: selectReport(state, reportType, prevMonthQuery),
    prevMonthFetchStatus: selectReportFetchStatus(
      state,
      reportType,
      prevMonthQuery
    ),
    prevMonthError: selectReportError(state, reportType, prevMonthQuery),
  };
});

const mapDispatchToProps: DashboardWidgetDispatchProps = {
  fetchReport: reportsActions.fetchReport,
};

const DashboardWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardWidgetBase);

export { DashboardWidget, DashboardWidgetProps, DashboardWidgetBase };
