import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import type { Forecast } from 'api/forecasts/forecast';
import { getQuery } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { ComputedReportItemType, DatumType, transformReport } from 'routes/components/charts/common/chartDatum';
import {
  getComputedForecast,
  transformForecast,
  transformForecastCone,
} from 'routes/components/charts/common/chartDatumForecast';
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
} from 'routes/components/reports/reportSummary';
import type { DashboardWidget } from 'store/dashboard/common/dashboardCommon';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { OcpDashboardTab } from 'store/dashboard/ocpDashboard';
import { formatCurrency, formatUnits, getCurrencySymbol, unitsLookupKey } from 'utils/format';
import { formatPath } from 'utils/paths';

import { ChartComparison } from './chartComparison';
import { chartStyles, styles } from './dashboardWidget.styles';

const enum Comparison {
  cumulative = 'cumulative',
  daily = 'daily',
}

export interface DashboardWidgetOwnProps {
  widgetId?: number;
}

export interface DashboardWidgetStateProps extends DashboardWidget {
  chartAltHeight?: number;
  costType?: string;
  currency?: string;
  currentReport?: Report;
  currentReportError?: AxiosError;
  currentReportFetchStatus?: number;
  forecast?: Forecast;
  forecastError?: AxiosError;
  forecastFetchStatus?: number;
  getIdKeyForTab?: (tab: string) => string;
  previousReport?: Report;
  previousReportError?: AxiosError;
  previousReportFetchStatus?: number;
  tabsReport?: Report;
  tabsReportError?: AxiosError;
  tabsReportFetchStatus?: number;
}

export interface DashboardWidgetState {
  activeTabKey?: number;
  currentComparison?: string;
}

interface DashboardWidgetDispatchProps {
  fetchForecasts: (widgetId) => void;
  fetchReports: (widgetId) => void;
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
    const { availableTabs, details, id, trend, updateTab } = this.props;

