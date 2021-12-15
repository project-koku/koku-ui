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
import { Currency } from 'components/currency/currency';
import messages from 'locales/messages';
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
import {
  awsProvidersQuery,
  azureProvidersQuery,
  gcpProvidersQuery,
  ibmProvidersQuery,
  ocpProvidersQuery,
  providersSelectors,
} from 'store/providers';
import { uiActions } from 'store/ui';
import { allUserAccessQuery, ibmUserAccessQuery, userAccessSelectors } from 'store/userAccess';
import { getSinceDateRangeString } from 'utils/dateRange';
import { isBetaFeature } from 'utils/feature';
import { getCostType } from 'utils/localStorage';
import {
  hasAwsAccess,
  hasAzureAccess,
  hasGcpAccess,
  hasIbmAccess,
  isAwsAvailable,
  isAzureAvailable,
  isGcpAvailable,
  isIbmAvailable,
  isOcpAvailable,
} from 'utils/userAccess';

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
  resetState: typeof uiActions.resetState;
}

interface OverviewStateProps {
  awsProviders: Providers;
  awsProvidersFetchStatus: FetchStatus;
  awsProvidersQueryString: string;
  azureProviders: Providers;
  azureProvidersFetchStatus: FetchStatus;
  azureProvidersQueryString: string;
  gcpProviders: Providers;
  gcpProvidersFetchStatus: FetchStatus;
  gcpProvidersQueryString: string;
  ibmProviders: Providers;
  ibmProvidersFetchStatus: FetchStatus;
  ibmProvidersQueryString: string;
  ibmUserAccess: UserAccess;
  ibmUserAccessError: AxiosError;
  ibmUserAccessFetchStatus: FetchStatus;
  ibmUserAccessQueryString: string;
  ocpProviders: Providers;
  ocpProvidersFetchStatus: FetchStatus;
  ocpProvidersQueryString: string;
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
  costType?: string;
  currentInfrastructurePerspective?: string;
  currentOcpPerspective?: string;
}

type OverviewProps = OverviewOwnProps & OverviewStateProps & OverviewDispatchProps;

// Ocp options
const ocpOptions = [{ label: messages.PerspectiveValues, value: 'ocp' }];

// Infrastructure AWS options
const infrastructureAwsOptions = [{ label: messages.PerspectiveValues, value: 'aws' }];

// Infrastructure AWS filtered by OpenShift options
const infrastructureAwsOcpOptions = [{ label: messages.PerspectiveValues, value: 'aws_ocp' }];

// Infrastructure Azure options
const infrastructureAzureOptions = [{ label: messages.PerspectiveValues, value: 'azure' }];

// Infrastructure Azure filtered by OpenShift options
const infrastructureAzureOcpOptions = [{ label: messages.PerspectiveValues, value: 'azure_ocp' }];

// Infrastructure GCP options
const infrastructureGcpOptions = [{ label: messages.PerspectiveValues, value: 'gcp' }];

// Infrastructure GCP filtered by OCP options
//
// Todo: Temp disabled -- see https://issues.redhat.com/browse/COST-1705
//
// const infrastructureGcpOcpOptions = [{ label: messages.PerspectiveValues, value: 'gcp_ocp' }];

// Infrastructure IBM options
const infrastructureIbmOptions = [{ label: messages.PerspectiveValues, value: 'ibm' }];

// Infrastructure Ocp cloud options
const infrastructureOcpCloudOptions = [{ label: messages.PerspectiveValues, value: 'ocp_cloud' }];

class OverviewBase extends React.Component<OverviewProps> {
  protected defaultState: OverviewState = {
    activeTabKey: 0,
  };
  public state: OverviewState = { ...this.defaultState };

  public componentDidMount() {
    const { resetState, tabKey } = this.props;

    resetState(); // Clear cached API responses

    this.setState({
      activeTabKey: tabKey,
      currentInfrastructurePerspective: this.getDefaultInfrastructurePerspective(),
      currentOcpPerspective: this.getDefaultOcpPerspective(),
    });
  }

