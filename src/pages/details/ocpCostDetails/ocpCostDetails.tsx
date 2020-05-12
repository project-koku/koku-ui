import { Tab, TabContent, Tabs } from '@patternfly/react-core';
import { getQuery, OcpQuery, parseQuery } from 'api/queries/ocpQuery';
import { Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { CostHeader } from 'pages/details/components/costHeader/costHeader';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';
import { styles } from './ocpCostDetails.styles';

const enum OcpCostDetailsTab {
  costOverview = 'cost-overview',
  historicalData = 'historical-data',
}

export const getIdKeyForTab = (tab: OcpCostDetailsTab) => {
  switch (tab) {
    case OcpCostDetailsTab.costOverview:
      return 'cost-overview';
    case OcpCostDetailsTab.historicalData:
      return 'historical-data';
  }
};

interface OcpCostDetailsStateProps {
  // CostOverview: React.ReactNode;
  // HistoricalOverview: React.ReactNode;
  query: Query;
  queryString: string;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
}

interface OcpCostDetailsDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

interface OcpCostDetailsState {
  activeTabKey: number;
}

interface AvailableTab {
  contentRef: React.ReactNode;
  tab: OcpCostDetailsTab;
}

type OcpCostDetailsOwnProps = RouteComponentProps<void> &
  InjectedTranslateProps;

type OcpCostDetailsProps = OcpCostDetailsOwnProps &
  OcpCostDetailsStateProps &
  OcpCostDetailsDispatchProps;

const detailsURL = '/details/ocp';
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ocp;

class OcpCostDetailsBase extends React.Component<OcpCostDetailsProps> {
  protected defaultState: OcpCostDetailsState = {
    activeTabKey: 0,
  };
  public state: OcpCostDetailsState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(
    prevProps: OcpCostDetailsProps,
    prevState: OcpCostDetailsState
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
        tab: OcpCostDetailsTab.costOverview,
      },
      {
        contentRef: React.createRef(),
        tab: OcpCostDetailsTab.historicalData,
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

  private getTab = (tab: OcpCostDetailsTab, contentRef, index: number) => {
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

  private getTabItem = (tab: OcpCostDetailsTab, index: number) => {
    const { activeTabKey } = this.state;
    const emptyTab = <></>; // Lazily load tabs

    if (activeTabKey !== index) {
      return emptyTab;
    }
    const currentTab = getIdKeyForTab(tab);
    if (currentTab === OcpCostDetailsTab.costOverview) {
      return <CostOverview />; // default
    } else if (currentTab === OcpCostDetailsTab.historicalData) {
      return <HistoricalData />;
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

  private getTabTitle = (tab: OcpCostDetailsTab) => {
    const { t } = this.props;

    if (tab === OcpCostDetailsTab.costOverview) {
      return t('cost_details.cost_overview');
    } else if (tab === OcpCostDetailsTab.historicalData) {
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
    const { location, fetchReport, queryString } = this.props;
    if (location.search) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  };

  public render() {
    const { query, report } = this.props;
    const availableTabs = this.getAvailableTabs();

    return (
      <>
        <CostHeader
          detailsURL={detailsURL}
          filterBy={this.getGroupByValue()}
          groupBy={this.getGroupById()}
          query={query}
          report={report}
          reportPathsType={reportPathsType}
          tabs={this.getTabs(availableTabs)}
          showTags
        />
        <div style={styles.content}>{this.getTabContent(availableTabs)}</div>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  OcpCostDetailsOwnProps,
  OcpCostDetailsStateProps
>((state, props) => {
  const queryFromRoute = parseQuery<OcpQuery>(location.search);
  const query = queryFromRoute;
  const queryString = getQuery(query);
  const report = reportSelectors.selectReport(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  const reportError = reportSelectors.selectReportError(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    queryString
  );

  return {
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
  };
});

const mapDispatchToProps: OcpCostDetailsDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const OcpCostDetails = translate()(
  connect(mapStateToProps, mapDispatchToProps)(OcpCostDetailsBase)
);

export default OcpCostDetails;
