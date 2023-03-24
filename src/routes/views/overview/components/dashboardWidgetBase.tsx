import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import type { Forecast } from 'api/forecasts/forecast';
import { getQuery } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import type { RosReport } from 'api/ros/ros';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { Link } from 'react-router-dom';
import { ComputedReportItemType, DatumType, transformReport } from 'routes/views/components/charts/common/chartDatum';
import {
  getComputedForecast,
  transformForecast,
  transformForecastCone,
} from 'routes/views/components/charts/common/chartDatumForecast';
import {
  ReportSummary,
  ReportSummaryAlt,
  ReportSummaryCost,
  ReportSummaryDailyCost,
  ReportSummaryDailyTrend,
  ReportSummaryDetails,
  ReportSummaryItem,
  ReportSummaryItems,
  ReportSummaryTrend,
  ReportSummaryUsage,
} from 'routes/views/components/reports/reportSummary';
import { RecommendationsSummary } from 'routes/views/overview/components/recommendationsSummary';
import type { DashboardWidget } from 'store/dashboard/common/dashboardCommon';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { formatCurrency, formatUnits, unitsLookupKey } from 'utils/format';

import { ChartComparison } from './chartComparison';
import { chartStyles, styles } from './dashboardWidget.styles';

// eslint-disable-next-line no-shadow
const enum Comparison {
  cumulative = 'cumulative',
  daily = 'daily',
}

export interface DashboardWidgetOwnProps {
  widgetId?: number;
}

export interface DashboardWidgetStateProps extends DashboardWidget {
  chartAltHeight?: number;
  containerAltHeight?: number;
  costType?: string;
  currency?: string;
  currentQuery?: string;
  currentReport?: Report;
  currentReportFetchStatus?: number;
  forecast?: Forecast;
  forecastQuery?: string;
  forecastFetchStatus?: number;
  getIdKeyForTab?: (tab: string) => string;
  isRosFeatureEnabled?: boolean;
  previousQuery?: string;
  previousReport?: Report;
  previousReportFetchStatus?: number;
  rosQuery?: string;
  rosReport?: RosReport;
  rosFetchStatus?: number;
  tabsQuery?: string;
  tabsReport?: Report;
  tabsReportFetchStatus?: number;
}

export interface DashboardWidgetState {
  activeTabKey?: number;
  currentComparison?: string;
}

interface DashboardWidgetDispatchProps {
  fetchForecasts: (widgetId) => void;
  fetchReports: (widgetId) => void;
  fetchRosReport: (widgetId) => void;
  updateTab: (id, availableTabs) => void;
}

export type DashboardWidgetProps = DashboardWidgetOwnProps &
  DashboardWidgetStateProps &
  DashboardWidgetDispatchProps &
  WrappedComponentProps;

class DashboardWidgetBase extends React.Component<DashboardWidgetProps, DashboardWidgetState> {
  protected defaultState: DashboardWidgetState = {
    activeTabKey: 0,
    currentComparison: Comparison.cumulative,
  };
  public state: DashboardWidgetState = { ...this.defaultState };

  public componentDidMount() {
    const {
      availableTabs,
      details,
      fetchForecasts,
      fetchReports,
      fetchRosReport,
      id,
      isRosFeatureEnabled,
      trend,
      updateTab,
      widgetId,
    } = this.props;

    if (availableTabs) {
      updateTab(id, availableTabs[0]);
    }
    if (trend && trend.computedForecastItem !== undefined) {
      fetchForecasts(widgetId);
    }
    if (!details.showRecommendations && fetchReports) {
      fetchReports(widgetId);
    }
    if (details.showRecommendations && fetchRosReport && isRosFeatureEnabled) {
      fetchRosReport(widgetId);
    }
  }

  public componentDidUpdate(prevProps: DashboardWidgetProps) {
    const { costType, currency, fetchReports, fetchForecasts, trend, widgetId } = this.props;

    if (prevProps.costType !== costType || prevProps.currency !== currency) {
      fetchReports(widgetId);
      if (trend && trend.computedForecastItem !== undefined) {
        fetchForecasts(widgetId);
      }
    }
  }