  public componentDidUpdate(prevProps: OverviewProps) {
    const { awsProviders, azureProviders, gcpProviders, ibmProviders, ocpProviders, tabKey, userAccess } = this.props;

    // Note: User access and providers are fetched via the Permissions and InactiveSources components used by all routes
    if (
      prevProps.userAccess !== userAccess ||
      prevProps.awsProviders !== awsProviders ||
      prevProps.azureProviders !== azureProviders ||
      prevProps.gcpProviders !== gcpProviders ||
      prevProps.ibmProviders !== ibmProviders ||
      prevProps.ocpProviders !== ocpProviders
    ) {
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
    const { currentInfrastructurePerspective, currentOcpPerspective } = this.state;

    const currentItem =
      this.getCurrentTab() === OverviewTab.infrastructure ? currentInfrastructurePerspective : currentOcpPerspective;

    if (currentItem === InfrastructurePerspective.aws) {
      return (
        <div style={styles.costType}>
          <CostType onSelect={this.handleCostTypeSelected} />
        </div>
      );
    }
    return null;
  };

  private getCurrentTab = () => {
    const { activeTabKey } = this.state;

    const hasAws = this.isAwsAvailable();
    const hasAzure = this.isAzureAvailable();
    const hasGcp = this.isGcpAvailable();
    const hasIbm = this.isIbmAvailable();
    const hasOcp = this.isOcpAvailable();
    const hasOcpCloud = this.isOcpCloudAvailable();

    const showOcpOnly = hasOcp && !(hasAws || hasAzure || hasGcp || hasIbm || hasOcpCloud);
    const showInfrastructureOnly = !hasOcp && (hasAws || hasAzure || hasGcp || hasIbm || hasOcpCloud);

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
      case InfrastructurePerspective.azureOcp:
      case InfrastructurePerspective.gcp:
      case InfrastructurePerspective.gcpOcp:
      case InfrastructurePerspective.ibm:
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
    const hasOcp = this.isOcpAvailable();

    // Note: No need to test OCP on cloud here, since that requires at least one provider
    if (!(hasAws || hasAzure || hasGcp || hasIbm || hasOcp)) {
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
      if (this.isAwsCloudAvailable()) {
        options.push(...infrastructureAwsOcpOptions);
      }
      if (hasGcp) {
        options.push(...infrastructureGcpOptions);
      }

      // Todo: Temp disabled -- see https://issues.redhat.com/browse/COST-1705
      //
      // if (this.isGcpCloudAvailable()) {
      //   options.push(...infrastructureGcpOcpOptions);
      // }

      if (hasIbm) {
        options.push(...infrastructureIbmOptions);
      }
      if (hasAzure) {
        options.push(...infrastructureAzureOptions);
      }
      if (this.isAzureCloudAvailable()) {
        options.push(...infrastructureAzureOcpOptions);
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
    const { awsProviders, azureProviders, gcpProviders, ibmProviders, ocpProviders } = this.props;
    const { activeTabKey, costType, currentInfrastructurePerspective, currentOcpPerspective } = this.state;
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
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.azure) {
        const hasData = hasCurrentMonthData(azureProviders) || hasPreviousMonthData(azureProviders);
        return hasData ? <AzureDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.azureOcp) {
        const hasData =
          hasCloudCurrentMonthData(azureProviders, ocpProviders) ||
          hasCloudPreviousMonthData(azureProviders, ocpProviders);
        return hasData ? <AzureOcpDashboard /> : noData;
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
      return intl.formatMessage(messages.Infrastructure);
    } else if (tab === OverviewTab.ocp) {
      return intl.formatMessage(messages.OpenShift);
    }
  };

  private handleCostTypeSelected = (value: string) => {
    const { history, query } = this.props;

    // Needed to force tab items to update
    this.setState({ costType: value }, () => {
      // Need param to restore cost type upon page refresh
      const newQuery = {
        ...JSON.parse(JSON.stringify(query)),
        cost_type: value,
      };
      history.replace(this.getRouteForQuery(newQuery));
    });
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
          ...(value === InfrastructurePerspective.aws && { cost_type: getCostType() }),
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

  private isAwsCloudAvailable = () => {
    const { awsProviders, ocpProviders, userAccess } = this.props;
    return hasAwsAccess(userAccess) && hasCloudProvider(awsProviders, ocpProviders);
  };

  private isAzureAvailable = () => {
    const { azureProviders, userAccess } = this.props;
    return isAzureAvailable(userAccess, azureProviders);
  };

  private isAzureCloudAvailable = () => {
    const { azureProviders, ocpProviders, userAccess } = this.props;
    return hasAzureAccess(userAccess) && hasCloudProvider(azureProviders, ocpProviders);
  };

  private isGcpAvailable = () => {
    const { gcpProviders, userAccess } = this.props;
    return isGcpAvailable(userAccess, gcpProviders);
  };

  private isGcpCloudAvailable = () => {
    const { gcpProviders, ocpProviders, userAccess } = this.props;
    return hasGcpAccess(userAccess) && hasCloudProvider(gcpProviders, ocpProviders);
  };

  private isIbmAvailable = () => {
    const { ibmProviders, ibmUserAccess } = this.props;
    return isIbmAvailable(ibmUserAccess, ibmProviders);
  };

  private isIbmCloudAvailable = () => {
    const { ibmProviders, ocpProviders, userAccess } = this.props;
    return hasIbmAccess(userAccess) && hasCloudProvider(ibmProviders, ocpProviders);
  };

  private isOcpAvailable = () => {
    const { ocpProviders, userAccess } = this.props;
    return isOcpAvailable(userAccess, ocpProviders);
  };

  private isOcpCloudAvailable = () => {
    const hasAwsCloud = this.isAwsCloudAvailable();
    const hasAzureCloud = this.isAzureCloudAvailable();
    const hasGcpCloud = this.isGcpCloudAvailable();
    const hasIbmCloud = this.isIbmCloudAvailable();

    return hasAwsCloud || hasAzureCloud || hasGcpCloud || hasIbmCloud;
  };

  public render() {
    const {
      awsProvidersFetchStatus,
      azureProvidersFetchStatus,
      gcpProvidersFetchStatus,
      ibmProvidersFetchStatus,
      intl,
      ocpProvidersFetchStatus,
      userAccessFetchStatus,
    } = this.props;

    // Note: No need to test OCP on cloud here, since that requires at least one provider
    const noAwsProviders = !this.isAwsAvailable() && awsProvidersFetchStatus === FetchStatus.complete;
    const noAzureProviders = !this.isAzureAvailable() && azureProvidersFetchStatus === FetchStatus.complete;
    const noGcpProviders = !this.isGcpAvailable() && gcpProvidersFetchStatus === FetchStatus.complete;
    const noIbmProviders = !this.isIbmAvailable() && ibmProvidersFetchStatus === FetchStatus.complete;
    const noOcpProviders = !this.isOcpAvailable() && ocpProvidersFetchStatus === FetchStatus.complete;
    const noProviders = noAwsProviders && noAzureProviders && noGcpProviders && noIbmProviders && noOcpProviders;

    const isLoading =
      awsProvidersFetchStatus === FetchStatus.inProgress ||
      azureProvidersFetchStatus === FetchStatus.inProgress ||
      gcpProvidersFetchStatus === FetchStatus.inProgress ||
      ibmProvidersFetchStatus === FetchStatus.inProgress ||
      ocpProvidersFetchStatus === FetchStatus.inProgress ||
      userAccessFetchStatus === FetchStatus.inProgress;

    const availableTabs = this.getAvailableTabs();
    const title = intl.formatMessage(messages.OverviewTitle);

    if (noProviders) {
      return <NoProviders title={title} />;
    } else if (isLoading) {
      return <Loading title={title} />;
    }
    return (
      <>
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <Title headingLevel="h1" size={TitleSizes['2xl']}>
              {title}
              <span style={styles.infoIcon}>
                <Popover
                  aria-label={intl.formatMessage(messages.OverviewInfoArialLabel)}
                  enableFlip
                  bodyContent={
                    <>
                      <p style={styles.infoTitle}>{intl.formatMessage(messages.OpenShiftCloudInfrastructure)}</p>
                      <p>{intl.formatMessage(messages.OpenShiftCloudInfrastructureDesc)}</p>
                      <br />
                      <p style={styles.infoTitle}>{intl.formatMessage(messages.OpenShift)}</p>
                      <p>{intl.formatMessage(messages.OpenShiftDesc)}</p>
                      <br />
                      <p style={styles.infoTitle}>{intl.formatMessage(messages.GCP)}</p>
                      <p>{intl.formatMessage(messages.GCPDesc)}</p>
                      {/* Todo: Show in-progress features in beta environment only */}
                      {isBetaFeature() && (
                        <>
                          <br />
                          <p style={styles.infoTitle}>{intl.formatMessage(messages.IBM)}</p>
                          <p>{intl.formatMessage(messages.IBMDesc)}</p>
                        </>
                      )}
                      <br />
                      <p style={styles.infoTitle}>{intl.formatMessage(messages.AWS)}</p>
                      <p>{intl.formatMessage(messages.AWSDesc)}</p>
                      <br />
                      <p style={styles.infoTitle}>{intl.formatMessage(messages.Azure)}</p>
                      <p>{intl.formatMessage(messages.AzureDesc)}</p>
                    </>
                  }
                >
                  <Button variant={ButtonVariant.plain}>
                    <OutlinedQuestionCircleIcon />
                  </Button>
                </Popover>
              </span>
            </Title>
            {/* Todo: Show in-progress features in beta environment only */}
            {isBetaFeature() && <Currency />}
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

  const perspective = queryFromRoute.perspective;
  const tabKey = queryFromRoute.tabKey && !Number.isNaN(queryFromRoute.tabKey) ? Number(queryFromRoute.tabKey) : 0;

  const query = {
    ...(perspective && { perspective }),
    tabKey,
    ...(perspective === InfrastructurePerspective.aws && { cost_type: queryFromRoute.cost_type }),
  };
  const queryString = getQuery(query);

  const awsProvidersQueryString = getProvidersQuery(awsProvidersQuery);
  const awsProviders = providersSelectors.selectProviders(state, ProviderType.aws, awsProvidersQueryString);
  const awsProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.aws,
    awsProvidersQueryString
  );

  const azureProvidersQueryString = getProvidersQuery(azureProvidersQuery);
  const azureProviders = providersSelectors.selectProviders(state, ProviderType.azure, azureProvidersQueryString);
  const azureProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.azure,
    azureProvidersQueryString
  );

  const gcpProvidersQueryString = getProvidersQuery(gcpProvidersQuery);
  const gcpProviders = providersSelectors.selectProviders(state, ProviderType.gcp, gcpProvidersQueryString);
  const gcpProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.gcp,
    gcpProvidersQueryString
  );

  const ibmProvidersQueryString = getProvidersQuery(ibmProvidersQuery);
  const ibmProviders = providersSelectors.selectProviders(state, ProviderType.ibm, ibmProvidersQueryString);
  const ibmProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ibm,
    ibmProvidersQueryString
  );

  const ocpProvidersQueryString = getProvidersQuery(ocpProvidersQuery);
  const ocpProviders = providersSelectors.selectProviders(state, ProviderType.ocp, ocpProvidersQueryString);
  const ocpProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
  );

