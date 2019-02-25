import { Tab, Tabs } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AwsQuery, getQuery, parseQuery } from 'api/awsQuery';
import { AwsReport, AwsReportType } from 'api/awsReports';
import { transformAwsReport } from 'components/charts/commonChart/chartUtils';
import { Link } from 'components/link';
import {
  AwsReportSummary,
  AwsReportSummaryDetails,
  AwsReportSummaryItem,
  AwsReportSummaryItems,
  AwsReportSummaryTrend,
} from 'components/reports/awsReportSummary';
import { TabData } from 'components/tabs';
import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import {
  awsDashboardActions,
  awsDashboardSelectors,
  AwsDashboardTab,
  AwsDashboardWidget as AwsDashboardWidgetStatic,
} from 'store/awsDashboard';
import { awsReportsSelectors } from 'store/awsReports';
import { createMapStateToProps } from 'store/common';
import { formatValue } from 'utils/formatValue';
import { GetComputedAwsReportItemsParams } from 'utils/getComputedAwsReportItems';
import { styles } from './awsDashboardWidget.styles';

interface AwsDashboardWidgetOwnProps {
  widgetId: number;
}

interface AwsDashboardWidgetStateProps extends AwsDashboardWidgetStatic {
  current: AwsReport;
  previous: AwsReport;
  tabs: AwsReport;
  currentQuery: string;
  previousQuery: string;
  tabsQuery: string;
  status: number;
}

interface AwsDashboardWidgetDispatchProps {
  fetchReports: typeof awsDashboardActions.fetchWidgetReports;
  updateTab: typeof awsDashboardActions.changeWidgetTab;
}

type AwsDashboardWidgetProps = AwsDashboardWidgetOwnProps &
  AwsDashboardWidgetStateProps &
  AwsDashboardWidgetDispatchProps &
  InjectedTranslateProps;

export const getIdKeyForTab = (
  tab: AwsDashboardTab
): GetComputedAwsReportItemsParams['idKey'] => {
  switch (tab) {
    case AwsDashboardTab.services:
      return 'service';
    case AwsDashboardTab.accounts:
      return 'account';
    case AwsDashboardTab.regions:
      return 'region';
    case AwsDashboardTab.instanceType:
      return 'instance_type';
  }
};

class AwsDashboardWidgetBase extends React.Component<AwsDashboardWidgetProps> {
  public state = {
    activeTabKey: 0,
  };

  public componentDidMount() {
    const { fetchReports, widgetId } = this.props;
    fetchReports(widgetId);
  }

  private getTabTitle = (tab: AwsDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.top', { groupBy: key });
  };

  private getDetailsLinkTitle = (tab: AwsDashboardTab) => {
    const { t } = this.props;
    const key = getIdKeyForTab(tab) || '';

    return t('group_by.all', { groupBy: key });
  };

  private buildDetailsLink = () => {
    const { currentQuery } = this.props;
    const groupBy = parseQuery<AwsQuery>(currentQuery).group_by;
    return `/aws?${getQuery({
      group_by: groupBy,
      order_by: { total: 'desc' },
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

  private getTabs = (tabData: TabData) => {
    const { tabs } = this.props;

    const currentTab = getIdKeyForTab(tabData.id as AwsDashboardTab);

    return (
      <AwsReportSummaryItems
        idKey={currentTab}
        key={`${currentTab}-items`}
        report={tabs}
      >
        {({ items }) => items.map(tabItem => this.renderTab(tabItem, tabData))}
      </AwsReportSummaryItems>
    );
  };

  private renderTab = (tabItem, tabData: TabData) => {
    const { availableTabs, tabs, topItems } = this.props;
    const { activeTabKey } = this.state;

    const currentTab = getIdKeyForTab(tabData.id as AwsDashboardTab);
    const activeTab = getIdKeyForTab(availableTabs[activeTabKey]);

    if (activeTab === currentTab) {
      return (
        <AwsReportSummaryItem
          key={`${tabItem.id}-item`}
          formatOptions={topItems.formatOptions}
          formatValue={formatValue}
          label={tabItem.label ? tabItem.label.toString() : ''}
          totalValue={tabs.total.value}
          units={tabItem.units}
          value={tabItem.total}
        />
      );
    } else {
      return null;
    }
  };

  public render() {
    const {
      availableTabs,
      current,
      currentTab,
      details,
      previous,
      reportType,
      status,
      t,
      titleKey,
      trend,
    } = this.props;

    const today = new Date();
    const month = getMonth(today);
    const endDate = formatDate(today, 'Do');
    const startDate = formatDate(startOfMonth(today), 'Do');

    const title = t(titleKey, { endDate, month, startDate });
    const subTitle = t('aws_dashboard.widget_subtitle', {
      endDate,
      month,
      startDate,
      count: getDate(today),
    });

    const detailLabel = t(details.labelKey, {
      context: details.labelKeyContext,
    });

    const detailsLink = reportType === AwsReportType.cost && (
      <Link to={this.buildDetailsLink()}>
        {this.getDetailsLinkTitle(currentTab)}
      </Link>
    );

    const trendTitle = t(trend.titleKey);
    const currentData = transformAwsReport(current, trend.type);
    const previousData = transformAwsReport(previous, trend.type);

    return (
      <AwsReportSummary
        title={title}
        subTitle={subTitle}
        detailsLink={detailsLink}
        status={status}
      >
        <AwsReportSummaryDetails
          report={current}
          formatValue={formatValue}
          label={detailLabel}
          formatOptions={details.formatOptions}
        />
        <AwsReportSummaryTrend
          title={trendTitle}
          currentData={currentData}
          formatDatumValue={formatValue}
          formatDatumOptions={trend.formatOptions}
          previousData={previousData}
        />
        <Tabs
          isFilled
          activeKey={this.state.activeTabKey}
          onSelect={this.handleTabClick}
        >
          {availableTabs.map((tab, index) => (
            <Tab
              eventKey={index}
              key={`${getIdKeyForTab(tab)}-tab`}
              title={this.getTabTitle(tab)}
            >
              <div className={css(styles.tabs)}>
                {this.getTabs({ id: tab } as TabData)}
              </div>
            </Tab>
          ))}
        </Tabs>
      </AwsReportSummary>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  AwsDashboardWidgetOwnProps,
  AwsDashboardWidgetStateProps
>((state, { widgetId }) => {
  const widget = awsDashboardSelectors.selectWidget(state, widgetId);
  const queries = awsDashboardSelectors.selectWidgetQueries(state, widgetId);
  return {
    ...widget,
    currentQuery: queries.current,
    previousQuery: queries.previous,
    tabsQuery: queries.tabs,
    current: awsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.current
    ),
    previous: awsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.previous
    ),
    tabs: awsReportsSelectors.selectReport(
      state,
      widget.reportType,
      queries.tabs
    ),
    status: awsReportsSelectors.selectReportFetchStatus(
      state,
      widget.reportType,
      queries.current
    ),
  };
});

const mapDispatchToProps: AwsDashboardWidgetDispatchProps = {
  fetchReports: awsDashboardActions.fetchWidgetReports,
  updateTab: awsDashboardActions.changeWidgetTab,
};

const AwsDashboardWidget = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AwsDashboardWidgetBase)
);

export { AwsDashboardWidget, AwsDashboardWidgetBase, AwsDashboardWidgetProps };
