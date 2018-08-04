import { Report } from 'api/reports';
import {
  ReportSummary,
  ReportSummaryDetails,
  ReportSummaryTrend,
} from 'components/reportSummary';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  dashboardActions,
  dashboardSelectors,
  DashboardWidget as DashboardWidgetStatic,
} from 'store/dashboard';
import { reportsSelectors } from 'store/reports';
import { formatValue } from 'utils/formatValue';

interface DashboardWidgetOwnProps {
  widgetId: number;
}

interface DashboardWidgetStateProps extends DashboardWidgetStatic {
  current: Report;
  previous: Report;
}

interface DashboardWidgetDispatchProps {
  fetchReports: typeof dashboardActions.fetchWidgetReports;
  updateTab: typeof dashboardActions.changeWidgetTab;
}

type DashboardWidgetProps = DashboardWidgetOwnProps &
  DashboardWidgetStateProps &
  DashboardWidgetDispatchProps &
  InjectedTranslateProps;

class DashboardWidgetBase extends React.Component<DashboardWidgetProps> {
  public componentDidMount() {
    const { fetchReports, widgetId } = this.props;
    fetchReports(widgetId);
  }

  public render() {
    const { t, titleKey, trend, details, current, previous } = this.props;
    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'Do');
    const startDate = formatDate(startOfMonth(today), 'Do');

    const title = t(titleKey, { endDate, month, startDate });
    const detailLabel = t(details.labelKey, {
      context: details.labelKeyContext,
    });

    const detailDescription = t(
      getDate(today) === 1
        ? details.descriptionKeySingle
        : details.descriptionKeyRange || details.descriptionKeySingle,
      { endDate, month, startDate }
    );
    const trendTitle = t(trend.titleKey);

    return (
      <ReportSummary title={title}>
        <ReportSummaryDetails
          report={current}
          formatValue={formatValue}
          label={detailLabel}
          formatOptions={details.formatOptions}
          description={detailDescription}
        />
        <ReportSummaryTrend
          title={trendTitle}
          current={current}
          previous={previous}
          formatDatumValue={formatValue}
          formatDatumOptions={trend.formatOptions}
        />
      </ReportSummary>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = dashboardSelectors.selectWidget(state, widgetId);
  const queries = dashboardSelectors.selectWidgetQueries(state, widgetId);
  return {
    ...widget,
    current: reportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    previous: reportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
  };
});

const mapDispatchToProps: DashboardWidgetDispatchProps = {
  fetchReports: dashboardActions.fetchWidgetReports,
  updateTab: dashboardActions.changeWidgetTab,
};

const DashboardWidget = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DashboardWidgetBase)
);

export { DashboardWidget, DashboardWidgetBase, DashboardWidgetProps };
