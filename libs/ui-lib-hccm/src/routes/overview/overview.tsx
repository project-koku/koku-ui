import './overview.scss';

import type { Providers } from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';
import type { OverviewQuery } from '@koku-ui/api/queries/overviewQuery';
import { getQueryRoute, parseQuery } from '@koku-ui/api/queries/overviewQuery';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import { getUserAccessQuery } from '@koku-ui/api/queries/userAccessQuery';
import type { UserAccess } from '@koku-ui/api/userAccess';
import { UserAccessType } from '@koku-ui/api/userAccess';
import messages from '@koku-ui/i18n/locales/messages';
import {
  Button,
  ButtonVariant,
  Flex,
  FlexItem,
  PageSection,
  Popover,
  Tab,
  TabContent,
  Tabs,
  TabTitleText,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps, FetchStatus } from '../../store/common';
import { providersQuery, providersSelectors } from '../../store/providers';
import { userAccessQuery, userAccessSelectors } from '../../store/userAccess';
import { getSinceDateRangeString } from '../../utils/dates';
import type { RouterComponentProps } from '../../utils/router';
import { withRouter } from '../../utils/router';
import { getCostType, getCurrency } from '../../utils/sessionStorage';
import {
  hasAwsAccess,
  hasAzureAccess,
  hasGcpAccess,
  isAwsAvailable,
  isAzureAvailable,
  isGcpAvailable,
  isOcpAvailable,
} from '../../utils/userAccess';
import { CostType } from '../components/costType';
import { Currency } from '../components/currency';
import { Loading } from '../components/page/loading';
import NoData from '../components/page/noData/noData';
import { NoProviders } from '../components/page/noProviders';
import { Perspective } from '../components/perspective';
import {
  filterProviders,
  hasCloudCurrentMonthData,
  hasCloudData,
  hasCloudPreviousMonthData,
  hasCloudProvider,
  hasCurrentMonthData,
  hasPreviousMonthData,
} from '../utils/providers';
import { AwsDashboard } from './awsDashboard';
import { AwsOcpDashboard } from './awsOcpDashboard';
import { AzureDashboard } from './azureDashboard';
import { AzureOcpDashboard } from './azureOcpDashboard';
import { GcpDashboard } from './gcpDashboard';
import { GcpOcpDashboard } from './gcpOcpDashboard';
import { OcpCloudDashboard } from './ocpCloudDashboard';
import { OcpDashboard } from './ocpDashboard';
import { styles } from './overview.styles';

const enum InfrastructurePerspective {
  aws = 'aws',
  awsOcp = 'aws_ocp', // Aws filtered by Ocp
  azure = 'azure',
  azureOcp = 'azure_ocp', // Azure filtered by Ocp
  gcp = 'gcp',
  gcpOcp = 'gcp_ocp', // GCP filtered by Ocp
  ocpCloud = 'ocp_cloud', // All filtered by Ocp
}

const enum OcpPerspective {
  ocp = 'ocp',
}

const enum OverviewTab {
  infrastructure = 'infrastructure',
  ocp = 'ocp',
}

export const getIdKeyForTab = (tab: OverviewTab) => {
  switch (tab) {
    case OverviewTab.infrastructure:
      return 'infrastructure';
    case OverviewTab.ocp:
      return 'ocp';
  }
};

type OverviewOwnProps = RouterComponentProps & WrappedComponentProps;

interface OverviewDispatchProps {
  // TBD...
}

interface OverviewStateProps {
  awsProviders?: Providers;
  azureProviders?: Providers;
  costType?: string;
  currency?: string;
  gcpProviders?: Providers;
  ocpProviders?: Providers;
  providers?: Providers;
  providersError?: AxiosError;
  providersFetchStatus?: FetchStatus;
  perspective?: string;
  query: OverviewQuery;
  tabKey?: number;
  userAccess?: UserAccess;
  userAccessError?: AxiosError;
  userAccessFetchStatus?: FetchStatus;
  userAccessQueryString?: string;
}

interface AvailableTab {
  contentRef: React.ReactNode;
  tab: OverviewTab;
}

interface OverviewState {
  activeTabKey?: number;
  currentInfrastructurePerspective?: string;
  currentOcpPerspective?: string;
}

