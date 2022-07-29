import './overview.scss';

import {
  Button,
  ButtonVariant,
  Popover,
  Tab,
  TabContent,
  Tabs,
  TabTitleText,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import { Providers, ProviderType } from 'api/providers';
import { getQuery, getQueryRoute, OverviewQuery, parseQuery } from 'api/queries/overviewQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import { Currency } from 'pages/components/currency';
import Loading from 'pages/state/loading';
import NoData from 'pages/state/noData/noData';
import NoProviders from 'pages/state/noProviders';
import { CostType } from 'pages/views/components/costType';
import { Perspective } from 'pages/views/components/perspective/perspective';
import AwsDashboard from 'pages/views/overview/awsDashboard';
import AwsOcpDashboard from 'pages/views/overview/awsOcpDashboard';
import AzureDashboard from 'pages/views/overview/azureDashboard';
import AzureOcpDashboard from 'pages/views/overview/azureOcpDashboard';
import GcpDashboard from 'pages/views/overview/gcpDashboard';
import GcpOcpDashboard from 'pages/views/overview/gcpOcpDashboard';
import IbmDashboard from 'pages/views/overview/ibmDashboard';
import OcpCloudDashboard from 'pages/views/overview/ocpCloudDashboard';
import OcpDashboard from 'pages/views/overview/ocpDashboard';
import {
  filterProviders,
  hasCloudCurrentMonthData,
  hasCloudData,
  hasCloudPreviousMonthData,
  hasCloudProvider,
  hasCurrentMonthData,
  hasPreviousMonthData,
} from 'pages/views/utils/providers';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import { CostTypes, getCostType } from 'utils/costType';
import { getSinceDateRangeString } from 'utils/dateRange';
import { FeatureType, isFeatureVisible } from 'utils/feature';
import {
  hasAwsAccess,
  hasAzureAccess,
  hasGcpAccess,
  hasIbmAccess,
  isAwsAvailable,
  isAzureAvailable,
  isGcpAvailable,
  isIbmAvailable,
  isOciAvailable,
  isOcpAvailable,
} from 'utils/userAccess';

import OciDashboard from './ociDashboard';
import { styles } from './overview.styles';

// eslint-disable-next-line no-shadow
const enum InfrastructurePerspective {
  aws = 'aws',
  awsOcp = 'aws_ocp', // Aws filtered by Ocp
  azure = 'azure',
  azureOcp = 'azure_ocp', // Azure filtered by Ocp
  gcp = 'gcp',
  gcpOcp = 'gcp_ocp', // GCP filtered by Ocp
  ibm = 'ibm',
  ibmOcp = 'ibm_ocp', // IBM filtered by Ocp
  oci = 'oci',
  ocpCloud = 'ocp_cloud', // All filtered by Ocp
}

// eslint-disable-next-line no-shadow
const enum OcpPerspective {
  ocp = 'ocp',
}

// eslint-disable-next-line no-shadow
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

type OverviewOwnProps = RouteComponentProps<void> & WrappedComponentProps;

interface OverviewDispatchProps {
  // TBD...
}

interface OverviewStateProps {
  awsProviders?: Providers;
  azureProviders?: Providers;
  costType?: CostTypes;
  gcpProviders?: Providers;
  ibmProviders?: Providers;
  ociProviders?: Providers;
  ocpProviders?: Providers;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  perspective?: string;
  query: OverviewQuery;
  queryString: string;
  tabKey?: number;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

interface AvailableTab {
  contentRef: React.ReactNode;
  tab: OverviewTab;
}

interface OverviewState {
  activeTabKey: number;
  currentInfrastructurePerspective?: string;
  currentOcpPerspective?: string;
}

type OverviewProps = OverviewOwnProps & OverviewStateProps & OverviewDispatchProps;

// Ocp options
const ocpOptions = [{ label: messages.perspectiveValues, value: 'ocp' }];

// Infrastructure AWS options
const infrastructureAwsOptions = [{ label: messages.perspectiveValues, value: 'aws' }];

// Infrastructure AWS filtered by OpenShift options
const infrastructureAwsOcpOptions = [{ label: messages.perspectiveValues, value: 'aws_ocp' }];

// Infrastructure Azure options
const infrastructureAzureOptions = [{ label: messages.perspectiveValues, value: 'azure' }];

// Infrastructure Oci options
const infrastructureOciOptions = [{ label: messages.perspectiveValues, value: 'oci' }];

// Infrastructure Azure filtered by OpenShift options
const infrastructureAzureOcpOptions = [{ label: messages.perspectiveValues, value: 'azure_ocp' }];

// Infrastructure GCP options
const infrastructureGcpOptions = [{ label: messages.perspectiveValues, value: 'gcp' }];

// Infrastructure GCP filtered by OCP options
const infrastructureGcpOcpOptions = [{ label: messages.perspectiveValues, value: 'gcp_ocp' }];

// Infrastructure IBM options
const infrastructureIbmOptions = [{ label: messages.perspectiveValues, value: 'ibm' }];

// Infrastructure IBM filtered by OCP options
const infrastructureIbmOcpOptions = [{ label: messages.perspectiveValues, value: 'ibm_ocp' }];

// Infrastructure Ocp cloud options
const infrastructureOcpCloudOptions = [{ label: messages.perspectiveValues, value: 'ocp_cloud' }];

class OverviewBase extends React.Component<OverviewProps> {
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

    if (this.isOcpAvailable()) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: OverviewTab.ocp,
      });
    }
    if (
      this.isAwsAvailable() ||
      this.isAzureAvailable() ||
      this.isGcpAvailable() ||
      this.isIbmAvailable() ||
      this.isOciAvailable() ||
      this.isOcpCloudAvailable()
    ) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: OverviewTab.infrastructure,
      });
    }
    return availableTabs;
  };

  private getCostType = () => {
    const { costType } = this.props;
    const { currentInfrastructurePerspective, currentOcpPerspective } = this.state;

    const currentItem =
      this.getCurrentTab() === OverviewTab.infrastructure ? currentInfrastructurePerspective : currentOcpPerspective;

    if (currentItem === InfrastructurePerspective.aws) {
      return (
        <div style={styles.costType}>
          <CostType onSelect={this.handleCostTypeSelected} costType={costType} />
        </div>
      );
    }
    return null;
  };

  private getCurrentTab = () => {
    const { activeTabKey } = this.state;

    const hasAws = this.isAwsAvailable();
    const hasAzure = this.isAzureAvailable();
    const hasOci = this.isOciAvailable();
    const hasGcp = this.isGcpAvailable();
    const hasIbm = this.isIbmAvailable();
    const hasOcp = this.isOcpAvailable();
    const hasOcpCloud = this.isOcpCloudAvailable();

    const showOcpOnly = hasOcp && !(hasAws || hasAzure || hasOci || hasGcp || hasIbm || hasOcpCloud);
    const showInfrastructureOnly = !hasOcp && (hasAws || hasAzure || hasOci || hasGcp || hasIbm || hasOcpCloud);

    if (showOcpOnly) {
      return OverviewTab.ocp;
    } else if (showInfrastructureOnly) {
      return OverviewTab.infrastructure;
    } else {
      return activeTabKey === 0 ? OverviewTab.ocp : OverviewTab.infrastructure;
    }
  };

  private getDefaultInfrastructurePerspective = () => {
    const { perspective } = this.props;

    // Upon page refresh, perspective param takes precedence
    switch (perspective) {
      case InfrastructurePerspective.aws:
      case InfrastructurePerspective.awsOcp:
      case InfrastructurePerspective.azure:
      case InfrastructurePerspective.oci:
      case InfrastructurePerspective.azureOcp:
      case InfrastructurePerspective.gcp:
      case InfrastructurePerspective.gcpOcp:
      case InfrastructurePerspective.ibm:
      case InfrastructurePerspective.ibmOcp:
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
    if (this.isOciAvailable()) {
      return InfrastructurePerspective.oci;
    }
    if (this.isGcpAvailable()) {
      return InfrastructurePerspective.gcp;
    }
    if (this.isIbmAvailable()) {
      return InfrastructurePerspective.ibm;
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
    const hasIbm = this.isIbmAvailable();
    const hasOci = this.isOciAvailable();
    const hasOcp = this.isOcpAvailable();

    // Note: No need to test OCP on cloud here, since that requires at least one provider
    if (!(hasAws || hasAzure || hasGcp || hasIbm || hasOci || hasOcp)) {
      return null;
    }

    // Dynamically show options if providers are available
    const options = [];
    if (this.getCurrentTab() === OverviewTab.infrastructure) {
      if (this.isOcpCloudAvailable()) {
        options.push(...infrastructureOcpCloudOptions);
      }
      if (hasAws) {
        options.push(...infrastructureAwsOptions);
      }
      if (this.isAwsOcpAvailable()) {
        options.push(...infrastructureAwsOcpOptions);
      }
      if (hasGcp) {
        options.push(...infrastructureGcpOptions);
      }
      if (isFeatureVisible(FeatureType.gcpOcp) && this.isGcpOcpAvailable()) {
        options.push(...infrastructureGcpOcpOptions);
      }
      if (hasIbm) {
        options.push(...infrastructureIbmOptions);
      }
      // Todo: Show in-progress features in beta environment only
      if (isFeatureVisible(FeatureType.ibm) && this.isIbmOcpAvailable()) {
        options.push(...infrastructureIbmOcpOptions);
      }
      if (hasAzure) {
        options.push(...infrastructureAzureOptions);
      }
      if (this.isAzureOcpAvailable()) {
        options.push(...infrastructureAzureOcpOptions);
      }
      // Todo: Show in-progress features in beta environment only
      if (isFeatureVisible(FeatureType.oci) && hasOci) {
        options.push(...infrastructureOciOptions);
      }
    } else {
      options.push(...ocpOptions);
    }

    const currentItem =
      this.getCurrentTab() === OverviewTab.infrastructure ? currentInfrastructurePerspective : currentOcpPerspective;

    return (
      <Perspective
        currentItem={currentItem || options[0].value}
        onSelected={this.handlePerspectiveSelected}
        options={options}
      />
    );
  };

  private getRouteForQuery = (query: OverviewQuery) => {
    const { history } = this.props;

    return `${history.location.pathname}?${getQueryRoute(query)}`;
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
    const { awsProviders, azureProviders, ociProviders, costType, gcpProviders, ibmProviders, ocpProviders } =
      this.props;
    const { activeTabKey, currentInfrastructurePerspective, currentOcpPerspective } = this.state;

    const emptyTab = <></>; // Lazily load tabs
    const noData = <NoData showReload={false} />;

    if (activeTabKey !== index) {
      return emptyTab;
    }

    const currentTab = getIdKeyForTab(tab);
    if (currentTab === OverviewTab.infrastructure) {
      if (currentInfrastructurePerspective === InfrastructurePerspective.ocpCloud) {
        const hasData =
          hasCloudData(awsProviders, ocpProviders) ||
          hasCloudData(azureProviders, ocpProviders) ||
          hasCloudData(gcpProviders, ocpProviders) ||
          hasCloudData(ibmProviders, ocpProviders);
        return hasData ? <OcpCloudDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.aws) {
        const hasData = hasCurrentMonthData(awsProviders) || hasPreviousMonthData(awsProviders);
        return hasData ? <AwsDashboard costType={costType} /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.awsOcp) {
        const hasData =
          hasCloudCurrentMonthData(awsProviders, ocpProviders) || hasCloudPreviousMonthData(awsProviders, ocpProviders);
        return hasData ? <AwsOcpDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.azure) {
        const hasData = hasCurrentMonthData(azureProviders) || hasPreviousMonthData(azureProviders);
        return hasData ? <AzureDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.azureOcp) {
        const hasData =
          hasCloudCurrentMonthData(azureProviders, ocpProviders) ||
          hasCloudPreviousMonthData(azureProviders, ocpProviders);
        return hasData ? <AzureOcpDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.gcp) {
        const hasData = hasCurrentMonthData(gcpProviders) || hasPreviousMonthData(gcpProviders);
        return hasData ? <GcpDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.gcpOcp) {
        const hasData =
          hasCloudCurrentMonthData(gcpProviders, ocpProviders) || hasCloudPreviousMonthData(gcpProviders, ocpProviders);
        return hasData ? <GcpOcpDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.ibm) {
        const hasData = hasCurrentMonthData(ibmProviders) || hasPreviousMonthData(ibmProviders);
        return hasData ? <IbmDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.oci) {
        const hasData = hasCurrentMonthData(ociProviders) || hasPreviousMonthData(ociProviders);
        return hasData ? <OciDashboard /> : noData;
      } else {
        return noData;
      }
    } else if (currentTab === OverviewTab.ocp) {
      const hasData = hasCurrentMonthData(ocpProviders) || hasPreviousMonthData(ocpProviders);
      if (currentOcpPerspective === OcpPerspective.ocp) {
        return hasData ? <OcpDashboard /> : noData;
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
      <Tabs activeKey={activeTabKey} onSelect={this.handleTabClick}>
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

  private handleCostTypeSelected = (value: string) => {
    const { history, query } = this.props;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      cost_type: value,
    };
    history.replace(this.getRouteForQuery(newQuery));
  };

  private handlePerspectiveSelected = (value: string) => {
    const { history, query } = this.props;
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
        history.replace(this.getRouteForQuery(newQuery));
      }
    );
  };

  private handleTabClick = (event, tabIndex) => {
    const { history, query } = this.props;
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
          history.replace(this.getRouteForQuery(newQuery));
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

  private isIbmAvailable = () => {
    const { ibmProviders, userAccess } = this.props;
    return isIbmAvailable(userAccess, ibmProviders);
  };

  private isIbmOcpAvailable = () => {
    const { ibmProviders, ocpProviders, userAccess } = this.props;
    return hasIbmAccess(userAccess) && hasCloudProvider(ibmProviders, ocpProviders);
  };

  private isOciAvailable = () => {
    const { ociProviders, userAccess } = this.props;
    return isOciAvailable(userAccess, ociProviders);
  };

  private isOcpAvailable = () => {
    const { ocpProviders, userAccess } = this.props;
    return isOcpAvailable(userAccess, ocpProviders);
  };

  private isOcpCloudAvailable = () => {
    const hasAwsOcp = this.isAwsOcpAvailable();
    const hasAzureOcp = this.isAzureOcpAvailable();
    const hasGcpOcp = this.isGcpOcpAvailable();
    const hasIbmOcp = this.isIbmOcpAvailable();

    return hasAwsOcp || hasAzureOcp || hasGcpOcp || hasIbmOcp;
  };

  public render() {
    const { providersFetchStatus, intl, userAccessFetchStatus } = this.props;

    // Note: No need to test OCP on cloud here, since that requires at least one provider
    const noProviders =
      providersFetchStatus === FetchStatus.complete &&
      !this.isAwsAvailable() &&
      !this.isAzureAvailable() &&
      !this.isGcpAvailable() &&
      !this.isIbmAvailable() &&
      !this.isOciAvailable() &&
      !this.isOcpAvailable();

    const isLoading =
      providersFetchStatus === FetchStatus.inProgress || userAccessFetchStatus === FetchStatus.inProgress;

    const availableTabs = this.getAvailableTabs();
    const title = intl.formatMessage(messages.overviewTitle);

    if (isLoading) {
      return <Loading title={title} />;
    } else if (noProviders) {
      return <NoProviders title={title} />;
    }
    return (
      <>
        <header style={styles.header}>
          <div style={styles.headerContent}>
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
                      {isFeatureVisible(FeatureType.ibm) && (
                        <>
                          <br />
                          <p style={styles.infoTitle}>{intl.formatMessage(messages.ibm)}</p>
                          <p>{intl.formatMessage(messages.ibmDesc)}</p>
                        </>
                      )}
                      <br />
                      <p style={styles.infoTitle}>{intl.formatMessage(messages.azure)}</p>
                      <p>{intl.formatMessage(messages.azureDesc)}</p>
                      {isFeatureVisible(FeatureType.oci) && (
                        <>
                          <br />
                          <p style={styles.infoTitle}>{intl.formatMessage(messages.oci)}</p>
                          <p>{intl.formatMessage(messages.ociDesc)}</p>
                        </>
                      )}
                    </>
                  }
                >
                  <Button variant={ButtonVariant.plain}>
                    <OutlinedQuestionCircleIcon />
                  </Button>
                </Popover>
              </span>
            </Title>
            <div style={styles.headerContentRight}>
              {/* Todo: Show in-progress features in beta environment only */}
              {isFeatureVisible(FeatureType.currency) && <Currency />}
            </div>
          </div>
          <div style={styles.tabs}>{this.getTabs(availableTabs)}</div>
          <div style={styles.headerContent}>
            <div style={styles.headerContentLeft}>
              {this.getPerspective()}
              {this.getCostType()}
            </div>
            <div style={styles.date}>{getSinceDateRangeString()}</div>
          </div>
        </header>
        <div style={styles.main}>{this.getTabContent(availableTabs)}</div>
      </>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OverviewOwnProps, OverviewStateProps>((state, props) => {
  const queryFromRoute = parseQuery<OverviewQuery>(location.search);
  const costType = getCostType();
  const perspective = queryFromRoute.perspective;
  const tabKey = queryFromRoute.tabKey && !Number.isNaN(queryFromRoute.tabKey) ? Number(queryFromRoute.tabKey) : 0;

  const query = {
    ...(perspective && { perspective }),
    tabKey,
    ...(perspective === InfrastructurePerspective.aws && { cost_type: costType }),
  };
  const queryString = getQuery(query);

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
    gcpProviders: filterProviders(providers, ProviderType.gcp),
    ibmProviders: filterProviders(providers, ProviderType.ibm),
    ociProviders: filterProviders(providers, ProviderType.oci),
    ocpProviders: filterProviders(providers, ProviderType.ocp),
    costType,
    providers,
    providersError,
    providersFetchStatus,
    perspective,
    query,
    queryString,
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

const Overview = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OverviewBase));

export default Overview;
