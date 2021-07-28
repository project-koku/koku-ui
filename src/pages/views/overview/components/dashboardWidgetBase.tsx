import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import { Forecast } from 'api/forecasts/forecast';
import { getQuery } from 'api/queries/awsQuery';
import { Report } from 'api/reports/report';
import {
  ChartType,
  ComputedReportItemType,
  transformForecast,
  transformForecastCone,
  transformReport,
} from 'components/charts/common/chartDatumUtils';
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
} from 'components/reports/reportSummary';
import { format, getMonth, startOfMonth } from 'date-fns';
import { cloneDeep } from 'lodash';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DashboardChartType, DashboardWidget } from 'store/dashboard/common/dashboardCommon';
import { formatValue, unitLookupKey } from 'utils/formatValue';

import { ChartComparison } from './chartComparison';
import { chartStyles, styles } from './dashboardWidget.styles';

// eslint-disable-next-line no-shadow
const enum Comparison {
  cumulative = 'cumulative',
  daily = 'daily',
}

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
  forecast?: Forecast;
  previousQuery: string;
  previousReport: Report;
  tabsQuery: string;
  tabsReport: Report;
  tabsReportFetchStatus: number;
}

interface DashboardWidgetDispatchProps {
  fetchForecasts: (widgetId) => void;
  fetchReports: (widgetId) => void;
  updateTab: (id, availableTabs) => void;
}

type DashboardWidgetProps = DashboardWidgetOwnProps &
  DashboardWidgetStateProps &
  DashboardWidgetDispatchProps &
  WithTranslation;

class DashboardWidgetBase extends React.Component<DashboardWidgetProps> {
  public state = {
    activeTabKey: 0,
    currentComparison: Comparison.cumulative,
  };