type OverviewProps = OverviewOwnProps & OverviewStateProps & OverviewDispatchProps;

class OverviewBase extends React.Component<OverviewProps, OverviewState> {
  protected defaultState: OverviewState = {
    activeTabKey: 0,
  };
  public state: OverviewState = { ...this.defaultState };

  public componentDidMount() {
    const { tabKey } = this.props;

    this.setState({
      activeTabKey: tabKey,
      currentInfrastructurePerspective: this.getDefaultInfrastructurePerspective(),
      currentOcpPerspective: this.getDefaultOcpPerspective(),
    });
  }

  public componentDidUpdate(prevProps: OverviewProps) {
    const { providers, tabKey, userAccess } = this.props;

    // Note: User access and providers are fetched via the AccountSettings component used by all routes
    if (prevProps.userAccess !== userAccess || prevProps.providers !== providers) {
      this.setState({
        activeTabKey: tabKey,
        currentInfrastructurePerspective: this.getDefaultInfrastructurePerspective(),
        currentOcpPerspective: this.getDefaultOcpPerspective(),
      });
    }
  }

  private getAvailableTabs = () => {
    const availableTabs = [];

    const infrastructureTabs =
      this.isAwsAvailable() || this.isAzureAvailable() || this.isGcpAvailable() || this.isOcpCloudAvailable()
        ? [
            {
              contentRef: React.createRef(),
              tab: OverviewTab.infrastructure,
            },
          ]
        : undefined;

    const ocpTabs = this.isOcpAvailable()
      ? [
          {
            contentRef: React.createRef(),
            tab: OverviewTab.ocp,
          },
        ]
      : undefined;

    if (ocpTabs) {
      availableTabs.push(...ocpTabs);
    }
    if (infrastructureTabs) {
      availableTabs.push(...infrastructureTabs);
    }

    return availableTabs;
  };

  private getCostType = () => {
    const { costType } = this.props;
    const { currentInfrastructurePerspective, currentOcpPerspective } = this.state;

    const currentItem =
      this.getCurrentTab() === OverviewTab.infrastructure ? currentInfrastructurePerspective : currentOcpPerspective;

    if (currentItem === InfrastructurePerspective.aws || currentItem === InfrastructurePerspective.awsOcp) {
      return (
        <div style={styles.costType}>
          <CostType costType={costType} onSelect={this.handleOnCostTypeSelected} />
        </div>
      );
    }
    return null;
  };

  private getCurrency = () => {
    const { currency } = this.props;

    return <Currency onSelect={this.handleOnCurrencySelected} currency={currency} />;
  };

  private getCurrentTab = () => {
    const { activeTabKey } = this.state;

    const hasAws = this.isAwsAvailable();
    const hasAzure = this.isAzureAvailable();
    const hasGcp = this.isGcpAvailable();
    const hasOcp = this.isOcpAvailable();
    const hasOcpCloud = this.isOcpCloudAvailable();

    const hasInfrastructure = hasAws || hasAzure || hasGcp || hasOcpCloud;
    const showInfrastructureOnly = hasInfrastructure && !hasOcp;
    const showOcpOnly = hasOcp && !hasInfrastructure;

    if (showOcpOnly) {
      return OverviewTab.ocp;
    } else if (showInfrastructureOnly) {
      return OverviewTab.infrastructure;
    } else {
      switch (activeTabKey) {
        case 0:
          return OverviewTab.ocp;
        case 1:
          return OverviewTab.infrastructure;
      }
    }
  };

  private getDefaultInfrastructurePerspective = () => {
    const { perspective } = this.props;

    // Upon page refresh, perspective param takes precedence
    switch (perspective) {
      case InfrastructurePerspective.aws:
      case InfrastructurePerspective.awsOcp:
      case InfrastructurePerspective.azure:
      case InfrastructurePerspective.azureOcp:
      case InfrastructurePerspective.gcp:
      case InfrastructurePerspective.gcpOcp:
      case InfrastructurePerspective.ocpCloud:
        return perspective;
    }

    if (this.isOcpCloudAvailable()) {
      return InfrastructurePerspective.ocpCloud;
    }
    if (this.isAwsAvailable()) {
      return InfrastructurePerspective.aws;
    }
    if (this.isAzureAvailable()) {
      return InfrastructurePerspective.azure;
    }
    if (this.isGcpAvailable()) {
      return InfrastructurePerspective.gcp;
    }
    return undefined;
  };

