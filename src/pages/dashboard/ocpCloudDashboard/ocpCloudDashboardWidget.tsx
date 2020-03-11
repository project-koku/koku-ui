import { Tab, Tabs } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/ocpCloudQuery';
import { OcpCloudReport, OcpCloudReportType } from 'api/ocpCloudReports';
import { transformReport } from 'components/charts/common/chartUtils';
import {
  OcpCloudReportSummary,
  OcpCloudReportSummaryAlt,
  OcpCloudReportSummaryDetails,
  OcpCloudReportSummaryItem,
  OcpCloudReportSummaryItems,
  OcpCloudReportSummaryTrend,
  OcpCloudReportSummaryUsage,
} from 'components/reports/ocpCloudReportSummary';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createMapStateToProps } from 'store/common';
import {
  ocpCloudDashboardActions,
  ocpCloudDashboardSelectors,
  OcpCloudDashboardTab,
  OcpCloudDashboardWidget as OcpCloudDashboardWidgetStatic,
} from 'store/dashboard/ocpCloudDashboard';
import { ocpCloudReportsSelectors } from 'store/reports/ocpCloudReports';
import { GetComputedOcpCloudReportItemsParams } from 'utils/computedReport/getComputedOcpCloudReportItems';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './ocpCloudDashboardWidget.styles';

interface OcpCloudDashboardWidgetOwnProps {
  widgetId: number;
}

interface OcpCloudDashboardWidgetStateProps
  extends OcpCloudDashboardWidgetStatic {
  currentQuery: string;
  currentReport: OcpCloudReport;
  currentReportFetchStatus: number;
  previousQuery: string;
  previousReport: OcpCloudReport;
  tabsQuery: string;
  tabsReport: OcpCloudReport;
  tabsReportFetchStatus: number;
}

interface OcpCloudDashboardWidgetDispatchProps {
  fetchReports: typeof ocpCloudDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpCloudDashboardActions.changeWidgetTab;
}

type OcpCloudDashboardWidgetProps = OcpCloudDashboardWidgetOwnProps &
  OcpCloudDashboardWidgetStateProps &
  OcpCloudDashboardWidgetDispatchProps &
  InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: OcpCloudDashboardTab
): GetComputedOcpCloudReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpCloudDashboardTab.clusters:
      return 'cluster';
    case OcpCloudDashboardTab.nodes:
      return 'node';
    case OcpCloudDashboardTab.projects:
      return 'project';
  }
};

class OcpCloudDashboardWidgetBase extends React.Component<
  OcpCloudDashboardWidgetProps