  public componentDidMount() {
    const { availableTabs, fetchForecasts, fetchReports, id, trend, updateTab, widgetId } = this.props;

    if (availableTabs) {
      updateTab(id, availableTabs[0]);
    }
    if (fetchReports) {
      fetchReports(widgetId);
    }
    if (trend.computedForecastItem !== undefined) {
      fetchForecasts(widgetId);
    }
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

  private getChart = (containerHeight: number, height: number, adjustContainerHeight: boolean = false) => {
    const { chartType, trend } = this.props;
    if (chartType === DashboardChartType.dailyTrend) {
      return this.getDailyTrendChart(
        containerHeight,
        height,
        adjustContainerHeight,
        trend.showInfrastructureLabel,
        trend.showSupplementaryLabel
      );
    } else if (chartType === DashboardChartType.dailyCost) {
      return this.getDailyCostChart(containerHeight, height, adjustContainerHeight);
    } else if (chartType === DashboardChartType.trend) {
      return this.getTrendChart(
        containerHeight,
        height,
        adjustContainerHeight,
        trend.showInfrastructureLabel,
        trend.showSupplementaryLabel
      );
    } else if (chartType === DashboardChartType.usage) {
      return this.getUsageChart(height, adjustContainerHeight);
    } else {
      return null;
    }
  };

  private getChartComparison = () => {
    const { t, trend } = this.props;
    const { currentComparison } = this.state;

    const units = this.getUnits();
    const cumulativeTitle = t(trend.titleKey, { units: t(`units.${units}`) });
    const dailyTitle = t(trend.dailyTitleKey, { units: t(`units.${units}`) });

    const options = [
      { label: dailyTitle, value: Comparison.daily },
      { label: cumulativeTitle, value: Comparison.cumulative },
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
    const { currentReport, previousReport, trend } = this.props;
    const { currentComparison } = this.state;

    const computedReportItem = trend.computedReportItem; // cost, supplementary cost, etc.
    const computedReportItemValue = trend.computedReportItemValue; // infrastructure usage cost

    const daily = currentComparison === Comparison.daily;
    const type = daily ? ChartType.daily : trend.type;

    // Infrastructure data
    const currentInfrastructureData = transformReport(
      currentReport,
      type,
      'date',
      'infrastructure',
      computedReportItemValue
    );
    const previousInfrastructureData = transformReport(
      previousReport,
      type,
      'date',
      'infrastructure',
      computedReportItemValue
    );

    // Cost data
    const currentCostData = transformReport(currentReport, type, 'date', computedReportItem, computedReportItemValue);
    const previousCostData = transformReport(previousReport, type, 'date', computedReportItem, computedReportItemValue);

    // Forecast data
    const forecastData = this.getForecastData(currentReport, trend.computedForecastItem);
    const forecastInfrastructureData = this.getForecastData(currentReport, trend.computedForecastInfrastructureItem);

    const ReportSummaryComponent = daily ? ReportSummaryDailyCost : ReportSummaryCost;
    return (
      <>
        <div style={styles.comparison}>{this.getChartComparison()}</div>
        <ReportSummaryComponent
          adjustContainerHeight={adjustContainerHeight}
          containerHeight={containerHeight}
          currentCostData={currentCostData}
          currentInfrastructureCostData={currentInfrastructureData}
          forecastConeData={forecastData.forecastConeData}
          forecastData={forecastData.forecastData}
          forecastInfrastructureConeData={forecastInfrastructureData.forecastConeData}
          forecastInfrastructureData={forecastInfrastructureData.forecastData}
          formatDatumValue={formatValue}
          formatDatumOptions={trend.formatOptions}
          height={height}
          previousCostData={previousCostData}
          previousInfrastructureCostData={previousInfrastructureData}
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
    showInfrastructureLabel: boolean = false,
    showSupplementaryLabel: boolean = false
  ) => {
    const { currentReport, details, previousReport, trend } = this.props;
    const { currentComparison } = this.state;

    const units = this.getUnits();
    const computedReportItem = trend.computedReportItem; // cost, supplementary cost, etc.
    const computedReportItemValue = trend.computedReportItemValue; // infrastructure usage cost

    const daily = currentComparison === Comparison.daily;
    const type = daily ? ChartType.daily : trend.type;

    // Cost data
    const currentData = transformReport(currentReport, type, 'date', computedReportItem, computedReportItemValue);
    const previousData = transformReport(previousReport, type, 'date', computedReportItem, computedReportItemValue);

    // Forecast data
    const { forecastData, forecastConeData } = this.getForecastData(currentReport, trend.computedForecastItem);

    const ReportSummaryComponent = daily ? ReportSummaryDailyTrend : ReportSummaryTrend;
    return (
      <>
        <div style={styles.comparison}>{this.getChartComparison()}</div>
        <ReportSummaryComponent
          adjustContainerHeight={adjustContainerHeight}
          containerHeight={containerHeight}
          currentData={currentData}
          forecastData={forecastData}
          forecastConeData={forecastConeData}
          formatDatumValue={formatValue}
          formatDatumOptions={trend.formatOptions}
          height={height}
          previousData={previousData}
          showForecast={trend.computedForecastItem !== undefined}
          showInfrastructureLabel={showInfrastructureLabel}
          showSupplementaryLabel={showSupplementaryLabel}
          showUsageLegendLabel={details.showUsageLegendLabel}
          units={units}
        />
      </>
    );
  };

  private getForecastData = (report: Report, computedForecastItem: string = 'cost') => {
    const { forecast, trend } = this.props;
    const { currentComparison } = this.state;

    // Todo: Add cumulative / daily prop
    const daily = currentComparison === Comparison.daily;
    const type = daily ? ChartType.daily : trend.type;

    let forecastData;
    let forecastConeData;

    if (computedForecastItem) {
      const newForecast = cloneDeep(forecast);
      if (newForecast) {
        newForecast.data = [];
      }
      if (forecast && report && report.data) {
        const total =
          report.meta && report.meta.total && report.meta.total[computedForecastItem]
            ? report.meta.total[computedForecastItem].total.value
            : 0;

        // Find last currentData date with values
        const reportedValues = report.data.filter(val => val.values.length);
        const lastReported = reportedValues[reportedValues.length - 1]
          ? reportedValues[reportedValues.length - 1].date
          : undefined;

        // Remove overlapping forecast dates, if any
        if (forecast && forecast.data && forecast.data.length > 0) {
          const lastReportedDate = new Date(lastReported);
          const lastReportedMonth = lastReportedDate.getMonth() + 1;
          for (const item of forecast.data) {
            const forecastDate = new Date(item.date);
            const forecastMonth = forecastDate.getMonth() + 1;

            // Ensure month match. AWS forecast may begin with "2020-12-04", but ends on "2021-01-01"
            if (forecastDate > lastReportedDate && lastReportedMonth === forecastMonth) {
              newForecast.data.push(item);
            }
          }

          // For cumulative data, forecast values should begin at last reported total with zero confidence values
          if (type === ChartType.rolling) {
            const firstReported =
              forecast.data[0].values && forecast.data[0].values.length > 0
                ? forecast.data[0].values[0].date
                : undefined;

            const date = this.getNumberOfDays(lastReported, firstReported) === 1 ? lastReported : firstReported;

            newForecast.data.unshift({
              date,
              values: [
                {
                  date,
                  cost: {
                    confidence_max: {
                      value: 0,
                    },
                    confidence_min: {
                      value: 0,
                    },
                    total: {
                      value: total,
                      units: 'USD',
                    },
                  },
                  infrastructure: {
                    confidence_max: {
                      value: 0,
                    },
                    confidence_min: {
                      value: 0,
                    },
                    total: {
                      value: total,
                      units: 'USD',
                    },
                  },
                  supplementary: {
                    confidence_max: {
                      value: 0,
                    },
                    confidence_min: {
                      value: 0,
                    },
                    total: {
                      value: total,
                      units: 'USD',
                    },
                  },
                },
              ],
            });
          }
        }
      }
      forecastData = transformForecast(newForecast, type, computedForecastItem);
      forecastConeData = transformForecastCone(newForecast, type, computedForecastItem);
    }
    return { forecastData, forecastConeData };
  };

  private getNumberOfDays = (start: string, end: string) => {
    const date1 = new Date(start);
    const date2 = new Date(end);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
  };

  // This chart displays cumulative cost only
  private getTrendChart = (
    containerHeight: number,
    height: number,
    adjustContainerHeight: boolean = false,
    showInfrastructureLabel: boolean = false,
    showSupplementaryLabel: boolean = false
  ) => {
    const { currentReport, details, previousReport, t, trend } = this.props;

    const units = this.getUnits();
    const title = t(trend.titleKey, { units: t(`units.${units}`) });
    const computedReportItem = trend.computedReportItem; // cost, supplementary cost, etc.
    const computedReportItemValue = trend.computedReportItemValue; // infrastructure usage cost

    // Cost data
    const currentData = transformReport(currentReport, trend.type, 'date', computedReportItem, computedReportItemValue);
    const previousData = transformReport(
      previousReport,
      trend.type,
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
        currentData={currentData}
        forecastData={forecastData}
        forecastConeData={forecastConeData}
        formatDatumValue={formatValue}
        formatDatumOptions={trend.formatOptions}
        height={height}
        previousData={previousData}
        showForecast={trend.computedForecastItem !== undefined}
        showInfrastructureLabel={showInfrastructureLabel}
        showSupplementaryLabel={showSupplementaryLabel}
        showUsageLegendLabel={details.showUsageLegendLabel}
        title={title}
        units={units}
      />
    );
  };

  // This chart displays usage and requests
  private getUsageChart = (height: number, adjustContainerHeight: boolean = false) => {
    const { currentReport, previousReport, t, trend } = this.props;

    const units = this.getUnits();
    const title = t(trend.titleKey, { units: t(`units.${units}`) });

    // Request data
    const currentRequestData = transformReport(currentReport, trend.type, 'date', 'request');
    const previousRequestData = transformReport(previousReport, trend.type, 'date', 'request');

    // Usage data
    const currentUsageData = transformReport(currentReport, trend.type, 'date', 'usage');
    const previousUsageData = transformReport(previousReport, trend.type, 'date', 'usage');

    return (
      <ReportSummaryUsage
        adjustContainerHeight={adjustContainerHeight}
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
    const { chartType, currentReport, details, reportType, trend } = this.props;
    const computedReportItem = trend.computedReportItem || 'cost';
    const computedReportItemValue = trend.computedReportItemValue || 'total';
    const units = this.getUnits();

    return (
      <ReportSummaryDetails
        chartType={chartType}
        computedReportItem={computedReportItem}
        computedReportItemValue={computedReportItemValue}
        costLabel={this.getDetailsLabel(details.costKey, units)}
        formatOptions={details.formatOptions}
        formatValue={formatValue}
        report={currentReport}
        reportType={reportType}
        requestLabel={this.getDetailsLabel(details.requestKey, units)}
        showTooltip={details.showTooltip}
        showUnits={details.showUnits}
        showUsageFirst={details.showUsageFirst}
        units={details.units}
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
      return <Link to={this.buildDetailsLink(currentTab)}>{this.getDetailsLinkTitle(currentTab)}</Link>;
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

  private getTab = <T extends DashboardWidget<any>>(tab: T, index: number) => {
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

  private getTabItem = <T extends DashboardWidget<any>>(tab: T, reportItem) => {
    const { availableTabs, details, getIdKeyForTab, tabsReport, topItems, trend } = this.props;
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
          key={`${reportItem.id}-item`}
          formatOptions={topItems.formatOptions}
          formatValue={formatValue}
          label={reportItem.label ? reportItem.label.toString() : ''}
          totalValue={totalValue}
          units={details.units ? details.units : this.getUnits()}
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

  private getTabTitle = <T extends DashboardWidget<any>>(tab: T) => {
    const { getIdKeyForTab, t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.top', { groupBy: key });
  };

  private getTitle = () => {
    const { t, titleKey } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = format(today, 'Do');
    const startDate = format(startOfMonth(today), 'Do');

    return t(titleKey, { endDate, month, startDate });
  };

  private getUnits = () => {
    const { currentReport, details, trend } = this.props;
    const computedReportItem = trend.computedReportItem || 'cost';
    const computedReportItemValue = trend.computedReportItemValue || 'total';

    if (details.units) {
      return details.units;
    }

    let units;
    const hasTotal = currentReport && currentReport.meta && currentReport.meta.total;
    if (computedReportItem === ComputedReportItemType.usage) {
      const hasUsage = hasTotal && currentReport.meta.total.usage;
      units = hasUsage ? unitLookupKey(currentReport.meta.total.usage.units) : '';
    } else {
      const hasCost =
        hasTotal &&
        currentReport.meta.total[computedReportItem] &&
        currentReport.meta.total[computedReportItem][computedReportItemValue];
      units = hasCost ? unitLookupKey(currentReport.meta.total[computedReportItem][computedReportItemValue].units) : '';
    }
    return units;
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
    return details.showHorizontal ? this.getHorizontalLayout() : this.getVerticalLayout();
  }
}

export { DashboardWidgetBase, DashboardWidgetProps, DashboardWidgetOwnProps, DashboardWidgetStateProps };
