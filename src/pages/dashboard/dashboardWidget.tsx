import { Report } from 'api/reports';
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

    switch (tab) {
      case DashboardTab.services:
        return t('dashboard_page.tabs.services');
      case DashboardTab.accounts:
        return t('dashboard_page.tabs.accounts');
      default:
        return '';
    }
  };

  private getIdKeyForTab(
    tab: DashboardTab
  ): GetComputedReportItemsParams['idKey'] {
    switch (tab) {
      case DashboardTab.services:
        return 'service';
      case DashboardTab.accounts:
        return 'account';
      default:
        return null;
    }
  }

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
    } = this.props;

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
