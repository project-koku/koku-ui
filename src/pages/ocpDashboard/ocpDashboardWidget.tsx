import { getQuery, OcpQuery, parseQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import { transformOcpReport } from 'components/commonChart/chartUtils';
import { Link } from 'components/link';
import {
  OcpReportSummary,
  OcpReportSummaryDetails,
  OcpReportSummaryItem,
  OcpReportSummaryItems,
  OcpReportSummaryTrend,
} from 'components/ocpReportSummary';
import { TabData, Tabs } from 'components/tabs';
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

interface OcpDashboardWidgetOwnProps {
  widgetId: number;
}

interface OcpDashboardWidgetStateProps extends OcpDashboardWidgetStatic {
  current: OcpReport;
  previous: OcpReport;
  tabs: OcpReport;
  currentQuery: string;
  previousQuery: string;
  tabsQuery: string;
  status: number;
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
  public componentDidMount() {
    const { fetchReports, widgetId } = this.props;
    fetchReports(widgetId);
  }

  private getTabTitle = (tab: OcpDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.top', { groupBy: key });
  };

  private getDetailsLinkTitle = (tab: OcpDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private buildDetailsLink = () => {
    const { currentQuery } = this.props;
    const groupBy = parseQuery<OcpQuery>(currentQuery).group_by;
    return `/ocp?${getQuery({
      group_by: groupBy,
      order_by: { charge: 'desc' },
    })}`;
  };

  private renderTab = (tabData: TabData) => {
    const { reportType, tabs, topItems } = this.props;

    const currentTab = tabData.id as OcpDashboardTab;

    return (
      <OcpReportSummaryItems idKey={getIdKeyForTab(currentTab)} report={tabs}>
        {({ items }) =>
          items.map(tabItem => (
            <OcpReportSummaryItem
              key={tabItem.id}
              formatOptions={topItems.formatOptions}
              formatValue={formatValue}
              label={tabItem.label.toString()}
              totalValue={
                reportType === OcpReportType.charge
                  ? tabs.total.charge
                  : tabs.total.usage
              }
              units={tabItem.units}
              value={
                reportType === OcpReportType.charge
                  ? tabItem.charge
                  : tabItem.usage
              }
            />
          ))
        }
      </OcpReportSummaryItems>
    );
  };

  private handleTabChange = (tabId: OcpDashboardTab) => {
    this.props.updateTab(this.props.id, tabId);
  };

  public render() {
    const {
      t,
      titleKey,
      trend,
      details,
      current,
      previous,
      availableTabs,
      currentTab,
      reportType,
      status,
    } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'Do');
    const startDate = formatDate(startOfMonth(today), 'Do');

    const title = t(titleKey, { endDate, month, startDate });
    const subTitle = t('ocp_dashboard.widget_subtitle', {
      endDate,
      month,
      startDate,
      count: getDate(today),
    });

    const detailLabel = t(details.labelKey);
    const requestLabel = t(details.requestLabelKey);

    const detailsLink = reportType === OcpReportType.charge && (
      <Link to={this.buildDetailsLink()}>
        {this.getDetailsLinkTitle(currentTab)}
      </Link>
    );

    const trendTitle = t(trend.titleKey);

    const currentReport = current;
    const currentReportItem =
      reportType === OcpReportType.charge ? 'charge' : 'usage';
    const prevReport = reportType === OcpReportType.charge ? previous : current;
    const prevReportItem =
      reportType === OcpReportType.charge ? 'charge' : 'request';

    const currentData = transformOcpReport(
      currentReport,
      trend.type,
      currentReportItem
    );
    const previousData = transformOcpReport(
      prevReport,
      trend.type,
      prevReportItem
    );

    return (
      <OcpReportSummary
        title={title}
        subTitle={subTitle}
        detailsLink={detailsLink}
        status={status}
      >
        <OcpReportSummaryDetails
          report={current}
          reportType={reportType}
          formatValue={formatValue}
          label={detailLabel}
          formatOptions={details.formatOptions}
          requestLabel={requestLabel}
        />
        <OcpReportSummaryTrend
          title={trendTitle}
          currentData={currentData}
          formatDatumValue={formatValue}
          formatDatumOptions={trend.formatOptions}
          previousData={previousData}
        />
        <Tabs
          tabs={availableTabs.map(tab => ({
            id: tab,
            label: this.getTabTitle(tab),
            content: this.renderTab,
          }))}
          selected={currentTab}
          onChange={this.handleTabChange}
        />
      </OcpReportSummary>
    );
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
    current: ocpReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    previous: ocpReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabs: ocpReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    status: ocpReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
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
