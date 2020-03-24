import { Tab, Tabs } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/queries/awsQuery';
import { Report } from 'api/reports/report';
import {
  ComputedReportItemType,
  transformReport,
} from 'components/charts/common/chartUtils';
import {
  ReportSummary,
  ReportSummaryAlt,
  ReportSummaryCost,
  ReportSummaryDetails,
  ReportSummaryItem,
  ReportSummaryItems,
  ReportSummaryTrend,
  ReportSummaryUsage,
} from 'components/reports/reportSummary';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  DashboardChartType,
  DashboardWidget,
} from 'store/dashboard/common/dashboardCommon';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './dashboardWidget.styles';

interface DashboardWidgetOwnProps {
  chartAltHeight?: number;
  containerAltHeight?: number;
  getIdKeyForTab: <T extends DashboardWidget<any>>(tab: T) => string;
  widgetId: number;
}

interface DashboardWidgetStateProps extends DashboardWidget<any> {
  currentQuery: string;
  currentReport: Report;
  currentReportFetchStatus: number;
  previousQuery: string;
  previousReport: Report;
  tabsQuery: string;
  tabsReport: Report;
  tabsReportFetchStatus: number;
}

interface DashboardWidgetDispatchProps {
  fetchReports: (widgetId) => void;
  updateTab: (id, availableTabs) => void;
}

type DashboardWidgetProps = DashboardWidgetOwnProps &
  DashboardWidgetStateProps &
  DashboardWidgetDispatchProps &
  InjectedTranslateProps;

class DashboardWidgetBase extends React.Component<DashboardWidgetProps> {
  public state = {
    activeTabKey: 0,
  };

  public componentDidMount() {
    const { availableTabs, fetchReports, id, updateTab, widgetId } = this.props;
    if (availableTabs) {
      updateTab(id, availableTabs[0]);
    }
    fetchReports(widgetId);
  }

  private buildDetailsLink = <T extends DashboardWidget<any>>(tab: T) => {
    const { details, getIdKeyForTab } = this.props;
    const currentTab = getIdKeyForTab(tab);
    return `${details.viewAllPath}?${getQuery({
      group_by: {
        [currentTab]: '*',
      },
      order_by: { cost: 'desc' },
    })}`;
  };

  private getChart = (
    containerHeight: number,
    height: number,
    adjustContainerHeight: boolean = false
  ) => {
    const { chartType } = this.props;
    if (chartType === DashboardChartType.cost) {
      return this.getCostChart(containerHeight, height, adjustContainerHeight);
    } else if (chartType === DashboardChartType.trend) {
      return this.getTrendChart(containerHeight, height, adjustContainerHeight);
    } else if (chartType === DashboardChartType.usage) {
      return this.getUsageChart(height);
    } else {
      return null;
    }
  };

  // This chart displays cost and infrastructure cost
  private getCostChart = (
    containerHeight: number,
    height: number,
    adjustContainerHeight: boolean = false
  ) => {
    const { currentReport, previousReport, t, trend } = this.props;

    const units = this.getUnits();
    const title = t(trend.titleKey, { units: t(`units.${units}`) });
    const computedReportItem = trend.computedReportItem || 'cost'; // cost, supplementaryCost, etc.

    // Infrastructure data
    const currentInfrastructureData = transformReport(
      currentReport,
      trend.type,
      'date',
      'infrastructureCost'
    );
    const previousInfrastructureData = transformReport(
      previousReport,
      trend.type,
      'date',
      'infrastructureCost'
    );

    // Usage data
    const currentUsageData = transformReport(
      currentReport,
      trend.type,
      'date',
      computedReportItem
    );
    const previousUsageData = transformReport(
      previousReport,
      trend.type,
      'date',
      computedReportItem
    );

    return (
      <ReportSummaryCost
        adjustContainerHeight={adjustContainerHeight}
        containerHeight={containerHeight}
        currentCostData={currentUsageData}
        currentInfrastructureCostData={currentInfrastructureData}
        formatDatumValue={formatValue}
        formatDatumOptions={trend.formatOptions}
        height={height}
        previousCostData={previousUsageData}
        previousInfrastructureCostData={previousInfrastructureData}
        title={title}
      />
    );
  };

