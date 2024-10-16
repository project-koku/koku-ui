import { Tab, TabContent, Tabs, TabTitleText } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
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
import { Loading } from 'routes/components/page/loading';
import { NoData } from 'routes/components/page/noData';
import { NoProviders } from 'routes/components/page/noProviders';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { hasCurrentMonthData, hasPreviousMonthData } from 'routes/utils/providers';
import {
  handleOnCostDistributionSelect,
  handleOnCostTypeSelect,
  handleOnCurrencySelect,
} from 'routes/utils/queryNavigate';
import { FetchStatus } from 'store/common';
import type { reportActions } from 'store/reports';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './breakdown.styles';
import BreakdownHeader from './breakdownHeader';

const enum BreakdownTab {
  costOverview = 'cost-overview',
  historicalData = 'historical-data',
  instances = 'instances',
  optimizations = 'optimizations',
}

export const getIdKeyForTab = (tab: BreakdownTab) => {
  switch (tab) {
    case BreakdownTab.costOverview:
      return 'cost-overview';
    case BreakdownTab.historicalData:
      return 'historical-data';
    case BreakdownTab.instances:
      return 'instances';
    case BreakdownTab.optimizations:
      return 'optimizations';
  }
};

interface BreakdownOwnProps extends RouterComponentProps {
  // TBD...
}

export interface BreakdownStateProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string; // Default breadcrumb path
  clusterInfoComponent?: React.ReactNode;
  costDistribution?: string;
  costOverviewComponent?: React.ReactNode;
  costType?: string;
  currency?: string;
  dataDetailsComponent?: React.ReactNode;
  description?: string;
  detailsURL?: string;
  emptyStateTitle?: string;
  groupBy?: string;
  groupByValue?: string;
  historicalDataComponent?: React.ReactNode;
  instancesComponent?: React.ReactNode;
  isAwsEc2InstancesToggleEnabled?: boolean;
  isDetailsDateRangeToggleEnabled?: boolean;
  isOptimizationsTab?: boolean;
  optimizationsBadgeComponent?: React.ReactNode;
  optimizationsComponent?: React.ReactNode;
  providers?: Providers;
  providersError?: AxiosError;
  providersFetchStatus?: FetchStatus;
  providerType?: ProviderType;
  query?: Query;
  queryState?: Query;
  report?: Report;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportPathsType?: ReportPathsType;
  reportType?: ReportType;
  reportQueryString?: string;
  showCostDistribution?: boolean;
  showCostType?: boolean;
  tagPathsType?: TagPathsType;
  timeScopeValue?: number;
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
  showBadge?: boolean;
  tab: BreakdownTab;
}

type BreakdownProps = BreakdownOwnProps & BreakdownStateProps & BreakdownDispatchProps & WrappedComponentProps;

