import { Tab, Tabs } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import { transformOcpReport } from 'components/charts/common/chartUtils';
import {
  OcpReportSummary,
  OcpReportSummaryAlt,
  OcpReportSummaryDetails,
  OcpReportSummaryItem,
  OcpReportSummaryItems,
  OcpReportSummaryTrend,
  OcpReportSummaryUsage,
} from 'components/reports/ocpReportSummary';
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
  ocpUsageDashboardActions,
  ocpUsageDashboardSelectors,
  OcpUsageDashboardTab,
  OcpUsageDashboardWidget as OcpUsageDashboardWidgetStatic,
} from 'store/dashboard/ocpUsageDashboard';
import { ocpReportsSelectors } from 'store/reports/ocpReports';
import { GetComputedOcpReportItemsParams } from 'utils/computedReport/getComputedOcpReportItems';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './ocpUsageDashboardWidget.styles';

interface OcpUsageDashboardWidgetOwnProps {
  widgetId: number;
}

interface OcpUsageDashboardWidgetStateProps
  extends OcpUsageDashboardWidgetStatic {
  currentQuery: string;
  currentReport: OcpReport;
  currentReportFetchStatus: number;
  previousQuery: string;
  previousReport: OcpReport;
  tabsQuery: string;
  tabsReport: OcpReport;
  tabsReportFetchStatus: number;
}

interface OcpUsageDashboardWidgetDispatchProps {
  fetchReports: typeof ocpUsageDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpUsageDashboardActions.changeWidgetTab;
}

type OcpUsageDashboardWidgetProps = OcpUsageDashboardWidgetOwnProps &
  OcpUsageDashboardWidgetStateProps &
  OcpUsageDashboardWidgetDispatchProps &
  InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: OcpUsageDashboardTab
): GetComputedOcpReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpUsageDashboardTab.clusters:
      return 'cluster';
    case OcpUsageDashboardTab.nodes:
      return 'node';
    case OcpUsageDashboardTab.projects:
      return 'project';
  }
};

class OcpUsageDashboardWidgetBase extends React.Component<
  OcpUsageDashboardWidgetProps
