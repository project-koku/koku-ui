import { getQuery, parseQuery, Query } from 'api/query';
import { Report, ReportType } from 'api/reports';
import { Link } from 'components/link';
import {
  ReportSummary,
  ReportSummaryDetails,
  ReportSummaryItem,
  ReportSummaryItems,
  ReportSummaryTrend,
} from 'components/reportSummary';
import { TabData, Tabs } from 'components/tabs';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import {
  awsDashboardActions,
  awsDashboardSelectors,
  AwsDashboardTab,
  AwsDashboardWidget as AwsDashboardWidgetStatic,
} from 'store/awsDashboard';
import { createMapStateToProps } from 'store/common';
import { reportsSelectors } from 'store/reports';
import { formatValue } from 'utils/formatValue';
import { GetComputedReportItemsParams } from 'utils/getComputedReportItems';

interface AwsDashboardWidgetOwnProps {
  widgetId: number;
}

interface AwsDashboardWidgetStateProps extends AwsDashboardWidgetStatic {
  current: Report;
  previous: Report;
  tabs: Report;
  currentQuery: string;
  previousQuery: string;
  tabsQuery: string;
  status: number;
}

interface AwsDashboardWidgetDispatchProps {
  fetchReports: typeof awsDashboardActions.fetchWidgetReports;
  updateTab: typeof awsDashboardActions.changeWidgetTab;
}

type AwsDashboardWidgetProps = AwsDashboardWidgetOwnProps &
  AwsDashboardWidgetStateProps &
  AwsDashboardWidgetDispatchProps &
  InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: AwsDashboardTab
): GetComputedReportItemsParams['idKey'] => {
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

class AwsDashboardWidgetBase extends React.Component<AwsDashboardWidgetProps> {
  public componentDidMount() {
    const { fetchReports, widgetId } = this.props;
    fetchReports(widgetId);
  }

  private getTabTitle = (tab: AwsDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.top', { groupBy: key });
  };

  private getDetailsLinkTitle = (tab: AwsDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private buildDetailsLink = () => {
    const { currentQuery } = this.props;
    const groupBy = parseQuery<Query>(currentQuery).group_by;
    return `/aws?${getQuery({
      group_by: groupBy,
      order_by: { total: 'desc' },
    })}`;
  };

  private renderTab = (tabData: TabData) => {
    const { tabs, topItems } = this.props;

    const currentTab = tabData.id as AwsDashboardTab;

    return (
      <ReportSummaryItems idKey={getIdKeyForTab(currentTab)} report={tabs}>
        {({ items }) =>
          items.map(tabItem => (
            <ReportSummaryItem
              key={tabItem.id}
              formatOptions={topItems.formatOptions}
              formatValue={formatValue}
              label={tabItem.label.toString()} // Todo: why is label of type React.ReactText?
              totalValue={tabs.total.value}
              units={tabItem.units}
              value={tabItem.total}
            />
          ))
        }
      </ReportSummaryItems>
    );
  };

  private handleTabChange = (tabId: AwsDashboardTab) => {
    this.props.updateTab(this.props.id, tabId);
  };

  public render() {
    const {
      t,
      titleKey,
      trend,
      details,
      current,
      previous,
      availableTabs,
      currentTab,
      reportType,
      status,
    } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'Do');
    const startDate = formatDate(startOfMonth(today), 'Do');

    const title = t(titleKey, { endDate, month, startDate });
    const subTitle = t('aws_dashboard.widget_subtitle', {
      endDate,
      month,
      startDate,
      count: getDate(today),
    });

    const detailLabel =
      details.labelKey.indexOf('total_cost') !== -1
        ? undefined
        : t(details.labelKey, {
            context: details.labelKeyContext,
          });

    const detailsLink = reportType === ReportType.cost && (
      <Link to={this.buildDetailsLink()}>
        {this.getDetailsLinkTitle(currentTab)}
      </Link>
    );

    const trendTitle = t(trend.titleKey);
    return (
      <ReportSummary
        title={title}
        subTitle={subTitle}
        detailsLink={detailsLink}
        status={status}
      >
        <ReportSummaryDetails
          report={current}
          formatValue={formatValue}
          label={detailLabel}
          formatOptions={details.formatOptions}
        />
        <ReportSummaryTrend
          type={trend.type}
          title={trendTitle}
          current={current}
          previous={previous}
          formatDatumValue={formatValue}
          formatDatumOptions={trend.formatOptions}
        />
        <Tabs
          tabs={availableTabs.map(tab => ({
            id: tab,
            label: this.getTabTitle(tab),
            content: this.renderTab,
          }))}
          selected={currentTab}
          onChange={this.handleTabChange}
        />
      </ReportSummary>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  AwsDashboardWidgetOwnProps,
  AwsDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = awsDashboardSelectors.selectWidget(state, widgetId);
  const queries = awsDashboardSelectors.selectWidgetQueries(state, widgetId);
  return {
    ...widget,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
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
    tabs: reportsSelectors.selectReport(state, widget.reportType, queries.tabs),
    status: reportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
  };
});

const mapDispatchToProps: AwsDashboardWidgetDispatchProps = {
  fetchReports: awsDashboardActions.fetchWidgetReports,
  updateTab: awsDashboardActions.changeWidgetTab,
};

const AwsDashboardWidget = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AwsDashboardWidgetBase)
);

export { AwsDashboardWidget, AwsDashboardWidgetBase, AwsDashboardWidgetProps };