class BreakdownBase extends React.Component<BreakdownProps, BreakdownState> {
  protected defaultState: BreakdownState = {
    activeTabKey: this.props.isOptimizationsTab ? 2 : 0,
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
    const {
      costOverviewComponent,
      historicalDataComponent,
      instancesComponent,
      isAwsEc2InstancesToggleEnabled,
      optimizationsComponent,
    } = this.props;

    const availableTabs = [];
    if (costOverviewComponent) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: BreakdownTab.costOverview,
      });
    }
    if (historicalDataComponent) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: BreakdownTab.historicalData,
      });
    }
    if (instancesComponent && isAwsEc2InstancesToggleEnabled) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: BreakdownTab.instances,
      });
    }
    if (optimizationsComponent) {
      availableTabs.push({
        contentRef: React.createRef(),
        showBadge: true,
        tab: BreakdownTab.optimizations,
      });
    }
    return availableTabs;
  };

  private getTab = (tab: BreakdownTab, contentRef, showBadge: boolean, index: number) => {
    const { groupBy, groupByValue, queryState } = this.props;

    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        tabContentId={`tab-${index}`}
        tabContentRef={contentRef}
        title={
          <>
            <TabTitleText>{this.getTabTitle(tab)}</TabTitleText>
            {showBadge && (
              <span>
                {
                  <AsyncComponent
                    scope="costManagementMfe"
                    appName="cost-management-mfe"
                    module="./MfeOptimizationsBadge"
                    cluster={queryState?.filter_by?.cluster ? queryState.filter_by.cluster : undefined}
                    project={groupBy === 'project' ? groupByValue : undefined}
                  />
                }
              </span>
            )}
          </>
        }
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
    const { costOverviewComponent, historicalDataComponent, instancesComponent, optimizationsComponent } = this.props;
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
    } else if (currentTab === BreakdownTab.instances) {
      return instancesComponent;
    } else if (currentTab === BreakdownTab.optimizations) {
      return optimizationsComponent;
    } else {
      return emptyTab;
    }
  };

  private getTabs = (availableTabs: AvailableTab[]) => {
    const { activeTabKey } = this.state;

    return (
      <Tabs activeKey={activeTabKey} onSelect={this.handleTabClick}>
        {availableTabs.map((val, index) => this.getTab(val.tab, val.contentRef, val.showBadge, index))}
      </Tabs>
    );
  };

  private getTabTitle = (tab: BreakdownTab) => {
    const { intl } = this.props;

    if (tab === BreakdownTab.costOverview) {
      return intl.formatMessage(messages.breakdownCostOverviewTitle);
    } else if (tab === BreakdownTab.historicalData) {
      return intl.formatMessage(messages.breakdownHistoricalDataTitle);
    } else if (tab === BreakdownTab.instances) {
      return intl.formatMessage(messages.instances);
    } else if (tab === BreakdownTab.optimizations) {
      return intl.formatMessage(messages.optimizations);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private handleTabClick = (event, tabIndex) => {
    const { activeTabKey } = this.state;

    if (activeTabKey !== tabIndex) {
      this.setState({
        activeTabKey: tabIndex,
      });
    }
  };

  private updateReport = () => {
    const { fetchReport, reportPathsType, reportType, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const {
      breadcrumbLabel,
      breadcrumbPath,
      clusterInfoComponent,
      costDistribution,
      costType,
      currency,
      dataDetailsComponent,
      description,
      detailsURL,
      emptyStateTitle,
      groupBy,
      isDetailsDateRangeToggleEnabled,
      optimizationsComponent,
      providers,
      providersFetchStatus,
      providerType,
      query,
      report,
      reportError,
      reportFetchStatus,
      router,
      showCostDistribution,
      showCostType,
      tagPathsType,
      timeScopeValue,
      title,
    } = this.props;
    const { activeTabKey } = this.state;

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
      if (
        isDetailsDateRangeToggleEnabled
          ? !hasCurrentMonthData(providers) && !hasPreviousMonthData(providers)
          : !hasCurrentMonthData(providers)
      ) {
        return <NoData title={title} />;
      }
    }

    return (
      <>
        <BreakdownHeader
          breadcrumbLabel={breadcrumbLabel}
          breadcrumbPath={
            router?.location?.state?.details?.breadcrumbPath
              ? router.location.state.details.breadcrumbPath
              : breadcrumbPath
          }
          clusterInfoComponent={clusterInfoComponent}
          dataDetailsComponent={dataDetailsComponent}
          costDistribution={costDistribution}
          costType={costType}
          currency={currency}
          description={description}
          detailsURL={detailsURL}
          groupBy={groupBy}
          onCostDistributionSelect={() => handleOnCostDistributionSelect(query, router, router.location.state)}
          onCostTypeSelect={() => handleOnCostTypeSelect(query, router, router.location.state)}
          onCurrencySelect={() => handleOnCurrencySelect(query, router, router.location.state)}
          query={query}
          report={report}
          showCostDistribution={showCostDistribution && !(optimizationsComponent && activeTabKey === 2)}
          showCostType={showCostType}
          showCurrency={!(optimizationsComponent && activeTabKey === 2)}
          tabs={this.getTabs(availableTabs)}
          tagPathsType={tagPathsType}
          timeScopeValue={timeScopeValue}
          title={title}
        />
        <div style={styles.content}>{this.getTabContent(availableTabs)}</div>
      </>
    );
  }
}

const Breakdown = injectIntl(withRouter(BreakdownBase));

export default Breakdown;