  private getDefaultOcpPerspective = () => {
    const { ocpProviders, perspective, userAccess } = this.props;

    // Upon page refresh, perspective param takes precedence
    switch (perspective) {
      case OcpPerspective.ocp:
        return perspective;
    }
    if (isOcpAvailable(userAccess, ocpProviders)) {
      return OcpPerspective.ocp;
    }
    return undefined;
  };

  private getPerspective = () => {
    const { currentInfrastructurePerspective, currentOcpPerspective } = this.state;

    const hasAws = this.isAwsAvailable();
    const hasAzure = this.isAzureAvailable();
    const hasGcp = this.isGcpAvailable();
    const hasOcp = this.isOcpAvailable();

    // Note: No need to test "OCP on cloud" here, since that requires at least one of the providers below
    if (!(hasAws || hasAzure || hasGcp || hasOcp)) {
      return null;
    }

    let currentItem;
    const currentTab = this.getCurrentTab();
    switch (currentTab) {
      case OverviewTab.infrastructure:
        currentItem = currentInfrastructurePerspective;
        break;
      case OverviewTab.ocp:
        currentItem = currentOcpPerspective;
        break;
    }

    return (
      <Perspective
        currentItem={currentItem}
        hasAws={hasAws}
        hasAwsOcp={this.isAwsOcpAvailable()}
        hasAzure={hasAzure}
        hasAzureOcp={this.isAzureOcpAvailable()}
        hasGcp={hasGcp}
        hasGcpOcp={this.isGcpOcpAvailable()}
        hasOcp={hasOcp}
        hasOcpCloud={this.isOcpCloudAvailable()}
        isInfrastructureTab={OverviewTab.infrastructure === currentTab}
        onSelect={this.handleOnPerspectiveSelect}
      />
    );
  };

  private getRouteForQuery = (query: OverviewQuery) => {
    const { router } = this.props;

    return `${router.location.pathname}?${getQueryRoute(query)}`;
  };

  private getTab = (tab: OverviewTab, contentRef, index: number) => {
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

  private getTabItem = (tab: OverviewTab, index: number) => {
    const { awsProviders, azureProviders, costType, currency, gcpProviders, ocpProviders } = this.props;
    const { activeTabKey, currentInfrastructurePerspective, currentOcpPerspective } = this.state;

    const emptyTab = <></>; // Lazily load tabs
    const noData = <NoData isPageSection={false} showReload={false} />;

    if (activeTabKey !== index) {
      return emptyTab;
    }

    const currentTab = getIdKeyForTab(tab);
    if (currentTab === OverviewTab.infrastructure) {
      if (currentInfrastructurePerspective === InfrastructurePerspective.ocpCloud) {
        const hasData =
          hasCloudData(awsProviders, ocpProviders) ||
          hasCloudData(azureProviders, ocpProviders) ||
          hasCloudData(gcpProviders, ocpProviders);
        return hasData ? <OcpCloudDashboard currency={currency} /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.aws) {
        const hasData = hasCurrentMonthData(awsProviders) || hasPreviousMonthData(awsProviders);
        return hasData ? <AwsDashboard costType={costType} currency={currency} /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.awsOcp) {
        const hasData =
          hasCloudCurrentMonthData(awsProviders, ocpProviders) || hasCloudPreviousMonthData(awsProviders, ocpProviders);
        return hasData ? <AwsOcpDashboard currency={currency} /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.azure) {
        const hasData = hasCurrentMonthData(azureProviders) || hasPreviousMonthData(azureProviders);
        return hasData ? <AzureDashboard currency={currency} /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.azureOcp) {
        const hasData =
          hasCloudCurrentMonthData(azureProviders, ocpProviders) ||
          hasCloudPreviousMonthData(azureProviders, ocpProviders);
        return hasData ? <AzureOcpDashboard currency={currency} /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.gcp) {
        const hasData = hasCurrentMonthData(gcpProviders) || hasPreviousMonthData(gcpProviders);
        return hasData ? <GcpDashboard currency={currency} /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.gcpOcp) {
        const hasData =
          hasCloudCurrentMonthData(gcpProviders, ocpProviders) || hasCloudPreviousMonthData(gcpProviders, ocpProviders);
        return hasData ? <GcpOcpDashboard currency={currency} /> : noData;
      } else {
        return noData;
      }
    } else if (currentTab === OverviewTab.ocp) {
      const hasData = hasCurrentMonthData(ocpProviders) || hasPreviousMonthData(ocpProviders);
      if (currentOcpPerspective === OcpPerspective.ocp) {
        return hasData ? <OcpDashboard currency={currency} /> : noData;
      } else {
        return noData;
      }
    } else {
      return emptyTab;
    }
  };

  private getTabs = (availableTabs: AvailableTab[]) => {
    const { activeTabKey } = this.state;

    return (
      <Tabs activeKey={activeTabKey} onSelect={this.handleOnTabClick}>
        {availableTabs.map((val, index) => this.getTab(val.tab, val.contentRef, index))}
      </Tabs>
    );
  };

  private getTabTitle = (tab: OverviewTab) => {
    const { intl } = this.props;

    if (tab === OverviewTab.infrastructure) {
      return intl.formatMessage(messages.infrastructure);
    } else if (tab === OverviewTab.ocp) {
      return intl.formatMessage(messages.openShift);
    }
  };

  private handleOnCostTypeSelected = () => {
    const { query, router } = this.props;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
    };
    router.navigate(this.getRouteForQuery(newQuery), { replace: true });
  };