  const userAccessQueryString = getUserAccessQuery(allUserAccessQuery);
  const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
  const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
  const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.all,
    userAccessQueryString
  );

  // Todo: temporarily request IBM separately with beta flag.
  const ibmUserAccessQueryString = getUserAccessQuery(ibmUserAccessQuery);
  const ibmUserAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.ibm, ibmUserAccessQueryString);
  const ibmUserAccessError = userAccessSelectors.selectUserAccessError(
    state,
    UserAccessType.ibm,
    ibmUserAccessQueryString
  );
  const ibmUserAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.ibm,
    ibmUserAccessQueryString
  );

  return {
    awsProviders,
    awsProvidersFetchStatus,
    awsProvidersQueryString,
    azureProviders,
    azureProvidersFetchStatus,
    azureProvidersQueryString,
    gcpProviders,
    gcpProvidersFetchStatus,
    gcpProvidersQueryString,
    ibmProviders,
    ibmProvidersFetchStatus,
    ibmProvidersQueryString,
    ibmUserAccess,
    ibmUserAccessError,
    ibmUserAccessFetchStatus,
    ibmUserAccessQueryString,
    ocpProviders,
    ocpProvidersFetchStatus,
    ocpProvidersQueryString,
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
  resetState: uiActions.resetState,
};

const Overview = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OverviewBase));

export default Overview;