  private buildDetailsLink = (tab: string) => {
    const { details, getIdKeyForTab } = this.props;
    const currentTab = getIdKeyForTab(tab);
    return `${details.viewAllPath}?${getQuery({
      group_by: {
        [currentTab]: '*',
      },
      order_by: { cost: 'desc' },
    })}`;
  };

  private getChart = (containerHeight: number, height: number, adjustContainerHeight: boolean = false) => {
    const { chartType, trend } = this.props;
    if (chartType === DashboardChartType.dailyTrend) {
      return this.getDailyTrendChart(containerHeight, height, adjustContainerHeight, trend.showSupplementaryLabel);
    } else if (chartType === DashboardChartType.dailyCost) {
      return this.getDailyCostChart(containerHeight, height, adjustContainerHeight);
    } else if (chartType === DashboardChartType.trend) {
      return this.getTrendChart(containerHeight, height, adjustContainerHeight, trend.showSupplementaryLabel);
    } else if (chartType === DashboardChartType.usage) {
      return this.getUsageChart(height, adjustContainerHeight);
    } else {
      return null;
    }
  };

  // This dropdown is for cumulative and daily cost
  private getChartComparison = () => {
    const { intl, trend } = this.props;
    const { currentComparison } = this.state;

    const units = this.getFormattedUnits();
    const cumulativeTitle = intl.formatMessage(trend.titleKey, { units });
    const dailyTitle = intl.formatMessage(trend.dailyTitleKey, { units });

    const options = [
      { label: dailyTitle, value: Comparison.daily },
      { label: cumulativeTitle, value: Comparison.cumulative, default: true },
    ];

    return (
      <ChartComparison
        currentItem={currentComparison || options[0].value}
        onItemClicked={this.handleComparisonClick}
        options={options}
      />
    );
  };

  // This chart displays cumulative and daily cost compared to infrastructure cost
  private getDailyCostChart = (containerHeight: number, height: number, adjustContainerHeight: boolean = false) => {
    const { chartFormatter, currentReport, previousReport, trend } = this.props;
    const { currentComparison } = this.state;

    const computedReportItem = trend.computedReportItem; // cost, supplementary cost, etc.
    const computedReportItemValue = trend.computedReportItemValue; // infrastructure usage cost

    const daily = currentComparison === Comparison.daily;
    const type = daily ? DatumType.rolling : trend.datumType;

    // Cost data
    const currentCostData = transformReport(currentReport, type, 'date', computedReportItem, computedReportItemValue);
    const previousCostData = transformReport(previousReport, type, 'date', computedReportItem, computedReportItemValue);

    // Forecast data
    const forecastData = this.getForecastData(currentReport, trend.computedForecastItem);

    const ReportSummaryComponent = daily ? ReportSummaryDailyCost : ReportSummaryCost;
    return (
      <>
        <div style={styles.comparisonContainer}>
          <div style={styles.comparison}>{this.getChartComparison()}</div>
        </div>
        <ReportSummaryComponent
          adjustContainerHeight={adjustContainerHeight}
          containerHeight={containerHeight}
          currentCostData={currentCostData}
          forecastConeData={forecastData.forecastConeData}
          forecastData={forecastData.forecastData}
          formatOptions={trend.formatOptions}
          formatter={chartFormatter || formatCurrency}
          height={height}
          previousCostData={previousCostData}
          showForecast={trend.computedForecastItem !== undefined}
        />
      </>
    );
  };

