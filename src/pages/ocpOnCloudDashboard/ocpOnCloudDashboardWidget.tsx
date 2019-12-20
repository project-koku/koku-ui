import { Tab, Tabs } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/ocpOnCloudQuery';
import { OcpOnCloudReport, OcpOnCloudReportType } from 'api/ocpOnCloudReports';
import { transformOcpOnCloudReport } from 'components/charts/commonChart/chartUtils';
import {
  OcpOnCloudReportSummary,
  OcpOnCloudReportSummaryAlt,
  OcpOnCloudReportSummaryDetails,
  OcpOnCloudReportSummaryItem,
  OcpOnCloudReportSummaryItems,
  OcpOnCloudReportSummaryTrend,
  OcpOnCloudReportSummaryUsage,
} from 'components/reports/ocpOnCloudReportSummary';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import getYear from 'date-fns/get_year';
import startOfMonth from 'date-fns/start_of_month';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createMapStateToProps } from 'store/common';
import {
  ocpOnCloudDashboardActions,
  ocpOnCloudDashboardSelectors,
  OcpOnCloudDashboardTab,
  OcpOnCloudDashboardWidget as OcpOnCloudDashboardWidgetStatic,
} from 'store/ocpOnCloudDashboard';
import { ocpOnCloudReportsSelectors } from 'store/ocpOnCloudReports';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { GetComputedOcpOnCloudReportItemsParams } from 'utils/getComputedOcpOnCloudReportItems';
import { chartStyles, styles } from './ocpOnCloudDashboardWidget.styles';

interface OcpOnCloudDashboardWidgetOwnProps {
  widgetId: number;
}

interface OcpOnCloudDashboardWidgetStateProps
  extends OcpOnCloudDashboardWidgetStatic {
  currentQuery: string;
  currentReport: OcpOnCloudReport;
  currentReportFetchStatus: number;
  previousQuery: string;
  previousReport: OcpOnCloudReport;
  tabsQuery: string;
  tabsReport: OcpOnCloudReport;
  tabsReportFetchStatus: number;
}

interface OcpOnCloudDashboardWidgetDispatchProps {
  fetchReports: typeof ocpOnCloudDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpOnCloudDashboardActions.changeWidgetTab;
}

type OcpOnCloudDashboardWidgetProps = OcpOnCloudDashboardWidgetOwnProps &
  OcpOnCloudDashboardWidgetStateProps &
  OcpOnCloudDashboardWidgetDispatchProps &
  InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: OcpOnCloudDashboardTab
): GetComputedOcpOnCloudReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpOnCloudDashboardTab.clusters:
      return 'cluster';
    case OcpOnCloudDashboardTab.nodes:
      return 'node';
    case OcpOnCloudDashboardTab.projects:
      return 'project';
  }
};

