import { Tab, Tabs } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import { transformAwsReport } from 'components/charts/commonChart/chartUtils';
import {
  AwsReportSummary,
  AwsReportSummaryAlt,
  AwsReportSummaryDetails,
  AwsReportSummaryItem,
  AwsReportSummaryItems,
  AwsReportSummaryTrend,
} from 'components/reports/awsReportSummary';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  awsCloudDashboardActions,
  awsCloudDashboardSelectors,
  AwsCloudDashboardTab,
  AwsCloudDashboardWidget as AwsCloudDashboardWidgetStatic,
} from 'store/awsCloudDashboard';
import { awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps } from 'store/common';
import { GetComputedAwsReportItemsParams } from 'utils/computedReport/getComputedAwsReportItems';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './awsCloudDashboardWidget.styles';

interface AwsCloudDashboardWidgetOwnProps {
  widgetId: number;
}

interface AwsCloudDashboardWidgetStateProps
  extends AwsCloudDashboardWidgetStatic {
  currentQuery: string;
  currentReport: AwsReport;
  currentReportFetchStatus: number;
  previousQuery: string;
  previousReport: AwsReport;
  tabsQuery: string;
  tabsReport: AwsReport;
  tabsReportFetchStatus: number;
}

interface AwsCloudDashboardWidgetDispatchProps {
  fetchReports: typeof awsCloudDashboardActions.fetchWidgetReports;
  updateTab: typeof awsCloudDashboardActions.changeWidgetTab;
}

type AwsCloudDashboardWidgetProps = AwsCloudDashboardWidgetOwnProps &
  AwsCloudDashboardWidgetStateProps &
  AwsCloudDashboardWidgetDispatchProps &
  InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: AwsCloudDashboardTab
): GetComputedAwsReportItemsParams['idKey'] => {
  switch (tab) {
    case AwsCloudDashboardTab.services:
      return 'service';
    case AwsCloudDashboardTab.accounts:
      return 'account';
    case AwsCloudDashboardTab.regions:
      return 'region';
    case AwsCloudDashboardTab.instanceType:
      return 'instance_type';
  }
};

class AwsCloudDashboardWidgetBase extends React.Component<
  AwsCloudDashboardWidgetProps
> {
  public state = {
    activeTabKey: 0,
  };

  public componentDidMount() {
    const { availableTabs, fetchReports, id, updateTab, widgetId } = this.props;
    updateTab(id, availableTabs[0]);
    fetchReports(widgetId);
  }

  private buildDetailsLink = (tab: AwsCloudDashboardTab) => {
    const currentTab = getIdKeyForTab(tab);
    return `/aws?${getQuery({
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
    const { currentReport, details, previousReport, t, trend } = this.props;
    const currentData = transformAwsReport(currentReport, trend.type);
    const previousData = transformAwsReport(previousReport, trend.type);
    const units = this.getUnits();

    return (
      <AwsReportSummaryTrend
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

  private getDetails = () => {
    const { currentReport, details, isUsageFirst, reportType } = this.props;
    const units = this.getUnits();
    return (
      <AwsReportSummaryDetails
        costLabel={this.getDetailsLabel(details.costKey, units)}
        formatOptions={details.formatOptions}
        formatValue={formatValue}
        report={currentReport}
        reportType={reportType}
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

  private getDetailsLinkTitle = (tab: AwsCloudDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private getHorizontalLayout = () => {
    const { currentReportFetchStatus } = this.props;
    return (
      <AwsReportSummaryAlt
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
      </AwsReportSummaryAlt>
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

  private getTab = (tab: AwsCloudDashboardTab, index: number) => {
    const { tabsReport, tabsReportFetchStatus } = this.props;
    const currentTab = getIdKeyForTab(tab);

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        title={this.getTabTitle(tab)}
      >
        <div className={css(styles.tabItems)}>
          <AwsReportSummaryItems
            idKey={currentTab}
            key={`${currentTab}-items`}
            report={tabsReport}
            status={tabsReportFetchStatus}
          >
            {({ items }) =>
              items.map(reportItem => this.getTabItem(tab, reportItem))
            }
          </AwsReportSummaryItems>
        </div>
      </Tab>
    );
  };

  private getTabItem = (tab: AwsCloudDashboardTab, reportItem) => {
    const { availableTabs, reportType, tabsReport, topItems } = this.props;
    const { activeTabKey } = this.state;

    const currentTab = getIdKeyForTab(tab);
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);

    const isCostReport =
      reportType === AwsReportType.cost ||
      reportType === AwsReportType.database ||
      reportType === AwsReportType.network;

    if (activeTab === currentTab) {
      return (
        <AwsReportSummaryItem
          key={`${reportItem.id}-item`}
          formatOptions={topItems.formatOptions}
          formatValue={formatValue}
          label={reportItem.label ? reportItem.label.toString() : ''}
          totalValue={
            isCostReport
              ? tabsReport.meta.total.cost.value
              : tabsReport.meta.total.usage.value
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

  private getTabTitle = (tab: AwsCloudDashboardTab) => {
    const { t } = this.props;
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
    const { currentReport, reportType } = this.props;

    let units = '';
    if (currentReport && currentReport.meta && currentReport.meta.total) {
      if (
        reportType === AwsReportType.cost ||
        reportType === AwsReportType.database ||
        reportType === AwsReportType.network
      ) {
        units = currentReport.meta.total.cost
          ? unitLookupKey(currentReport.meta.total.cost.units)
          : '';
      } else {
        units = currentReport.meta.total.usage
          ? unitLookupKey(currentReport.meta.total.usage.units)
          : '';
      }
    }
    return units;
  };

  private getVerticalLayout = () => {
    const { availableTabs, currentReportFetchStatus } = this.props;
    return (
      <AwsReportSummary
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
      </AwsReportSummary>
    );
  };

  private handleInsightsNavClick = () => {
    insights.chrome.appNavClick({ id: 'aws', secondaryNav: true });
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

const mapStateToProps = createMapStateToProps<
  AwsCloudDashboardWidgetOwnProps,
  AwsCloudDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = awsCloudDashboardSelectors.selectWidget(state, widgetId);
  const queries = awsCloudDashboardSelectors.selectWidgetQueries(
    state,
    widgetId
  );
  return {
    ...widget,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: awsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: awsReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
    previousReport: awsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabsReport: awsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    tabsReportFetchStatus: awsReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: AwsCloudDashboardWidgetDispatchProps = {
  fetchReports: awsCloudDashboardActions.fetchWidgetReports,
  updateTab: awsCloudDashboardActions.changeWidgetTab,
};

const AwsCloudDashboardWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(AwsCloudDashboardWidgetBase)
);

export {
  AwsCloudDashboardWidget,
  AwsCloudDashboardWidgetBase,
  AwsCloudDashboardWidgetProps,
};