> {
  public state = {
    activeTabKey: 0,
  };

  public componentDidMount() {
    const { availableTabs, fetchReports, id, widgetId } = this.props;
    if (availableTabs) {
      this.props.updateTab(id, availableTabs[0]);
    }
    fetchReports(widgetId);
  }

  private buildDetailsLink = (tab: OcpUsageDashboardTab) => {
    const currentTab = getIdKeyForTab(tab);
    return `/ocp?${getQuery({
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
    const { currentReport, previousReport, reportType, t, trend } = this.props;

    const reportItem = reportType === OcpReportType.cost ? 'cost' : 'usage';
    const currentUsageData = transformOcpReport(
      currentReport,
      trend.type,
      'date',
      reportItem
    );
    const previousUsageData = transformOcpReport(
      previousReport,
      trend.type,
      'date',
      reportItem
    );
    const currentRequestData =
      reportType !== OcpReportType.cost
        ? transformOcpReport(currentReport, trend.type, 'date', 'request')
        : undefined;
    const previousRequestData =
      reportType !== OcpReportType.cost
        ? transformOcpReport(previousReport, trend.type, 'date', 'request')
        : undefined;
    const currentInfrastructureData =
      reportType === OcpReportType.cost
        ? transformOcpReport(
            currentReport,
            trend.type,
            'date',
            'infrastructureCost'
          )
        : undefined;
    const previousInfrastructureData =
      reportType === OcpReportType.cost
        ? transformOcpReport(
            previousReport,
            trend.type,
            'date',
            'infrastructureCost'
          )
        : undefined;
    const units = this.getUnits();
    const title = t(trend.titleKey, { units: t(`units.${units}`) });

    return (
      <>
        {Boolean(reportType === OcpReportType.cost) ? (
          <OcpReportSummaryTrend
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
        ) : (
          <OcpReportSummaryUsage
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
        )}
      </>
    );
  };

  private getDetails = () => {
    const { currentReport, details, isUsageFirst, reportType } = this.props;
    const units = this.getUnits();
    return (
      <OcpReportSummaryDetails
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

  private getDetailsLinkTitle = (tab: OcpUsageDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private getHorizontalLayout = () => {
    const { currentReportFetchStatus } = this.props;
    return (
      <OcpReportSummaryAlt
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
      </OcpReportSummaryAlt>
    );
  };

  private getSubTitle = () => {
    const { t } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'D');
    const startDate = formatDate(startOfMonth(today), 'D');

    return t('ocp_dashboard.widget_subtitle', {
      count: getDate(today),
      endDate,
      month,
      startDate,
    });
  };

  private getTab = (tab: OcpUsageDashboardTab, index: number) => {
    const { tabsReport, tabsReportFetchStatus } = this.props;
    const currentTab = getIdKeyForTab(tab);

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        title={this.getTabTitle(tab)}
      >
        <div className={css(styles.tabItems)}>
          <OcpReportSummaryItems
            idKey={currentTab}
            key={`${currentTab}-items`}
            report={tabsReport}
            status={tabsReportFetchStatus}
          >
            {({ items }) =>
              items.map(reportItem => this.getTabItem(tab, reportItem))
            }
          </OcpReportSummaryItems>
        </div>
      </Tab>
    );
  };

  private getTabItem = (tab: OcpUsageDashboardTab, reportItem) => {
    const { availableTabs, reportType, tabsReport, topItems } = this.props;
    const { activeTabKey } = this.state;

    const currentTab = getIdKeyForTab(tab);
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);

    if (activeTab === currentTab) {
      return (
        <OcpReportSummaryItem
          key={`${reportItem.id}-item`}
          formatOptions={topItems.formatOptions}
          formatValue={formatValue}
          label={reportItem.label ? reportItem.label.toString() : ''}
          totalValue={
            reportType === OcpReportType.cost
              ? tabsReport.meta.total.cost.value
              : tabsReport.meta.total.usage.value
          }
          units={reportItem.units}
          value={
            reportType === OcpReportType.cost
              ? reportItem.cost
              : reportItem.usage
          }
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

  private getTabTitle = (tab: OcpUsageDashboardTab) => {
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
      if (reportType === OcpReportType.cost) {
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
      <OcpReportSummary
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
      </OcpReportSummary>
    );
  };

  private handleInsightsNavClick = () => {
    insights.chrome.appNavClick({ id: 'ocp', secondaryNav: true });
  };

  private handleTabClick = (event, tabIndex) => {
    const { availableTabs, id } = this.props;
    const tab = availableTabs[tabIndex];

    this.props.updateTab(id, tab);
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
  OcpUsageDashboardWidgetOwnProps,
  OcpUsageDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = ocpUsageDashboardSelectors.selectWidget(state, widgetId);
  const queries = ocpUsageDashboardSelectors.selectWidgetQueries(
    state,
    widgetId
  );
  return {
    ...widget,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    currentReport: ocpReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    currentReportFetchStatus: ocpReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
    previousReport: ocpReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabsReport: ocpReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    tabsReportFetchStatus: ocpReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.tabs
    ),
  };
});

const mapDispatchToProps: OcpUsageDashboardWidgetDispatchProps = {
  fetchReports: ocpUsageDashboardActions.fetchWidgetReports,
  updateTab: ocpUsageDashboardActions.changeWidgetTab,
};

const OcpUsageDashboardWidget = translate()(
  connect(mapStateToProps, mapDispatchToProps)(OcpUsageDashboardWidgetBase)
);

export {
  OcpUsageDashboardWidget,
  OcpUsageDashboardWidgetBase,
  OcpUsageDashboardWidgetProps,
};
