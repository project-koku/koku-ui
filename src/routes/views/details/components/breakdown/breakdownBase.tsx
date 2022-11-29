import { Tab, TabContent, Tabs, TabTitleText } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import type { ProviderType } from 'api/providers';
import type { Query } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import type { ReportPathsType, ReportType } from 'api/reports/report';
import type { TagPathsType } from 'api/tags/tag';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Loading } from 'routes/state/loading';
import { NoData } from 'routes/state/noData';
import { NoProviders } from 'routes/state/noProviders';
import { NotAvailable } from 'routes/state/notAvailable';
import { hasCurrentMonthData } from 'routes/views/utils/providers';
import { handleCostTypeSelected, handleCurrencySelected } from 'routes/views/utils/queryUpdate';
import { FetchStatus } from 'store/common';
import type { reportActions } from 'store/reports';
import type { CostTypes } from 'utils/costType';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './breakdown.styles';
import BreakdownHeader from './breakdownHeader';

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
  costType?: CostTypes;
  currency?: string;
  description?: string;
  detailsURL: string;
  emptyStateTitle?: string;
  groupBy?: string;
  historicalDataComponent?: React.ReactNode;
  providers?: Providers;
  providersError?: AxiosError;
  providersFetchStatus?: FetchStatus;
  providerType?: ProviderType;
  query: Query;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
  reportQueryString: string;
  showCostType?: boolean;
  tagReportPathsType?: TagPathsType;
  title?: string;
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

type BreakdownOwnProps = RouterComponentProps & WrappedComponentProps;

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
    const { report, reportError, reportQueryString, router } = this.props;

    const newQuery = prevProps.reportQueryString !== reportQueryString;
    const noReport = !report && !reportError;
    const noLocation = !router.location.search;

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
    const { intl } = this.props;

    if (tab === BreakdownTab.costOverview) {
      return intl.formatMessage(messages.breakdownCostOverviewTitle);
    } else if (tab === BreakdownTab.historicalData) {
      return intl.formatMessage(messages.breakdownHistoricalDataTitle);
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
    const { fetchReport, reportPathsType, reportType, reportQueryString, router } = this.props;
    if (router.location.search) {
      fetchReport(reportPathsType, reportType, reportQueryString);
    }
  };

  public render() {
    const {
      costType,
      currency,
      description,
      detailsURL,
      emptyStateTitle,
      groupBy,
      providers,
      providersFetchStatus,
      providerType,
      query,
      report,
      reportError,
      reportFetchStatus,
      router,
      showCostType,
      tagReportPathsType,
      title,
    } = this.props;
    const availableTabs = this.getAvailableTabs();

    // Note: Providers are fetched via the AccountSettings component used by all routes
    if (reportError) {
      return <NotAvailable title={emptyStateTitle} />;
    } else if (providersFetchStatus === FetchStatus.inProgress && reportFetchStatus === FetchStatus.inProgress) {
      return <Loading title={emptyStateTitle} />;
    } else if (providersFetchStatus === FetchStatus.complete && reportFetchStatus === FetchStatus.complete) {
      // API returns empy data array for no sources
      const noProviders =
        providers && providers.meta && providers.meta.count === 0 && providersFetchStatus === FetchStatus.complete;

      if (noProviders) {
        return <NoProviders providerType={providerType} title={emptyStateTitle} />;
      }
      if (!hasCurrentMonthData(providers)) {
        return <NoData title={title} />;
      }
    }
    return (
      <>
        <BreakdownHeader
          costType={costType}
          currency={currency}
          description={description}
          detailsURL={detailsURL}
          groupBy={groupBy}
          onCostTypeSelected={value => handleCostTypeSelected(query, router, value)}
          onCurrencySelected={value => handleCurrencySelected(query, router, value)}
          query={query}
          report={report}
          showCostType={showCostType}
          tabs={this.getTabs(availableTabs)}
          tagReportPathsType={tagReportPathsType}
          title={title}
        />
        <div style={styles.content}>{this.getTabContent(availableTabs)}</div>
      </>
    );
  }
}

export default injectIntl(withRouter(BreakdownBase));