> {
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

  private buildDetailsLink = (tab: OcpCloudDashboardTab) => {
    const currentTab = getIdKeyForTab(tab);
    return `/ocp-cloud?${getQuery({
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
    const {
      currentReport,
      details,
      previousReport,
      reportType,
      t,
      trend,
    } = this.props;

    const costReportType =
      reportType === OcpCloudReportType.cost ||
      reportType === OcpCloudReportType.database ||
      reportType === OcpCloudReportType.network;
    const reportItem = costReportType ? 'cost' : 'usage';
    const currentUsageData = transformReport(
      currentReport,
      trend.type,
      'date',
      reportItem
    );
    const previousUsageData = transformReport(
      previousReport,
      trend.type,
      'date',
      reportItem
    );
    const currentRequestData =
      reportType !== OcpCloudReportType.cost
        ? transformReport(currentReport, trend.type, 'date', 'request')
        : undefined;
    const previousRequestData =
      reportType !== OcpCloudReportType.cost
        ? transformReport(previousReport, trend.type, 'date', 'request')
        : undefined;
    const units = this.getUnits();

    return (
      <>
        {Boolean(
          reportType === OcpCloudReportType.cost ||
            reportType === OcpCloudReportType.database ||
            reportType === OcpCloudReportType.instanceType ||
            reportType === OcpCloudReportType.network ||
            reportType === OcpCloudReportType.storage
        ) ? (
          <OcpCloudReportSummaryTrend
            adjustContainerHeight={adjustContainerHeight}
            containerHeight={containerHeight}
            currentData={currentUsageData}
            formatDatumValue={formatValue}
            formatDatumOptions={trend.formatOptions}
            height={height}
            previousData={previousUsageData}
            showUsageLegendLabel={details.showUsageLegendLabel}
            title={t(trend.titleKey, {
              units: t(`units.${units}`),
            })}
          />
        ) : (
          <OcpCloudReportSummaryUsage
            containerHeight={chartStyles.containerUsageHeight}
            currentRequestData={currentRequestData}
            currentUsageData={currentUsageData}
            formatDatumValue={formatValue}
            formatDatumOptions={trend.formatOptions}
            height={height}
            previousRequestData={previousRequestData}
            previousUsageData={previousUsageData}
            title={t(trend.titleKey, {
              units: t(`units.${units}`),
            })}
          />
        )}
      </>
    );
  };

  private getDetails = () => {
    const { currentReport, details, isUsageFirst, reportType } = this.props;
    const units = this.getUnits();
    return (
      <OcpCloudReportSummaryDetails
        costLabel={this.getDetailsLabel(details.costKey, units)}
        formatOptions={details.formatOptions}
        formatValue={formatValue}
        report={currentReport}
        reportType={reportType}
        requestFormatOptions={details.requestFormatOptions}
        requestLabel={this.getDetailsLabel(details.requestKey, units)}
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

  private getDetailsLinkTitle = (tab: OcpCloudDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private getHorizontalLayout = () => {
    const { currentReportFetchStatus } = this.props;
    return (
      <OcpCloudReportSummaryAlt
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
      </OcpCloudReportSummaryAlt>
    );
  };

  private getSubTitle = () => {
    const { t } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'D');
    const startDate = formatDate(startOfMonth(today), 'D');

    return t('ocp_cloud_dashboard.widget_subtitle', {
      count: getDate(today),
      endDate,
      month,
      startDate,
    });
  };

  private getTab = (tab: OcpCloudDashboardTab, index: number) => {
    const { tabsReport, tabsReportFetchStatus } = this.props;
    const currentTab = getIdKeyForTab(tab);

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        title={this.getTabTitle(tab)}
      >
        <div className={css(styles.tabItems)}>
          <OcpCloudReportSummaryItems
            idKey={currentTab}
            key={`${currentTab}-items`}
            report={tabsReport}
            status={tabsReportFetchStatus}
          >
            {({ items }) =>
              items.map(reportItem => this.getTabItem(tab, reportItem))
            }
          </OcpCloudReportSummaryItems>
        </div>
      </Tab>
    );
  };

  private getTabItem = (tab: OcpCloudDashboardTab, reportItem) => {
    const { availableTabs, reportType, tabsReport, topItems } = this.props;
    const { activeTabKey } = this.state;

    const currentTab = getIdKeyForTab(tab);
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);

    const isCostReport =
      reportType === OcpCloudReportType.cost ||
      reportType === OcpCloudReportType.database ||
      reportType === OcpCloudReportType.network;

    if (activeTab === currentTab) {
      return (
        <OcpCloudReportSummaryItem
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
          value={isCostReport ? reportItem.cost : reportItem.usage}
        />
      );
    } else {
      return null;
    }
  };

  private getTabs = () => {
    const { availableTabs } = this.props;

    if (availableTabs) {
      return (
        <Tabs
          isFilled
          activeKey={this.state.activeTabKey}
          onSelect={this.handleTabClick}
        >
          {availableTabs.map((tab, index) => this.getTab(tab, index))}
        </Tabs>
      );
    } else {
      return null;
    }
  };

  private getTabTitle = (tab: OcpCloudDashboardTab) => {
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
        reportType === OcpCloudReportType.cost ||
        reportType === OcpCloudReportType.database ||
        reportType === OcpCloudReportType.network
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
      <OcpCloudReportSummary
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
      </OcpCloudReportSummary>
    );
  };

  private handleInsightsNavClick = () => {
    insights.chrome.appNavClick({ id: 'ocp-cloud', secondaryNav: true });
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
  OcpCloudDashboardWidgetOwnProps,
  OcpCloudDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = ocpCloudDashboardSelectors.selectWidget(state, widgetId);
  const queries = ocpCloudDashboardSelectors.selectWidgetQueries(
    state,
    widgetId
  );
  return {
    ...widget,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: ocpCloudReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: ocpCloudReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
    previousReport: ocpCloudReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabsReport: ocpCloudReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    tabsReportFetchStatus: ocpCloudReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: OcpCloudDashboardWidgetDispatchProps = {
  fetchReports: ocpCloudDashboardActions.fetchWidgetReports,
  updateTab: ocpCloudDashboardActions.changeWidgetTab,
};

const OcpCloudDashboardWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(OcpCloudDashboardWidgetBase)
);

export {
  OcpCloudDashboardWidget,
  OcpCloudDashboardWidgetBase,
  OcpCloudDashboardWidgetProps,
};