class OcpOnCloudDashboardWidgetBase extends React.Component<
  OcpOnCloudDashboardWidgetProps
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

  private buildDetailsLink = (tab: OcpOnCloudDashboardTab) => {
    const currentTab = getIdKeyForTab(tab);
    return `/ocp-on-aws?${getQuery({
      // Todo: replace ocp-on-aws with ocp-on-cloud
      group_by: {
        [currentTab]: '*',
      },
      order_by: { cost: 'desc' },
    })}`;
  };

  private getChart = (containerHeight: number, height: number) => {
    const { currentReport, previousReport, reportType, t, trend } = this.props;

    const costReportType =
      reportType === OcpOnCloudReportType.cost ||
      reportType === OcpOnCloudReportType.database ||
      reportType === OcpOnCloudReportType.network;
    const reportItem = costReportType ? 'infrastructureCost' : 'usage';
    const currentUsageData = transformOcpOnCloudReport(
      currentReport,
      trend.type,
      'date',
      reportItem
    );
    const previousUsageData = transformOcpOnCloudReport(
      previousReport,
      trend.type,
      'date',
      reportItem
    );
    const currentRequestData =
      reportType !== OcpOnCloudReportType.cost
        ? transformOcpOnCloudReport(
            currentReport,
            trend.type,
            'date',
            'request'
          )
        : undefined;
    const previousRequestData =
      reportType !== OcpOnCloudReportType.cost
        ? transformOcpOnCloudReport(
            previousReport,
            trend.type,
            'date',
            'request'
          )
        : undefined;
    const units = this.getUnits();

    return (
      <>
        {Boolean(
          reportType === OcpOnCloudReportType.cost ||
            reportType === OcpOnCloudReportType.database ||
            reportType === OcpOnCloudReportType.instanceType ||
            reportType === OcpOnCloudReportType.network ||
            reportType === OcpOnCloudReportType.storage
        ) ? (
          <OcpOnCloudReportSummaryTrend
            containerHeight={containerHeight}
            currentData={currentUsageData}
            formatDatumValue={formatValue}
            formatDatumOptions={trend.formatOptions}
            height={height}
            previousData={previousUsageData}
            title={t(trend.titleKey, {
              units: t(`units.${units}`),
            })}
          />
        ) : (
          <OcpOnCloudReportSummaryUsage
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
      <OcpOnCloudReportSummaryDetails
        costLabel={this.getDetailsLabel(details.costKey, units)}
        formatOptions={details.formatOptions}
        formatValue={formatValue}
        report={currentReport}
        reportType={reportType}
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

  private getDetailsLinkTitle = (tab: OcpOnCloudDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private getHorizontalLayout = () => {
    const { currentReportFetchStatus } = this.props;
    return (
      <OcpOnCloudReportSummaryAlt
        detailsLink={this.getDetailsLink()}
        status={currentReportFetchStatus}
        subTitle={this.getSubTitle()}
        subTitleTooltip={this.getSubTitleTooltip()}
        tabs={this.getTabs()}
        title={this.getTitle()}
      >
        {this.getDetails()}
        {this.getChart(
          chartStyles.containerAltHeight,
          chartStyles.chartAltHeight
        )}
      </OcpOnCloudReportSummaryAlt>
    );
  };

  private getSubTitle = () => {
    const { t } = this.props;

    const today = new Date();
    const month = getMonth(today);

    return t('ocp_on_cloud_dashboard.widget_subtitle', { month });
  };

  private getSubTitleTooltip = () => {
    const { t } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'DD');
    const startDate = formatDate(startOfMonth(today), 'DD');
    const year = getYear(today);

    return t('ocp_on_cloud_dashboard.widget_subtitle_tooltip', {
      count: getDate(today),
      endDate,
      month,
      startDate,
      year,
    });
  };

  private getTab = (tab: OcpOnCloudDashboardTab, index: number) => {
    const { tabsReport, tabsReportFetchStatus } = this.props;
    const currentTab = getIdKeyForTab(tab);

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        title={this.getTabTitle(tab)}
      >
        <div className={css(styles.tabItems)}>
          <OcpOnCloudReportSummaryItems
            idKey={currentTab}
            key={`${currentTab}-items`}
            report={tabsReport}
            status={tabsReportFetchStatus}
          >
            {({ items }) =>
              items.map(reportItem => this.getTabItem(tab, reportItem))
            }
          </OcpOnCloudReportSummaryItems>
        </div>
      </Tab>
    );
  };

  private getTabItem = (tab: OcpOnCloudDashboardTab, reportItem) => {
    const { availableTabs, reportType, tabsReport, topItems } = this.props;
    const { activeTabKey } = this.state;

    const currentTab = getIdKeyForTab(tab);
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);

    const isCostReport =
      reportType === OcpOnCloudReportType.cost ||
      reportType === OcpOnCloudReportType.database ||
      reportType === OcpOnCloudReportType.network;

    if (activeTab === currentTab) {
      return (
        <OcpOnCloudReportSummaryItem
          key={`${reportItem.id}-item`}
          formatOptions={topItems.formatOptions}
          formatValue={formatValue}
          label={reportItem.label ? reportItem.label.toString() : ''}
          totalValue={
            isCostReport
              ? tabsReport.meta.total.infrastructure_cost.value
              : tabsReport.meta.total.usage.value
          }
          units={reportItem.units}
          value={
            isCostReport ? reportItem.infrastructureCost : reportItem.usage
          }
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

  private getTabTitle = (tab: OcpOnCloudDashboardTab) => {
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
        reportType === OcpOnCloudReportType.cost ||
        reportType === OcpOnCloudReportType.database ||
        reportType === OcpOnCloudReportType.network
      ) {
        units = currentReport.meta.total.infrastructure_cost
          ? unitLookupKey(currentReport.meta.total.infrastructure_cost.units)
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
      <OcpOnCloudReportSummary
        detailsLink={this.getDetailsLink()}
        status={currentReportFetchStatus}
        subTitle={this.getSubTitle()}
        subTitleTooltip={this.getSubTitleTooltip()}
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
      </OcpOnCloudReportSummary>
    );
  };

  private handleInsightsNavClick = () => {
    insights.chrome.appNavClick({ id: 'ocp-on-aws', secondaryNav: true }); // Todo: replace ocp-on-aws with ocp-on-cloud
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
  OcpOnCloudDashboardWidgetOwnProps,
  OcpOnCloudDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = ocpOnCloudDashboardSelectors.selectWidget(state, widgetId);
  const queries = ocpOnCloudDashboardSelectors.selectWidgetQueries(
    state,
    widgetId
  );
  return {
    ...widget,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: ocpOnCloudReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: ocpOnCloudReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
    previousReport: ocpOnCloudReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabsReport: ocpOnCloudReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    tabsReportFetchStatus: ocpOnCloudReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: OcpOnCloudDashboardWidgetDispatchProps = {
  fetchReports: ocpOnCloudDashboardActions.fetchWidgetReports,
  updateTab: ocpOnCloudDashboardActions.changeWidgetTab,
};

const OcpOnCloudDashboardWidget = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OcpOnCloudDashboardWidgetBase)
);

export {
  OcpOnCloudDashboardWidget,
  OcpOnCloudDashboardWidgetBase,
  OcpOnCloudDashboardWidgetProps,
};