  private handleOnCurrencySelected = () => {
    const { router, query } = this.props;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
    };
    router.navigate(this.getRouteForQuery(newQuery), { replace: true });
  };

  private handleOnPerspectiveSelect = (value: string) => {
    const { query, router } = this.props;
    const currentTab = this.getCurrentTab();

    this.setState(
      {
        ...(currentTab === OverviewTab.infrastructure && {
          currentInfrastructurePerspective: value,
        }),
        ...(currentTab === OverviewTab.ocp && { currentOcpPerspective: value }),
      },
      () => {
        const newQuery = {
          ...JSON.parse(JSON.stringify(query)),
          perspective: value,
        };
        router.navigate(this.getRouteForQuery(newQuery), { replace: true });
      }
    );
  };

  private handleOnTabClick = (event, tabIndex) => {
    const { query, router } = this.props;
    const { activeTabKey } = this.state;

    if (activeTabKey !== tabIndex) {
      this.setState(
        {
          activeTabKey: tabIndex,
        },
        () => {
          const newQuery = {
            ...JSON.parse(JSON.stringify(query)),
            tabKey: tabIndex,
          };
          router.navigate(this.getRouteForQuery(newQuery), { replace: true });
        }
      );
    }
  };

  private isAwsAvailable = () => {
    const { awsProviders, userAccess } = this.props;
    return isAwsAvailable(userAccess, awsProviders);
  };

  private isAwsOcpAvailable = () => {
    const { awsProviders, ocpProviders, userAccess } = this.props;
    return hasAwsAccess(userAccess) && hasCloudProvider(awsProviders, ocpProviders);
  };

  private isAzureAvailable = () => {
    const { azureProviders, userAccess } = this.props;
    return isAzureAvailable(userAccess, azureProviders);
  };

  private isAzureOcpAvailable = () => {
    const { azureProviders, ocpProviders, userAccess } = this.props;
    return hasAzureAccess(userAccess) && hasCloudProvider(azureProviders, ocpProviders);
  };

  private isGcpAvailable = () => {
    const { gcpProviders, userAccess } = this.props;
    return isGcpAvailable(userAccess, gcpProviders);
  };

  private isGcpOcpAvailable = () => {
    const { gcpProviders, ocpProviders, userAccess } = this.props;
    return hasGcpAccess(userAccess) && hasCloudProvider(gcpProviders, ocpProviders);
  };

  private isOcpAvailable = () => {
    const { ocpProviders, userAccess } = this.props;
    return isOcpAvailable(userAccess, ocpProviders);
  };

  private isOcpCloudAvailable = () => {
    const hasAwsOcp = this.isAwsOcpAvailable();
    const hasAzureOcp = this.isAzureOcpAvailable();
    const hasGcpOcp = this.isGcpOcpAvailable();

    return hasAwsOcp || hasAzureOcp || hasGcpOcp;
  };

  public render() {
    const { providersFetchStatus, intl, userAccessFetchStatus } = this.props;

    // Note: No need to test OCP on cloud here, since that requires at least one provider
    const noProviders =
      providersFetchStatus === FetchStatus.complete &&
      !this.isAwsAvailable() &&
      !this.isAzureAvailable() &&
      !this.isGcpAvailable() &&
      !this.isOcpAvailable();

    const isLoading =
      providersFetchStatus === FetchStatus.inProgress || userAccessFetchStatus === FetchStatus.inProgress;

    const availableTabs = this.getAvailableTabs();
    const title = intl.formatMessage(messages.overviewTitle);

    if (isLoading) {
      return <Loading title={title} />;
    } else if (noProviders) {
      return <NoProviders />;
    }
    return (
      <>
        <PageSection style={styles.headerContainer}>
          <header>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
              <FlexItem>
                <Title headingLevel="h1" size={TitleSizes['2xl']}>
                  {title}
                  <span style={styles.infoIcon}>
                    <Popover
                      aria-label={intl.formatMessage(messages.overviewInfoArialLabel)}
                      enableFlip
                      bodyContent={
                        <>
                          <p style={styles.infoTitle}>{intl.formatMessage(messages.openShiftCloudInfrastructure)}</p>
                          <p>{intl.formatMessage(messages.openShiftCloudInfrastructureDesc)}</p>
                          <br />
                          <p style={styles.infoTitle}>{intl.formatMessage(messages.openShift)}</p>
                          <p>{intl.formatMessage(messages.openShiftDesc)}</p>
                          <br />
                          <p style={styles.infoTitle}>{intl.formatMessage(messages.aws)}</p>
                          <p>{intl.formatMessage(messages.awsDesc)}</p>
                          <br />
                          <p style={styles.infoTitle}>{intl.formatMessage(messages.gcp)}</p>
                          <p>{intl.formatMessage(messages.gcpDesc)}</p>
                          <br />
                          <p style={styles.infoTitle}>{intl.formatMessage(messages.azure)}</p>
                          <p>{intl.formatMessage(messages.azureDesc)}</p>
                        </>
                      }
                    >
                      <Button
                        icon={<OutlinedQuestionCircleIcon />}
                        aria-label={intl.formatMessage(messages.overviewInfoButtonArialLabel)}
                        variant={ButtonVariant.plain}
                      ></Button>
                    </Popover>
                  </span>
                </Title>
              </FlexItem>
              <FlexItem>
                <div style={styles.headerContentRight}>{this.getCurrency()}</div>
              </FlexItem>
            </Flex>
            <div style={styles.tabs}>{this.getTabs(availableTabs)}</div>
            <div style={styles.headerContent}>
              <div style={styles.headerContentLeft}>
                {this.getPerspective()}
                {this.getCostType()}
              </div>
              <div style={styles.date}>{getSinceDateRangeString()}</div>
            </div>
          </header>
        </PageSection>
        <PageSection>{this.getTabContent(availableTabs)}</PageSection>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<OverviewOwnProps, OverviewStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<OverviewQuery>(router.location.search);
  const tabKey = queryFromRoute.tabKey && !Number.isNaN(queryFromRoute.tabKey) ? Number(queryFromRoute.tabKey) : 0;
  const perspective = queryFromRoute.perspective;
  const currency = getCurrency();
  const costType =
    perspective === InfrastructurePerspective.aws || perspective === InfrastructurePerspective.awsOcp
      ? getCostType()
      : undefined;

  const query = {
    ...queryFromRoute,
  };

  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  const userAccessQueryString = getUserAccessQuery(userAccessQuery);
  const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
  const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
  const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.all,
    userAccessQueryString
  );

  return {
    awsProviders: filterProviders(providers, ProviderType.aws),
    azureProviders: filterProviders(providers, ProviderType.azure),
    costType,
    currency,
    gcpProviders: filterProviders(providers, ProviderType.gcp),
    ocpProviders: filterProviders(providers, ProviderType.ocp),
    providers,
    providersError,
    providersFetchStatus,
    perspective,
    query,
    tabKey,
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const mapDispatchToProps: OverviewDispatchProps = {
  // TBD...
};

const Overview = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(OverviewBase)));

export default Overview;
