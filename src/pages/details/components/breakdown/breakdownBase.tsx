import { Tab, TabContent, Tabs, TabTitleText } from '@patternfly/react-core';
import { Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { FetchStatus } from 'store/common';
import { reportActions } from 'store/reports';

import { styles } from './breakdown.styles';
import { BreakdownHeader } from './breakdownHeader';

// eslint-disable-next-line no-shadow
const enum BreakdownTab {
  costOverview = 'cost-overview',
  historicalData = 'historical-data',
}

export const getIdKeyForTab = (tab: BreakdownTab) => {
  switch (tab) {
    case BreakdownTab.costOverview:
      return 'cost-overview';
    case BreakdownTab.historicalData:
      return 'historical-data';
  }
};

interface BreakdownStateProps {
  costOverviewComponent?: React.ReactNode;
  description?: string;
  detailsURL: string;
  filterBy: string;
  groupBy: string;
  historicalDataComponent?: React.ReactNode;
  query: Query;
  queryString: string;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
  title: string;
}

interface BreakdownDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

interface BreakdownState {
  activeTabKey: number;
}

interface AvailableTab {
  contentRef: React.ReactNode;
  tab: BreakdownTab;
}

type BreakdownOwnProps = RouteComponentProps<void> & WithTranslation;

type BreakdownProps = BreakdownOwnProps & BreakdownStateProps & BreakdownDispatchProps;

class BreakdownBase extends React.Component<BreakdownProps> {
  protected defaultState: BreakdownState = {
    activeTabKey: 0,
  };
  public state: BreakdownState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: BreakdownProps) {
    const { location, report, reportError, queryString } = this.props;

    const newQuery = prevProps.queryString !== queryString;
    const noReport = !report && !reportError;
    const noLocation = !location.search;

    if (newQuery || noReport || noLocation) {
      this.updateReport();
    }
  }

  private getAvailableTabs = () => {
    const availableTabs = [
      {
        contentRef: React.createRef(),
        tab: BreakdownTab.costOverview,
      },
      {
        contentRef: React.createRef(),
        tab: BreakdownTab.historicalData,
      },
    ];
    return availableTabs;
  };

  private getTab = (tab: BreakdownTab, contentRef, index: number) => {
    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        tabContentId={`tab-${index}`}
        tabContentRef={contentRef}
        title={<TabTitleText>{this.getTabTitle(tab)}</TabTitleText>}
      />
    );
  };

  private getTabContent = (availableTabs: AvailableTab[]) => {
    return availableTabs.map((val, index) => {
      return (
        <TabContent
          eventKey={index}
          key={`${getIdKeyForTab(val.tab)}-tabContent`}
          id={`tab-${index}`}
          ref={val.contentRef as any}
        >
          {this.getTabItem(val.tab, index)}
        </TabContent>
      );
    });
  };

  private getTabItem = (tab: BreakdownTab, index: number) => {
    const { costOverviewComponent, historicalDataComponent } = this.props;
    const { activeTabKey } = this.state;
    const emptyTab = <></>; // Lazily load tabs

    if (activeTabKey !== index) {
      return emptyTab;
    }
    const currentTab = getIdKeyForTab(tab);
    if (currentTab === BreakdownTab.costOverview) {
      return costOverviewComponent;
    } else if (currentTab === BreakdownTab.historicalData) {
      return historicalDataComponent;
    } else {
      return emptyTab;
    }
  };

  private getTabs = (availableTabs: AvailableTab[]) => {
    const { activeTabKey } = this.state;

    return (
      <Tabs activeKey={activeTabKey} onSelect={this.handleTabClick}>
        {availableTabs.map((val, index) => this.getTab(val.tab, val.contentRef, index))}
      </Tabs>
    );
  };

  private getTabTitle = (tab: BreakdownTab) => {
    const { t } = this.props;

    if (tab === BreakdownTab.costOverview) {
      return t('breakdown.cost_overview_title');
    } else if (tab === BreakdownTab.historicalData) {
      return t('breakdown.historical_data_title');
    }
  };

  private handleTabClick = (event, tabIndex) => {
    const { activeTabKey } = this.state;
    if (activeTabKey !== tabIndex) {
      this.setState({
        activeTabKey: tabIndex,
      });
    }
  };

  private updateReport = () => {
    const { location, fetchReport, queryString, reportPathsType, reportType } = this.props;
    if (location.search) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  };

  public render() {
    const { description, detailsURL, filterBy, groupBy, query, report, reportPathsType, title } = this.props;
    const availableTabs = this.getAvailableTabs();

    return (
      <>
        <BreakdownHeader
          description={description}
          detailsURL={detailsURL}
          filterBy={filterBy}
          groupBy={groupBy}
          query={query}
          report={report}
          reportPathsType={reportPathsType}
          tabs={this.getTabs(availableTabs)}
          title={title}
        />
        <div style={styles.content}>{this.getTabContent(availableTabs)}</div>
      </>
    );
  }
}

export default BreakdownBase;
