import { Tab, TabContent, Tabs } from '@patternfly/react-core';
import { Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { FetchStatus } from 'store/common';
import { reportActions } from 'store/reports';
import { styles } from './costDetails.styles';
import { DetailsHeader } from './detailsHeader';
import { DetailsOverview } from './detailsOverview';

const enum CostDetailsTab {
  costOverview = 'cost-overview',
  historicalData = 'historical-data',
}

export const getIdKeyForTab = (tab: CostDetailsTab) => {
  switch (tab) {
    case CostDetailsTab.costOverview:
      return 'cost-overview';
    case CostDetailsTab.historicalData:
      return 'historical-data';
  }
};

interface CostDetailsStateProps {
  CostOverview?: React.ReactNode;
  detailsURL: string;
  HistoricalData?: React.ReactNode;
  query: Query;
  queryString: string;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

interface CostDetailsDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

interface CostDetailsState {
  activeTabKey: number;
}

interface AvailableTab {
  contentRef: React.ReactNode;
  tab: CostDetailsTab;
}

type CostDetailsOwnProps = RouteComponentProps<void> & InjectedTranslateProps;

type CostDetailsProps = CostDetailsOwnProps &
  CostDetailsStateProps &
  CostDetailsDispatchProps;

class CostDetailsBase extends React.Component<CostDetailsProps> {
  protected defaultState: CostDetailsState = {
    activeTabKey: 0,
  };
  public state: CostDetailsState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(
    prevProps: CostDetailsProps,
    prevState: CostDetailsState
  ) {
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
        tab: CostDetailsTab.costOverview,
      },
      {
        contentRef: React.createRef(),
        tab: CostDetailsTab.historicalData,
      },
    ];
    return availableTabs;
  };

  private getGroupById = () => {
    const { query } = this.props;

    const groupBys = Object.keys(query.group_by);
    return groupBys[0];
  };

  private getGroupByValue = () => {
    const { query } = this.props;

    const groupById = this.getGroupById();
    return query.group_by[groupById];
  };

  private getTab = (tab: CostDetailsTab, contentRef, index: number) => {
    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        tabContentId={`tab-${index}`}
        tabContentRef={contentRef}
        title={this.getTabTitle(tab)}
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

  private getTabItem = (tab: CostDetailsTab, index: number) => {
    const {
      CostOverview,
      HistoricalData,
      reportPathsType,
      reportType,
    } = this.props;
    const { activeTabKey } = this.state;
    const emptyTab = <></>; // Lazily load tabs

    if (activeTabKey !== index) {
      return emptyTab;
    }
    const currentTab = getIdKeyForTab(tab);
    if (currentTab === CostDetailsTab.costOverview) {
      return (
        CostOverview || (
          <DetailsOverview
            filterBy={this.getGroupByValue()}
            groupBy={this.getGroupById()}
            reportPathsType={reportPathsType}
            reportType={reportType}
          />
        )
      );
    } else if (currentTab === CostDetailsTab.historicalData) {
      return HistoricalData;
    } else {
      return emptyTab;
    }
  };

  private getTabs = (availableTabs: AvailableTab[]) => {
    const { activeTabKey } = this.state;

    return (
      <Tabs activeKey={activeTabKey} onSelect={this.handleTabClick}>
        {availableTabs.map((val, index) =>
          this.getTab(val.tab, val.contentRef, index)
        )}
      </Tabs>
    );
  };

  private getTabTitle = (tab: CostDetailsTab) => {
    const { t } = this.props;

    if (tab === CostDetailsTab.costOverview) {
      return t('cost_details.cost_overview');
    } else if (tab === CostDetailsTab.historicalData) {
      return t('cost_details.historical_data');
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
    const {
      location,
      fetchReport,
      queryString,
      reportPathsType,
      reportType,
    } = this.props;
    if (location.search) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  };

  public render() {
    const { detailsURL, query, report, reportPathsType } = this.props;
    const availableTabs = this.getAvailableTabs();

    return (
      <>
        <DetailsHeader
          detailsURL={detailsURL}
          filterBy={this.getGroupByValue()}
          groupBy={this.getGroupById()}
          query={query}
          report={report}
          reportPathsType={reportPathsType}
          tabs={this.getTabs(availableTabs)}
        />
        <div style={styles.content}>{this.getTabContent(availableTabs)}</div>
      </>
    );
  }
}

export default CostDetailsBase;