    if (availableTabs) {
      updateTab(id, availableTabs[0]);
    }
    if (trend && trend.computedForecastItem !== undefined) {
      this.updateForecasts();
    }
    if (!details.showOptimizations) {
      this.updateReports();
    }
  }

  public componentDidUpdate(prevProps: DashboardWidgetProps) {
    const { costType, currency, trend } = this.props;

    if (prevProps.costType !== costType || prevProps.currency !== currency) {
      this.updateReports();
      if (trend && trend.computedForecastItem !== undefined) {
        this.updateForecasts();
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
    })}`;
  };

  private getChart = (height: number) => {
    const { chartType, trend } = this.props;
    if (chartType === DashboardChartType.dailyTrend) {
      return this.getDailyTrendChart(height, trend.showSupplementaryLabel);
    } else if (chartType === DashboardChartType.dailyCost) {
      return this.getDailyCostChart(height);
    } else if (chartType === DashboardChartType.trend) {
      return this.getTrendChart(height, trend.showSupplementaryLabel);
    } else if (chartType === DashboardChartType.usage) {
      return this.getUsageChart(height);
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
  private getDailyCostChart = (height: number) => {
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
          baseHeight={height}
          currentCostData={currentCostData}
          forecastConeData={forecastData.forecastConeData}
          forecastData={forecastData.forecastData}
          formatOptions={trend.formatOptions}
          formatter={chartFormatter || formatCurrency}
          previousCostData={previousCostData}
          showForecast={trend.computedForecastItem !== undefined}
        />
      </>
    );
  };

  // This chart displays cumulative and daily cost
  private getDailyTrendChart = (height: number, showSupplementaryLabel: boolean = false) => {
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
          baseHeight={height}
          chartName={chartName}
          currentData={currentData}
          forecastData={forecastData}
          forecastConeData={forecastConeData}
          formatOptions={trend.formatOptions}
          formatter={chartFormatter || formatUnits}
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
  private getTrendChart = (height: number, showSupplementaryLabel: boolean = false) => {
    const { chartFormatter, chartName, currentReport, details, intl, previousReport, trend } = this.props;

    const computedReportItem = trend.computedReportItem || 'cost'; // cost, supplementary cost, etc.
    const computedReportItemValue = trend.computedReportItemValue; // infrastructure usage cost
    const title = intl.formatMessage(trend.titleKey, { units: this.getFormattedUnits() }) as string;

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
        baseHeight={height}
        chartName={chartName}
        currentData={currentData}
        forecastData={forecastData}
        forecastConeData={forecastConeData}
        formatOptions={trend.formatOptions}
        formatter={chartFormatter || formatUnits}
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
  private getUsageChart = (height: number) => {
    const { chartFormatter, chartName, currentReport, intl, previousReport, trend } = this.props;

    const title = intl.formatMessage(trend.titleKey, {
      units: this.getFormattedUnits(),
    }) as string;

    // Request data
    const currentRequestData = transformReport(currentReport, trend.datumType, 'date', 'request', 'total');
    const previousRequestData = transformReport(previousReport, trend.datumType, 'date', 'request', 'total');

    // Usage data
    const currentUsageData = transformReport(currentReport, trend.datumType, 'date', 'usage', 'total');
    const previousUsageData = transformReport(previousReport, trend.datumType, 'date', 'usage', 'total');

    return (
      <ReportSummaryUsage
        baseHeight={height}
        chartName={chartName}
        currentRequestData={currentRequestData}
        currentUsageData={currentUsageData}
        formatOptions={trend.formatOptions}
        formatter={chartFormatter || formatUnits}
        legendItemsPerRow={2}
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
    return getCurrencySymbol(units);
  };

  private getHorizontalLayout = () => {
    const { chartAltHeight = chartStyles.chartAltHeight, currentReportFetchStatus } = this.props;

    return (
      <ReportSummaryAlt
        detailsLink={this.getDetailsLink()}
        status={currentReportFetchStatus}
        tabs={this.getTabs()}
        title={this.getTitle()}
      >
        {this.getDetails()}
        {this.getChart(chartAltHeight)}
      </ReportSummaryAlt>
    );
  };

  private getOptimizationsSummary = () => {
    return (
      <AsyncComponent
        scope="costManagementRos"
        module="./OptimizationsSummary"
        linkPath={formatPath(routes.optimizationsDetails.path)}
      />
    );
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
    const computedReportItemValue =
      trend.costDistribution && tab === OcpDashboardTab.projects
        ? trend.costDistribution
        : trend.computedReportItemValue || 'total';

    let totalValue;
    if (computedReportItem === ComputedReportItemType.usage) {
      if (tabsReport?.meta?.total?.usage) {
        totalValue = tabsReport.meta.total.usage.value;
      }
    } else {
      if (
        tabsReport?.meta?.total &&
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

    if (computedReportItem === ComputedReportItemType.usage) {
      return currentReport?.meta?.total?.usage ? currentReport.meta.total.usage.units : undefined;
    } else {
      const hasCost = currentReport?.meta?.total?.[computedReportItem]?.[computedReportItemValue];
      return hasCost ? currentReport.meta.total[computedReportItem][computedReportItemValue].units : 'USD';
    }
  };

  private getVerticalLayout = () => {
    const { availableTabs, currentReportFetchStatus } = this.props;

    return (
      <ReportSummary detailsLink={this.getDetailsLink()} status={currentReportFetchStatus} title={this.getTitle()}>
        {this.getDetails()}
        {this.getChart(chartStyles.chartHeight)}
        {availableTabs && <div style={styles.tabs}>{this.getTabs()}</div>}
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

  private updateForecasts = () => {
    const { fetchForecasts, widgetId } = this.props;
    if (fetchForecasts) {
      fetchForecasts(widgetId);
    }
  };

  private updateReports = () => {
    const { fetchReports, widgetId } = this.props;
    if (fetchReports) {
      fetchReports(widgetId);
    }
  };

  public render() {
    const { details } = this.props;
    if (details.showOptimizations) {
      return this.getOptimizationsSummary();
    }
    return details.showHorizontal ? this.getHorizontalLayout() : this.getVerticalLayout();
  }
}

export default DashboardWidgetBase;