  // This chart displays cost only
  private getTrendChart = (
    containerHeight: number,
    height: number,
    adjustContainerHeight: boolean = false
  ) => {
    const { currentReport, details, previousReport, t, trend } = this.props;

    const units = this.getUnits();
    const title = t(trend.titleKey, { units: t(`units.${units}`) });
    const computedReportItem = trend.computedReportItem || 'cost'; // cost, supplementaryCost, etc.

    // Data
    const currentData = transformReport(
      currentReport,
      trend.type,
      'date',
      computedReportItem
    );
    const previousData = transformReport(
      previousReport,
      trend.type,
      'date',
      computedReportItem
    );

    return (
      <ReportSummaryTrend
        adjustContainerHeight={adjustContainerHeight}
        containerHeight={containerHeight}
        currentData={currentData}
        formatDatumValue={formatValue}
        formatDatumOptions={trend.formatOptions}
        height={height}
        previousData={previousData}
        showUsageLegendLabel={details.showUsageLegendLabel}
        title={title}
        units={units}
      />
    );
  };

  // This chart displays usage and requests
  private getUsageChart = (height: number) => {
    const { currentReport, previousReport, t, trend } = this.props;

    const units = this.getUnits();
    const title = t(trend.titleKey, { units: t(`units.${units}`) });

    // Request data
    const currentRequestData = transformReport(
      currentReport,
      trend.type,
      'date',
      'request'
    );
    const previousRequestData = transformReport(
      previousReport,
      trend.type,
      'date',
      'request'
    );

    // Usage data
    const currentUsageData = transformReport(
      currentReport,
      trend.type,
      'date',
      'usage'
    );
    const previousUsageData = transformReport(
      previousReport,
      trend.type,
      'date',
      'usage'
    );

    return (
      <ReportSummaryUsage
        containerHeight={chartStyles.containerUsageHeight}
        currentRequestData={currentRequestData}
        currentUsageData={currentUsageData}
        formatDatumValue={formatValue}
        formatDatumOptions={trend.formatOptions}
        height={height}
        previousRequestData={previousRequestData}
        previousUsageData={previousUsageData}
        title={title}
      />
    );
  };

  private getDetails = () => {
    const { chartType, currentReport, details } = this.props;
    const units = this.getUnits();
    return (
      <ReportSummaryDetails
        chartType={chartType}
        costLabel={this.getDetailsLabel(details.costKey, units)}
        formatOptions={details.formatOptions}
        formatValue={formatValue}
        report={currentReport}
        requestLabel={this.getDetailsLabel(details.requestKey, units)}
        showTooltip={details.showTooltip}
        showUnits={details.showUnits}
        showUsageFirst={details.showUsageFirst}
        usageFormatOptions={details.usageFormatOptions}
        usageLabel={this.getDetailsLabel(details.usageKey, units)}
      />
    );
  };

  private getDetailsLabel = (key: string, units: string) => {
    const { t } = this.props;
    return key ? t(key, { units: t(`units.${units}`) }) : undefined;
  };

  private getDetailsLink = () => {
    const { currentTab, details } = this.props;

    if (details.viewAllPath) {
      return (
        <Link
          to={this.buildDetailsLink(currentTab)}
          onClick={this.handleInsightsNavClick}
        >
          {this.getDetailsLinkTitle(currentTab)}
        </Link>
      );
    }
    return null;
  };

  private getDetailsLinkTitle = <T extends DashboardWidget<any>>(tab: T) => {
    const { getIdKeyForTab, t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private getHorizontalLayout = () => {
    const {
      containerAltHeight = chartStyles.containerAltHeight,
      chartAltHeight = chartStyles.chartAltHeight,
      currentReportFetchStatus,
    } = this.props;

    return (
      <ReportSummaryAlt
        detailsLink={this.getDetailsLink()}
        status={currentReportFetchStatus}
        subTitle={this.getSubTitle()}
        tabs={this.getTabs()}
        title={this.getTitle()}
      >
        {this.getDetails()}
        {this.getChart(containerAltHeight, chartAltHeight, true)}
      </ReportSummaryAlt>
    );
  };

  private getSubTitle = () => {
    const { t } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'D');
    const startDate = formatDate(startOfMonth(today), 'D');

    return t('aws_dashboard.widget_subtitle', {
      count: getDate(today),
      endDate,
      month,
      startDate,
    });
  };

  private getTab = <T extends DashboardWidget<any>>(tab: T, index: number) => {
    const { getIdKeyForTab, tabsReport, tabsReportFetchStatus } = this.props;
    const currentTab: any = getIdKeyForTab(tab);

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        title={this.getTabTitle(tab)}
      >
        <div className={css(styles.tabItems)}>
          <ReportSummaryItems
            idKey={currentTab}
            key={`${currentTab}-items`}
            report={tabsReport}
            status={tabsReportFetchStatus}
          >
            {({ items }) =>
              items.map(reportItem => this.getTabItem(tab, reportItem))
            }
          </ReportSummaryItems>
        </div>
      </Tab>
    );
  };

