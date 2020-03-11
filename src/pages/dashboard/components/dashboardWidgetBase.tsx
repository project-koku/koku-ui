import { Tab, Tabs } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/awsQuery';
import { Report } from 'api/reports';
import { transformAwsReport } from 'components/charts/common/chartUtils';
import {
  ReportSummary,
  ReportSummaryAlt,
  ReportSummaryDetails,
  ReportSummaryItem,
  ReportSummaryItems,
  ReportSummaryTrend,
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
  appNavPath: string;
  detailsPath: string;
  getIdKeyForTab: <T extends DashboardWidget>(tab: T) => string;
  widgetId: number;
}

interface DashboardWidgetStateProps extends DashboardWidget {
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

  private buildDetailsLink = <T extends DashboardWidget>(tab: T) => {
    const { detailsPath, getIdKeyForTab } = this.props;
    const currentTab = getIdKeyForTab(tab);
    return `${detailsPath}?${getQuery({
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
    if (chartType === DashboardChartType.trend) {
      return this.getTrendChart(containerHeight, height, adjustContainerHeight);
    } else if (chartType === DashboardChartType.usage) {
      return this.getUsageChart(containerHeight, height, adjustContainerHeight);
    } else {
      return null;
    }
  };

  private getTrendChart = (
    containerHeight: number,
    height: number,
    adjustContainerHeight: boolean = false
  ) => {
    const { currentReport, details, previousReport, t, trend } = this.props;
    const currentData = transformAwsReport(currentReport, trend.type);
    const previousData = transformAwsReport(previousReport, trend.type);
    const units = this.getUnits();

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
        title={t(trend.titleKey, {
          units: t(`units.${units}`),
        })}
      />
    );
  };

  private getUsageChart = (
    containerHeight: number,
    height: number,
    adjustContainerHeight: boolean = false
  ) => {
    return null; // Todo: See Ocp on cloud
  };

  private getDetails = () => {
    const {
      chartType,
      currentReport,
      details,
      isUsageFirst,
      perspective,
    } = this.props;
    const units = this.getUnits();
    return (
      <ReportSummaryDetails
        chartType={chartType}
        costLabel={this.getDetailsLabel(details.costKey, units)}
        formatOptions={details.formatOptions}
        formatValue={formatValue}
        perspective={perspective}
        report={currentReport}
        showUnits={details.showUnits}
        showUsageFirst={isUsageFirst}
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
    const { currentTab, isDetailsLink } = this.props;
    return (
      isDetailsLink && (
        <Link
          to={this.buildDetailsLink(currentTab)}
          onClick={this.handleInsightsNavClick}
        >
          {this.getDetailsLinkTitle(currentTab)}
        </Link>
      )
    );
  };

  private getDetailsLinkTitle = <T extends DashboardWidget>(tab: T) => {
    const { getIdKeyForTab, t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private getHorizontalLayout = () => {
    const { currentReportFetchStatus } = this.props;
    return (
      <ReportSummaryAlt
        detailsLink={this.getDetailsLink()}
        status={currentReportFetchStatus}
        subTitle={this.getSubTitle()}
        tabs={this.getTabs()}
        title={this.getTitle()}
      >
        {this.getDetails()}
        {this.getChart(
          chartStyles.containerAltHeight,
          chartStyles.chartAltHeight,
          true
        )}
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

  private getTab = <T extends DashboardWidget>(tab: T, index: number) => {
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

  private getTabItem = <T extends DashboardWidget>(tab: T, reportItem) => {
    const { availableTabs, getIdKeyForTab, tabsReport, topItems } = this.props;
    const { activeTabKey } = this.state;

    const currentTab = getIdKeyForTab(tab);
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);
    const isUsageReport =
      tabsReport &&
      tabsReport.meta &&
      tabsReport.meta.total &&
      tabsReport.meta.total.usage;

    if (activeTab === currentTab) {
      return (
        <ReportSummaryItem
          key={`${reportItem.id}-item`}
          formatOptions={topItems.formatOptions}
          formatValue={formatValue}
          label={reportItem.label ? reportItem.label.toString() : ''}
          totalValue={
            isUsageReport
              ? tabsReport.meta.total.usage.value
              : tabsReport.meta.total.cost.value
          }
          units={reportItem.units}
          value={reportItem.cost}
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

  private getTabTitle = <T extends DashboardWidget>(tab: T) => {
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
    const { currentReport } = this.props;

    let units = '';
    if (currentReport && currentReport.meta && currentReport.meta.total) {
      if (currentReport.meta.total.usage) {
        units = unitLookupKey(currentReport.meta.total.usage.units);
      } else {
        units = currentReport.meta.total.cost
          ? unitLookupKey(currentReport.meta.total.cost.units)
          : '';
      }
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
    const { appNavPath } = this.props;
    insights.chrome.appNavClick({ id: appNavPath, secondaryNav: true });
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
    const { isHorizontal = false } = this.props;
    return Boolean(isHorizontal)
      ? this.getHorizontalLayout()
      : this.getVerticalLayout();
  }
}

export { DashboardWidgetBase };
