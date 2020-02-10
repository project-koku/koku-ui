import { Tab, Tabs } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/azureQuery';
import { AzureReport, AzureReportType } from 'api/azureReports';
import { transformAzureReport } from 'components/charts/commonChart/chartUtils';
import {
  AzureReportSummary,
  AzureReportSummaryAlt,
  AzureReportSummaryDetails,
  AzureReportSummaryItem,
  AzureReportSummaryItems,
  AzureReportSummaryTrend,
} from 'components/reports/azureReportSummary';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  azureDashboardActions,
  azureDashboardSelectors,
  AzureDashboardTab,
  AzureDashboardWidget as AzureDashboardWidgetStatic,
} from 'store/azureDashboard';
import { azureReportsSelectors } from 'store/azureReports';
import { createMapStateToProps } from 'store/common';
import { GetComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './azureDashboardWidget.styles';

interface AzureDashboardWidgetOwnProps {
  widgetId: number;
}

interface AzureDashboardWidgetStateProps extends AzureDashboardWidgetStatic {
  currentQuery: string;
  currentReport: AzureReport;
  currentReportFetchStatus: number;
  previousQuery: string;
  previousReport: AzureReport;
  tabsQuery: string;
  tabsReport: AzureReport;
  tabsReportFetchStatus: number;
}

interface AzureDashboardWidgetDispatchProps {
  fetchReports: typeof azureDashboardActions.fetchWidgetReports;
  updateTab: typeof azureDashboardActions.changeWidgetTab;
}

type AzureDashboardWidgetProps = AzureDashboardWidgetOwnProps &
  AzureDashboardWidgetStateProps &
  AzureDashboardWidgetDispatchProps &
  InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: AzureDashboardTab
): GetComputedAzureReportItemsParams['idKey'] => {
  switch (tab) {
    case AzureDashboardTab.service_names:
      return 'service_name';
    case AzureDashboardTab.subscription_guids:
      return 'subscription_guid';
    case AzureDashboardTab.resource_locations:
      return 'resource_location';
    case AzureDashboardTab.instanceType:
      return 'instance_type';
  }
};

class AzureDashboardWidgetBase extends React.Component<
  AzureDashboardWidgetProps
> {
  public state = {
    activeTabKey: 0,
  };

  public componentDidMount() {
    const { availableTabs, fetchReports, id, updateTab, widgetId } = this.props;
    updateTab(id, availableTabs[0]);
    fetchReports(widgetId);
  }

  private buildDetailsLink = (tab: AzureDashboardTab) => {
    const currentTab = getIdKeyForTab(tab);
    return `/azure?${getQuery({
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
    const currentData = transformAzureReport(currentReport, trend.type);
    const previousData = transformAzureReport(previousReport, trend.type);
    const units = this.getUnits();

    return (
      <AzureReportSummaryTrend
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
        units={units}
      />
    );
  };

  private getDetails = () => {
    const { currentReport, details, isUsageFirst, reportType } = this.props;
    const units = this.getUnits();
    return (
      <AzureReportSummaryDetails
        costLabel={this.getDetailsLabel(details.costKey, units)}
        formatOptions={details.formatOptions}
        formatValue={formatValue}
        report={currentReport}
        reportType={reportType}
        showUnits={details.showUnits}
        showUsageFirst={isUsageFirst}
        usageFormatOptions={details.usageFormatOptions}
        units={units}
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

  private getDetailsLinkTitle = (tab: AzureDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private getHorizontalLayout = () => {
    const { currentReportFetchStatus } = this.props;
    return (
      <AzureReportSummaryAlt
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
      </AzureReportSummaryAlt>
    );
  };

  private getSubTitle = () => {
    const { t } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'D');
    const startDate = formatDate(startOfMonth(today), 'D');

    return t('azure_dashboard.widget_subtitle', {
      count: getDate(today),
      endDate,
      month,
      startDate,
    });
  };

  private getTab = (tab: AzureDashboardTab, index: number) => {
    const { tabsReport, tabsReportFetchStatus } = this.props;
    const currentTab = getIdKeyForTab(tab);

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        title={this.getTabTitle(tab)}
      >
        <div className={css(styles.tabItems)}>
          <AzureReportSummaryItems
            idKey={currentTab}
            key={`${currentTab}-items`}
            report={tabsReport}
            status={tabsReportFetchStatus}
          >
            {({ items }) =>
              items.map(reportItem => this.getTabItem(tab, reportItem))
            }
          </AzureReportSummaryItems>
        </div>
      </Tab>
    );
  };

  private getTabItem = (tab: AzureDashboardTab, reportItem) => {
    const {
      availableTabs,
      details,
      reportType,
      tabsReport,
      topItems,
    } = this.props;
    const { activeTabKey } = this.state;

    const currentTab = getIdKeyForTab(tab);
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);

    const isCostReport =
      reportType === AzureReportType.cost ||
      reportType === AzureReportType.database ||
      reportType === AzureReportType.network;

    if (activeTab === currentTab) {
      return (
        <AzureReportSummaryItem
          key={`${reportItem.id}-item`}
          formatOptions={topItems.formatOptions}
          formatValue={formatValue}
          label={reportItem.label ? reportItem.label.toString() : ''}
          totalValue={
            isCostReport
              ? tabsReport.meta.total.cost.value
              : tabsReport.meta.total.usage.value
              ? tabsReport.meta.total.usage.value
              : (tabsReport.meta.total.usage as any)
          }
          units={details.units ? details.units : reportItem.units}
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

  private getTabTitle = (tab: AzureDashboardTab) => {
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
    const { currentReport, details, reportType } = this.props;

    if (details.units) {
      return details.units;
    }

    let units = '';
    if (currentReport && currentReport.meta && currentReport.meta.total) {
      if (
        reportType === AzureReportType.cost ||
        reportType === AzureReportType.database ||
        reportType === AzureReportType.network
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
      <AzureReportSummary
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
      </AzureReportSummary>
    );
  };

  private handleInsightsNavClick = () => {
    insights.chrome.appNavClick({ id: 'azure', secondaryNav: true });
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
  AzureDashboardWidgetOwnProps,
  AzureDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = azureDashboardSelectors.selectWidget(state, widgetId);
  const queries = azureDashboardSelectors.selectWidgetQueries(state, widgetId);
  return {
    ...widget,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: azureReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: azureReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
    previousReport: azureReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabsReport: azureReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    tabsReportFetchStatus: azureReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: AzureDashboardWidgetDispatchProps = {
  fetchReports: azureDashboardActions.fetchWidgetReports,
  updateTab: azureDashboardActions.changeWidgetTab,
};

const AzureDashboardWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(AzureDashboardWidgetBase)
);

export {
  AzureDashboardWidget,
  AzureDashboardWidgetBase,
  AzureDashboardWidgetProps,
};