  // This chart displays cumulative and daily cost
  private getDailyTrendChart = (
    containerHeight: number,
    height: number,
    adjustContainerHeight: boolean = false,
    showSupplementaryLabel: boolean = false
  ) => {
    const { chartFormatter, chartName, currentReport, details, previousReport, trend } = this.props;
    const { currentComparison } = this.state;

    const computedReportItem = trend.computedReportItem; // cost, supplementary cost, etc.
    const computedReportItemValue = trend.computedReportItemValue; // infrastructure usage cost

    const daily = currentComparison === Comparison.daily;
    const type = daily ? DatumType.rolling : trend.datumType;

    // Cost data
    const currentData = transformReport(currentReport, type, 'date', computedReportItem, computedReportItemValue);
    const previousData = transformReport(previousReport, type, 'date', computedReportItem, computedReportItemValue);

    // Forecast data
    const { forecastData, forecastConeData } = this.getForecastData(currentReport, trend.computedForecastItem);

    const ReportSummaryComponent = daily ? ReportSummaryDailyTrend : ReportSummaryTrend;
    return (
      <>
        <div style={styles.comparisonContainer}>
          <div style={styles.comparison}>{this.getChartComparison()}</div>
        </div>
        <ReportSummaryComponent
          adjustContainerHeight={adjustContainerHeight}
          chartName={chartName}
          containerHeight={containerHeight}
          currentData={currentData}
          forecastData={forecastData}
          forecastConeData={forecastConeData}
          formatOptions={trend.formatOptions}
          formatter={chartFormatter || formatUnits}
          height={height}
          previousData={previousData}
          showForecast={trend.computedForecastItem !== undefined}
          showSupplementaryLabel={showSupplementaryLabel}
          showUsageLegendLabel={details.showUsageLegendLabel}
          units={this.getUnits()}
        />
      </>
    );
  };

  private getForecastData = (report: Report, computedForecastItem: string = 'cost') => {
    const { forecast, trend } = this.props;
    const { currentComparison } = this.state;

    // Todo: Add cumulative / daily prop
    const daily = currentComparison === Comparison.daily;
    const datumType = daily ? DatumType.rolling : trend.datumType;

    const computedForecast = getComputedForecast(forecast, report, computedForecastItem, datumType);

    const forecastData = transformForecast(computedForecast, datumType, computedForecastItem);
    const forecastConeData = transformForecastCone(computedForecast, datumType, computedForecastItem);

    return { forecastData, forecastConeData };
  };

  // This chart displays cumulative cost only
  private getTrendChart = (
    containerHeight: number,
    height: number,
    adjustContainerHeight: boolean = false,
    showSupplementaryLabel: boolean = false
  ) => {
    const { chartFormatter, chartName, currentReport, details, intl, previousReport, trend } = this.props;

    const computedReportItem = trend.computedReportItem || 'cost'; // cost, supplementary cost, etc.
    const computedReportItemValue = trend.computedReportItemValue; // infrastructure usage cost
    const title = intl.formatMessage(trend.titleKey, { units: this.getFormattedUnits() });

    // Cost data
    const currentData = transformReport(
      currentReport,
      trend.datumType,
      'date',
      computedReportItem,
      computedReportItemValue
    );
    const previousData = transformReport(
      previousReport,
      trend.datumType,
      'date',
      computedReportItem,
      computedReportItemValue
    );

    // Forecast data
    const { forecastData, forecastConeData } = this.getForecastData(currentReport, trend.computedForecastItem);

    return (
      <ReportSummaryTrend
        adjustContainerHeight={adjustContainerHeight}
        containerHeight={containerHeight}
        chartName={chartName}
        currentData={currentData}
        forecastData={forecastData}
        forecastConeData={forecastConeData}
        formatOptions={trend.formatOptions}
        formatter={chartFormatter || formatUnits}
        height={height}
        previousData={previousData}
        showForecast={trend.computedForecastItem !== undefined}
        showSupplementaryLabel={showSupplementaryLabel}
        showUsageLegendLabel={details.showUsageLegendLabel}
        title={title}
        units={this.getUnits()}
      />
    );
  };

