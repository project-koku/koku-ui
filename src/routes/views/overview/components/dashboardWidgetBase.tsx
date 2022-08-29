import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import { Forecast } from 'api/forecasts/forecast';
import { getQuery } from 'api/queries/awsQuery';
import { Report } from 'api/reports/report';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import React from 'react';
import { WrappedComponentProps } from 'react-intl';
import { Link } from 'react-router-dom';
import {
  ChartType,
  ComputedReportItemType,
  transformForecast,
  transformForecastCone,
  transformReport,
} from 'routes/views/components/charts/common/chartDatumUtils';
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
import { DashboardChartType, DashboardWidget } from 'store/dashboard/common/dashboardCommon';
import { formatCurrency, formatUnits, unitsLookupKey } from 'utils/format';

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
  costType?: string;
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
  WrappedComponentProps;

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

  public componentDidUpdate(prevProps: DashboardWidgetProps) {
    const { costType, fetchReports, fetchForecasts, trend, widgetId } = this.props;

    if (prevProps.costType !== costType) {
      fetchReports(widgetId);
      if (trend.computedForecastItem !== undefined) {
        fetchForecasts(widgetId);
      }
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
        <div style={styles.comparisonContainer}>
          <div style={styles.comparison}>{this.getChartComparison()}</div>
        </div>
        <ReportSummaryComponent
          adjustContainerHeight={adjustContainerHeight}
          containerHeight={containerHeight}
          currentCostData={currentCostData}
          currentInfrastructureCostData={currentInfrastructureData}
          forecastConeData={forecastData.forecastConeData}
          forecastData={forecastData.forecastData}
          forecastInfrastructureConeData={forecastInfrastructureData.forecastConeData}
          forecastInfrastructureData={forecastInfrastructureData.forecastData}
          formatOptions={trend.formatOptions}
          formatter={chartFormatter || formatCurrency}
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
    const { chartFormatter, currentReport, details, previousReport, trend } = this.props;
    const { currentComparison } = this.state;

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
        <div style={styles.comparisonContainer}>
          <div style={styles.comparison}>{this.getChartComparison()}</div>
        </div>
        <ReportSummaryComponent
          adjustContainerHeight={adjustContainerHeight}
          containerHeight={containerHeight}
          currentData={currentData}
          forecastData={forecastData}
          forecastConeData={forecastConeData}
          formatOptions={trend.formatOptions}
          formatter={chartFormatter || formatUnits}
          height={height}
          previousData={previousData}
          showForecast={trend.computedForecastItem !== undefined}
          showInfrastructureLabel={showInfrastructureLabel}
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
        const units =
          report.meta && report.meta.total && report.meta.total[computedForecastItem]
            ? report.meta.total[computedForecastItem].total.units
            : 'USD';

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
                      units,
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
                      units,
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
                      units,
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
    const { chartFormatter, currentReport, details, intl, previousReport, trend } = this.props;

    const computedReportItem = trend.computedReportItem || 'cost'; // cost, supplementary cost, etc.
    const computedReportItemValue = trend.computedReportItemValue; // infrastructure usage cost
    const title = intl.formatMessage(trend.titleKey, { units: this.getFormattedUnits() });

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
        formatOptions={trend.formatOptions}
        formatter={chartFormatter || formatUnits}
        height={height}
        previousData={previousData}
        showForecast={trend.computedForecastItem !== undefined}
        showInfrastructureLabel={showInfrastructureLabel}
        showSupplementaryLabel={showSupplementaryLabel}
        showUsageLegendLabel={details.showUsageLegendLabel}
        title={title}
        units={this.getUnits()}
      />
    );
  };

  // This chart displays usage and requests
  private getUsageChart = (height: number, adjustContainerHeight: boolean = false) => {
    const { chartFormatter, currentReport, intl, previousReport, trend } = this.props;

    const title = intl.formatMessage(trend.titleKey, {
      units: this.getFormattedUnits(),
    });

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

  private getDetailsLinkTitle = <T extends DashboardWidget<any>>(tab: T) => {
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

  private getTabTitle = <T extends DashboardWidget<any>>(tab: T) => {
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
