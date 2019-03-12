import { Tab, Tabs } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery, OcpQuery, parseQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import { transformOcpReport } from 'components/charts/commonChart/chartUtils';
import { Link } from 'components/link';
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
import { createMapStateToProps } from 'store/common';
import {
  ocpDashboardActions,
  ocpDashboardSelectors,
  OcpDashboardTab,
  OcpDashboardWidget as OcpDashboardWidgetStatic,
} from 'store/ocpDashboard';
import { ocpReportsSelectors } from 'store/ocpReports';
import { formatValue } from 'utils/formatValue';
import { GetComputedOcpReportItemsParams } from 'utils/getComputedOcpReportItems';
import { styles } from './ocpDashboardWidget.styles';

interface OcpDashboardWidgetOwnProps {
  widgetId: number;
}

interface OcpDashboardWidgetStateProps extends OcpDashboardWidgetStatic {
  currentQuery: string;
  currentReport: OcpReport;
  currentReportFetchStatus: number;
  previousQuery: string;
  previousReport: OcpReport;
  tabsQuery: string;
  tabsReport: OcpReport;
}

interface OcpDashboardWidgetDispatchProps {
  fetchReports: typeof ocpDashboardActions.fetchWidgetReports;
  updateTab: typeof ocpDashboardActions.changeWidgetTab;
}

type OcpDashboardWidgetProps = OcpDashboardWidgetOwnProps &
  OcpDashboardWidgetStateProps &
  OcpDashboardWidgetDispatchProps &
  InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: OcpDashboardTab
): GetComputedOcpReportItemsParams['idKey'] => {
  switch (tab) {
    case OcpDashboardTab.clusters:
      return 'cluster';
    case OcpDashboardTab.nodes:
      return 'node';
    case OcpDashboardTab.projects:
      return 'project';
  }
};

class OcpDashboardWidgetBase extends React.Component<OcpDashboardWidgetProps> {
  public state = {
    activeTabKey: 0,
  };

  public componentDidMount() {
    const { availableTabs, fetchReports, id, widgetId } = this.props;
    this.props.updateTab(id, availableTabs[0]);
    fetchReports(widgetId);
  }

  private buildDetailsLink = () => {
    const { currentQuery } = this.props;
    const groupBy = parseQuery<OcpQuery>(currentQuery).group_by;
    return `/ocp?${getQuery({
      group_by: groupBy,
      order_by: { cost: 'desc' },
    })}`;
  };

  private handleTabClick = (event, tabIndex) => {
    const { availableTabs, id } = this.props;
    const tab = availableTabs[tabIndex];

    this.props.updateTab(id, tab);
    this.setState({
      activeTabKey: tabIndex,
    });
  };

  private getChart = (height: number) => {
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

    return (
      <>
        {Boolean(reportType === OcpReportType.cost) ? (
          <OcpReportSummaryTrend
            currentData={currentUsageData}
            formatDatumValue={formatValue}
            formatDatumOptions={trend.formatOptions}
            height={height}
            previousData={previousUsageData}
            title={t(trend.titleKey)}
          />
        ) : (
          <OcpReportSummaryUsage
            currentRequestData={currentRequestData}
            currentUsageData={currentUsageData}
            formatDatumValue={formatValue}
            formatDatumOptions={trend.formatOptions}
            height={height}
            previousRequestData={previousRequestData}
            previousUsageData={previousUsageData}
          />
        )}
      </>
    );
  };

  private getDetails = () => {
    const { currentReport, details, reportType } = this.props;
    return (
      <OcpReportSummaryDetails
        formatOptions={details.formatOptions}
        formatValue={formatValue}
        label={this.getDetailsLabel()}
        report={currentReport}
        reportType={reportType}
        requestLabel={this.getRequestLabel()}
      />
    );
  };

  private getDetailsLabel = () => {
    const { details, t } = this.props;
    return t(details.labelKey, { context: details.labelKeyContext });
  };

  private getDetailsLink = () => {
    const { currentTab, isDetailsLink } = this.props;
    return (
      isDetailsLink && (
        <Link to={this.buildDetailsLink()}>
          {this.getDetailsLinkTitle(currentTab)}
        </Link>
      )
    );
  };

  private getDetailsLinkTitle = (tab: OcpDashboardTab) => {
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
        {this.getChart(180)}
      </OcpReportSummaryAlt>
    );
  };

  private getRequestLabel = () => {
    const { details, t } = this.props;
    return t(details.requestLabelKey, { context: details.labelKeyContext });
  };

  private getSubTitle = () => {
    const { t } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'Do');
    const startDate = formatDate(startOfMonth(today), 'Do');

    return t('ocp_dashboard.widget_subtitle', {
      endDate,
      month,
      startDate,
      count: getDate(today),
    });
  };

  private getTab = (tab: OcpDashboardTab, index: number) => {
    const { tabsReport } = this.props;
    const currentTab = getIdKeyForTab(tab as OcpDashboardTab);

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        title={this.getTabTitle(tab)}
      >
        <div className={css(styles.tabs)}>
          <OcpReportSummaryItems
            idKey={currentTab}
            key={`${currentTab}-items`}
            report={tabsReport}
          >
            {({ items }) =>
              items.map(reportItem => this.getTabItem(tab, reportItem))
            }
          </OcpReportSummaryItems>
        </div>
      </Tab>
    );
  };

  private getTabItem = (tab: OcpDashboardTab, reportItem) => {
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

  private getTabTitle = (tab: OcpDashboardTab) => {
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

  private getVerticalLayout = () => {
    const { currentReportFetchStatus } = this.props;
    return (
      <OcpReportSummary
        detailsLink={this.getDetailsLink()}
        status={currentReportFetchStatus}
        subTitle={this.getSubTitle()}
        title={this.getTitle()}
      >
        {this.getDetails()}
        {this.getChart(75)}
        {this.getTabs()}
      </OcpReportSummary>
    );
  };

  public render() {
    const { isHorizontal = false } = this.props;
    return Boolean(isHorizontal)
      ? this.getHorizontalLayout()
      : this.getVerticalLayout();
  }
}

const mapStateToProps = createMapStateToProps<
  OcpDashboardWidgetOwnProps,
  OcpDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = ocpDashboardSelectors.selectWidget(state, widgetId);
  const queries = ocpDashboardSelectors.selectWidgetQueries(state, widgetId);
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
  };
});

const mapDispatchToProps: OcpDashboardWidgetDispatchProps = {
  fetchReports: ocpDashboardActions.fetchWidgetReports,
  updateTab: ocpDashboardActions.changeWidgetTab,
};

const OcpDashboardWidget = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OcpDashboardWidgetBase)
);

export { OcpDashboardWidget, OcpDashboardWidgetBase, OcpDashboardWidgetProps };