  // This chart displays usage and requests
  private getUsageChart = (height: number, adjustContainerHeight: boolean = false) => {
    const { chartFormatter, chartName, currentReport, intl, previousReport, trend } = this.props;

    const title = intl.formatMessage(trend.titleKey, {
      units: this.getFormattedUnits(),
    });

    // Request data
    const currentRequestData = transformReport(currentReport, trend.datumType, 'date', 'request');
    const previousRequestData = transformReport(previousReport, trend.datumType, 'date', 'request');

    // Usage data
    const currentUsageData = transformReport(currentReport, trend.datumType, 'date', 'usage');
    const previousUsageData = transformReport(previousReport, trend.datumType, 'date', 'usage');

    return (
      <ReportSummaryUsage
        adjustContainerHeight={adjustContainerHeight}
        chartName={chartName}
        containerHeight={chartStyles.containerUsageHeight}
        currentRequestData={currentRequestData}
        currentUsageData={currentUsageData}
        formatOptions={trend.formatOptions}
        formatter={chartFormatter || formatUnits}
        height={height}
        previousRequestData={previousRequestData}
        previousUsageData={previousUsageData}
        title={title}
      />
    );
  };

  private getDetails = () => {
    const { chartType, currentReport, details, reportType, trend } = this.props;
    const computedReportItem = trend.computedReportItem || 'cost';
    const computedReportItemValue = trend.computedReportItemValue || 'total';

    return (
      <ReportSummaryDetails
        chartType={chartType}
        computedReportItem={computedReportItem}
        computedReportItemValue={computedReportItemValue}
        costLabel={this.getDetailsLabel(details.costKey)}
        formatOptions={details.formatOptions}
        report={currentReport}
        reportType={reportType}
        requestLabel={this.getDetailsLabel(details.requestKey)}
        showTooltip={details.showTooltip}
        showUnits={details.showUnits}
        showUsageFirst={details.showUsageFirst}
        units={this.getUnits()}
        usageFormatOptions={details.usageFormatOptions}
        usageLabel={this.getDetailsLabel(details.usageKey)}
      />
    );
  };

  private getDetailsLabel = (key: MessageDescriptor) => {
    const { intl } = this.props;
    return key ? intl.formatMessage(key) : undefined;
  };

  private getDetailsLink = () => {
    const { currentTab, details } = this.props;

    if (details.viewAllPath) {
      return <Link to={this.buildDetailsLink(currentTab)}>{this.getDetailsLinkTitle(currentTab)}</Link>;
    }
    return null;
  };

  private getDetailsLinkTitle = (tab: string) => {
    const { getIdKeyForTab, intl } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return intl.formatMessage(messages.groupByAll, { value: key, count: 2 });
  };

  private getFormattedUnits = () => {
    const { intl, trend } = this.props;

    const computedReportItem = trend.computedReportItem || 'cost';
    const units = this.getUnits();

    if (computedReportItem === ComputedReportItemType.usage) {
      return intl.formatMessage(messages.units, { units: unitsLookupKey(units) });
    }
    return intl.formatMessage(messages.currencyUnits, { units });
  };

  private getHorizontalLayout = () => {
    const {
      containerAltHeight = chartStyles.containerAltHeight,
      chartAltHeight = chartStyles.chartAltHeight,
      currentReportFetchStatus,
      details,
    } = this.props;

    return (
      <ReportSummaryAlt
        detailsLink={this.getDetailsLink()}
        status={currentReportFetchStatus}
        tabs={this.getTabs()}
        title={this.getTitle()}
      >
        {this.getDetails()}
        {this.getChart(containerAltHeight, chartAltHeight, details.adjustContainerHeight)}
      </ReportSummaryAlt>
    );
  };

  private getRecommendationsSummary = () => {
    const { rosFetchStatus, rosReport, titleKey } = this.props;

    return <RecommendationsSummary status={rosFetchStatus} rosReport={rosReport} title={titleKey} />;
  };

