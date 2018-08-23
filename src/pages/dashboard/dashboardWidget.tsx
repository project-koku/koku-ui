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
import { createMapStateToProps } from 'store/common';
import {
  dashboardActions,
  dashboardSelectors,
  DashboardTab,
  DashboardWidget as DashboardWidgetStatic,
} from 'store/dashboard';
import { reportsSelectors } from 'store/reports';
import { formatValue } from 'utils/formatValue';
import { GetComputedReportItemsParams } from 'utils/getComputedReportItems';

interface DashboardWidgetOwnProps {
  widgetId: number;
}

interface DashboardWidgetStateProps extends DashboardWidgetStatic {
  current: Report;
  previous: Report;
  currentQuery: string;
  previousQuery: string;
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

  private getTabTitle = (tab: DashboardTab) => {
    const { t } = this.props;
    let key = '';

    switch (tab) {
      case DashboardTab.services:
        key = 'service';
        break;
      case DashboardTab.accounts:
        key = 'account';
        break;
      case DashboardTab.regions:
        key = 'region';
        break;
      case DashboardTab.instanceType:
        key = 'instance_type';
        break;
    }

    return t('group_by.top', { groupBy: key });
  };

  private getDetailsLinkTitle = (tab: DashboardTab) => {
    const { t } = this.props;
    let key = '';

    switch (tab) {
      case DashboardTab.services:
        key = 'service';
        break;
      case DashboardTab.accounts:
        key = 'account';
        break;
      case DashboardTab.regions:
        key = 'region';
        break;
      case DashboardTab.instanceType:
        key = 'instance_type';
        break;
    }

    return t('group_by.all', { groupBy: key });
  };

  private getIdKeyForTab(
    tab: DashboardTab
  ): GetComputedReportItemsParams['idKey'] {
    switch (tab) {
      case DashboardTab.services:
        return 'service';
      case DashboardTab.accounts:
        return 'account';
      case DashboardTab.regions:
        return 'region';
      case DashboardTab.instanceType:
        return 'instance_type';
      default:
        return null;
    }
  }

  private buildDetailsLink = () => {
    const { currentQuery } = this.props;
    const groupBy = parseQuery<Query>(currentQuery).group_by;
    return `/cost?${getQuery({ group_by: groupBy })}`;
  };

  private renderTab = (tabData: TabData) => {
    const { current, topItems } = this.props;

    const currentTab = tabData.id as DashboardTab;

    return (
      <ReportSummaryItems
        idKey={this.getIdKeyForTab(currentTab)}
        report={current}
      >
        {({ items }) =>
          items.map(tabItem => (
            <ReportSummaryItem
              key={tabItem.id}
              formatOptions={topItems.formatOptions}
              formatValue={formatValue}
              label={tabItem.label}
              totalValue={current.total.value}
              units={tabItem.units}
              value={tabItem.total}
            />
          ))
        }
      </ReportSummaryItems>
    );
  };

  private handleTabChange = (tabId: DashboardTab) => {
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
    } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'Do');
    const startDate = formatDate(startOfMonth(today), 'Do');

    const title = t(titleKey, { endDate, month, startDate });
    const subTitle = t('dashboard_page.widget_subtitle', {
      endDate,
      month,
      startDate,
      count: getDate(today),
    });

    const detailLabel = t(details.labelKey, {
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
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = dashboardSelectors.selectWidget(state, widgetId);
  const queries = dashboardSelectors.selectWidgetQueries(state, widgetId);
  return {
    ...widget,
    currentQuery: queries.current,
    previousQuery: queries.previous,
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