  private getTabItem = <T extends DashboardWidget<any>>(tab: T, reportItem) => {
    const {
      availableTabs,
      details,
      getIdKeyForTab,
      tabsReport,
      topItems,
      trend,
    } = this.props;
    const { activeTabKey } = this.state;

    const currentTab = getIdKeyForTab(tab);
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);
    const computedReportItem = trend.computedReportItem || 'cost';

    let totalValue;
    const hasTotal = tabsReport && tabsReport.meta && tabsReport.meta.total;
    if (computedReportItem === ComputedReportItemType.usage) {
      if (hasTotal && tabsReport.meta.total.usage) {
        totalValue = tabsReport.meta.total.usage.value;
      }
    } else {
      if (
        hasTotal &&
        tabsReport.meta.total[computedReportItem] &&
        tabsReport.meta.total[computedReportItem].total
      ) {
        totalValue = tabsReport.meta.total[computedReportItem].total.value;
      }
    }

    if (activeTab === currentTab) {
      return (
        <ReportSummaryItem
          key={`${reportItem.id}-item`}
          formatOptions={topItems.formatOptions}
          formatValue={formatValue}
          label={reportItem.label ? reportItem.label.toString() : ''}
          totalValue={totalValue}
          units={details.units ? details.units : this.getUnits()}
          value={reportItem[computedReportItem]}
        />
      );
    } else {
      return null;
    }
  };

  private getTabs = () => {
    const { availableTabs } = this.props;
    return (
      <Tabs
        isFilled
        activeKey={this.state.activeTabKey}
        onSelect={this.handleTabClick}
      >
        {availableTabs.map((tab, index) => this.getTab(tab, index))}
      </Tabs>
    );
  };

  private getTabTitle = <T extends DashboardWidget<any>>(tab: T) => {
    const { getIdKeyForTab, t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.top', { groupBy: key });
  };

  private getTitle = () => {
    const { t, titleKey } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'Do');
    const startDate = formatDate(startOfMonth(today), 'Do');

    return t(titleKey, { endDate, month, startDate });
  };

  private getUnits = () => {
    const { currentReport, details, trend } = this.props;
    const computedReportItem = trend.computedReportItem || 'cost';

    if (details.units) {
      return details.units;
    }

    let units;
    const hasTotal =
      currentReport && currentReport.meta && currentReport.meta.total;
    if (computedReportItem === ComputedReportItemType.usage) {
      const hasUsage = hasTotal && currentReport.meta.total.usage;
      units = hasUsage
        ? unitLookupKey(currentReport.meta.total.usage.units)
        : '';
    } else {
      const hasCost =
        hasTotal &&
        currentReport.meta.total[computedReportItem] &&
        currentReport.meta.total[computedReportItem].total;
      units = hasCost
        ? unitLookupKey(
            currentReport.meta.total[computedReportItem].total.units
          )
        : '';
    }
    return units;
  };

  private getVerticalLayout = () => {
    const { availableTabs, currentReportFetchStatus } = this.props;

    return (
      <ReportSummary
        detailsLink={this.getDetailsLink()}
        status={currentReportFetchStatus}
        subTitle={this.getSubTitle()}
        title={this.getTitle()}
      >
        {this.getDetails()}
        {this.getChart(
          chartStyles.containerTrendHeight,
          chartStyles.chartHeight
        )}
        {Boolean(availableTabs) && (
          <div className={css(styles.tabs)}>{this.getTabs()}</div>
        )}
      </ReportSummary>
    );
  };

  private handleInsightsNavClick = () => {
    const { details } = this.props;
    if (details.appNavPath) {
      insights.chrome.appNavClick({
        id: details.appNavPath,
        secondaryNav: true,
      });
    }
  };

  private handleTabClick = (event, tabIndex) => {
    const { availableTabs, id, updateTab } = this.props;
    const tab = availableTabs[tabIndex];

    updateTab(id, tab);
    this.setState({
      activeTabKey: tabIndex,
    });
  };

  public render() {
    const { details } = this.props;
    return details.showHorizontal
      ? this.getHorizontalLayout()
      : this.getVerticalLayout();
  }
}

export {
  DashboardWidgetBase,
  DashboardWidgetProps,
  DashboardWidgetOwnProps,
  DashboardWidgetStateProps,
};