  private getTab = (tab: string, index: number) => {
    const { getIdKeyForTab, tabsReport, tabsReportFetchStatus } = this.props;
    const currentTab: any = getIdKeyForTab(tab);

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        title={<TabTitleText>{this.getTabTitle(tab)}</TabTitleText>}
      >
        <div style={styles.tabItems}>
          <ReportSummaryItems
            idKey={currentTab}
            key={`${currentTab}-items`}
            report={tabsReport}
            status={tabsReportFetchStatus}
          >
            {({ items }) => items.map(reportItem => this.getTabItem(tab, reportItem))}
          </ReportSummaryItems>
        </div>
      </Tab>
    );
  };

  private getTabItem = (tab: string, reportItem) => {
    const { availableTabs, getIdKeyForTab, tabsReport, topItems, trend } = this.props;
    const { activeTabKey } = this.state;

    const currentTab = getIdKeyForTab(tab);
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);
    const computedReportItem = trend.computedReportItem || 'cost';
    const computedReportItemValue = trend.computedReportItemValue || 'total';

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
        tabsReport.meta.total[computedReportItem][computedReportItemValue]
      ) {
        totalValue = tabsReport.meta.total[computedReportItem][computedReportItemValue].value;
      }
    }

    if (activeTab === currentTab) {
      return (
        <ReportSummaryItem
          formatOptions={topItems ? topItems.formatOptions : undefined}
          key={`${reportItem.id}-item`}
          label={reportItem.label ? reportItem.label.toString() : ''}
          totalValue={totalValue}
          units={this.getUnits()}
          value={reportItem[computedReportItem][computedReportItemValue].value}
        />
      );
    } else {
      return null;
    }
  };

  private getTabs = () => {
    const { availableTabs } = this.props;
    return (
      <Tabs isFilled activeKey={this.state.activeTabKey} onSelect={this.handleTabClick}>
        {availableTabs.map((tab, index) => this.getTab(tab, index))}
      </Tabs>
    );
  };

  private getTabTitle = (tab: string) => {
    const { getIdKeyForTab, intl } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return intl.formatMessage(messages.groupByTop, { value: key, count: 2 });
  };

  private getTitle = () => {
    const { intl, titleKey } = this.props;

    return intl.formatMessage(titleKey);
  };

  private getUnits = () => {
    const { currentReport, details, trend } = this.props;
    const computedReportItem = trend.computedReportItem || 'cost';
    const computedReportItemValue = trend.computedReportItemValue || 'total';

    if (details.units) {
      return details.units;
    }
    if (!currentReport) {
      return '';
    }

    const hasTotal = currentReport && currentReport.meta && currentReport.meta.total;
    if (computedReportItem === ComputedReportItemType.usage) {
      const hasUsage = hasTotal && currentReport.meta.total.usage;
      return hasUsage ? currentReport.meta.total.usage.units : undefined;
    } else {
      const hasCost =
        hasTotal &&
        currentReport.meta.total[computedReportItem] &&
        currentReport.meta.total[computedReportItem][computedReportItemValue];
      return hasCost ? currentReport.meta.total[computedReportItem][computedReportItemValue].units : 'USD';
    }
  };

  private getVerticalLayout = () => {
    const { availableTabs, currentReportFetchStatus, details } = this.props;

    return (
      <ReportSummary detailsLink={this.getDetailsLink()} status={currentReportFetchStatus} title={this.getTitle()}>
        {this.getDetails()}
        {this.getChart(chartStyles.containerTrendHeight, chartStyles.chartHeight, details.adjustContainerHeight)}
        {Boolean(availableTabs) && <div style={styles.tabs}>{this.getTabs()}</div>}
      </ReportSummary>
    );
  };

  private handleComparisonClick = (value: string) => {
    this.setState({ currentComparison: value });
  };

  private handleTabClick = (event, tabIndex: number) => {
    const { availableTabs, id, updateTab } = this.props;
    const tab = availableTabs[tabIndex];

    updateTab(id, tab);
    this.setState({ activeTabKey: tabIndex });
  };

  public render() {
    const { details, isRosFeatureEnabled } = this.props;
    if (details.showRecommendations) {
      return isRosFeatureEnabled ? this.getRecommendationsSummary() : null;
    }
    return details.showHorizontal ? this.getHorizontalLayout() : this.getVerticalLayout();
  }
}

export default DashboardWidgetBase;
