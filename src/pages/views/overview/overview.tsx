import './overview.scss';

import { Button, ButtonVariant, Popover, Tab, TabContent, Tabs, TabTitleText, Title } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import Loading from 'pages/state/loading';
import NoData from 'pages/state/noData/noData';
import NoProviders from 'pages/state/noProviders';
import { Perspective } from 'pages/views/components/perspective/perspective';
import AwsCloudDashboard from 'pages/views/overview/awsCloudDashboard';
import AwsDashboard from 'pages/views/overview/awsDashboard';
import AzureCloudDashboard from 'pages/views/overview/azureCloudDashboard';
import AzureDashboard from 'pages/views/overview/azureDashboard';
import GcpDashboard from 'pages/views/overview/gcpDashboard';
import IbmDashboard from 'pages/views/overview/ibmDashboard';
import OcpCloudDashboard from 'pages/views/overview/ocpCloudDashboard';
import OcpDashboard from 'pages/views/overview/ocpDashboard';
import OcpSupplementaryDashboard from 'pages/views/overview/ocpSupplementaryDashboard';
import OcpUsageDashboard from 'pages/views/overview/ocpUsageDashboard';
import { hasCurrentMonthData, hasPreviousMonthData } from 'pages/views/utils/providers';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
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
import { allUserAccessQuery, ibmUserAccessQuery, userAccessSelectors } from 'store/userAccess';
import { isAwsAvailable, isAzureAvailable, isGcpAvailable, isIbmAvailable, isOcpAvailable } from 'utils/userAccess';

import { styles } from './overview.styles';

// eslint-disable-next-line no-shadow
const enum InfrastructurePerspective {
  aws = 'aws',
  awsCloud = 'aws_cloud', // Aws filtered by Ocp
  azure = 'azure',
  azureCloud = 'azure_cloud', // Azure filtered by Ocp
  gcp = 'gcp',
  ibm = 'ibm',
  ocpCloud = 'ocp_cloud', // All filtered by Ocp
  ocpUsage = 'ocp_usage',
}

// eslint-disable-next-line no-shadow
const enum OcpPerspective {
  all = 'all',
  supplementary = 'supplementary',
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

type OverviewOwnProps = RouteComponentProps<void> & WithTranslation;

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

type OverviewProps = OverviewOwnProps & OverviewStateProps;

// Ocp options
const ocpOptions = [
  { label: 'overview.perspective.all', value: 'all' },
  { label: 'overview.perspective.supplementary', value: 'supplementary' },
];

// Infrastructure AWS options
const infrastructureAwsOptions = [{ label: 'overview.perspective.aws', value: 'aws' }];

// Infrastructure AWS cloud options
const infrastructureAwsCloudOptions = [{ label: 'overview.perspective.aws_cloud', value: 'aws_cloud' }];

// Infrastructure Azure options
const infrastructureAzureOptions = [{ label: 'overview.perspective.azure', value: 'azure' }];

// Infrastructure Azure cloud options
const infrastructureAzureCloudOptions = [{ label: 'overview.perspective.azure_cloud', value: 'azure_cloud' }];

// Infrastructure GCP options
const infrastructureGcpOptions = [{ label: 'overview.perspective.gcp', value: 'gcp' }];

// Infrastructure IBM options
const infrastructureIbmOptions = [{ label: 'overview.perspective.ibm', value: 'ibm' }];

// Infrastructure Ocp options
const infrastructureOcpOptions = [{ label: 'overview.perspective.ocp_usage', value: 'ocp_usage' }];

// Infrastructure Ocp cloud options
const infrastructureOcpCloudOptions = [{ label: 'overview.perspective.ocp_cloud', value: 'ocp_cloud' }];

class OverviewBase extends React.Component<OverviewProps> {
  protected defaultState: OverviewState = {
    activeTabKey: 0,
  };
  public state: OverviewState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      currentInfrastructurePerspective: this.getDefaultInfrastructurePerspective(),
      currentOcpPerspective: this.getDefaultOcpPerspective(),
    });
  }

  public componentDidUpdate(prevProps: OverviewProps) {
    const { awsProviders, azureProviders, gcpProviders, ibmProviders, ocpProviders, userAccess } = this.props;

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

  private getCurrentTab = () => {
    const { activeTabKey } = this.state;

    const aws = this.isAwsAvailable();
    const azure = this.isAzureAvailable();
    const gcp = this.isGcpAvailable();
    const ibm = this.isIbmAvailable();
    const ocp = this.isOcpAvailable();
    const ocpCloud = this.isOcpCloudAvailable();

    const showOcpOnly = ocp && !(aws || azure || gcp || ibm || ocpCloud);
    const showInfrastructureOnly = !ocp && (aws || azure || gcp || ibm || ocpCloud);

    if (showOcpOnly) {
      return OverviewTab.ocp;
    } else if (showInfrastructureOnly) {
      return OverviewTab.infrastructure;
    } else {
      return activeTabKey === 0 ? OverviewTab.ocp : OverviewTab.infrastructure;
    }
  };

  private getDefaultInfrastructurePerspective = () => {
    if (this.isOcpAvailable()) {
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
    const { ocpProviders, ocpProvidersFetchStatus, userAccess } = this.props;

    if (isOcpAvailable(userAccess, ocpProviders, ocpProvidersFetchStatus)) {
      return OcpPerspective.all;
    }
    return undefined;
  };

  private getPerspective = () => {
    const { currentInfrastructurePerspective, currentOcpPerspective } = this.state;

    const aws = this.isAwsAvailable();
    const azure = this.isAzureAvailable();
    const gcp = this.isGcpAvailable();
    const ibm = this.isIbmAvailable();
    const ocp = this.isOcpAvailable();

    if (!(aws || azure || gcp || ibm || ocp)) {
      return null;
    }

    // Dynamically show options if providers are available
    const options = [];
    if (this.getCurrentTab() === OverviewTab.infrastructure) {
      if (ocp) {
        options.push(...infrastructureOcpCloudOptions);
      }
      if (aws) {
        options.push(...infrastructureAwsOptions);
      }
      if (ocp && aws) {
        options.push(...infrastructureAwsCloudOptions);
      }
      if (gcp) {
        options.push(...infrastructureGcpOptions);
      }
      if (ibm) {
        options.push(...infrastructureIbmOptions);
      }
      if (azure) {
        options.push(...infrastructureAzureOptions);
      }
      if (ocp && azure) {
        options.push(...infrastructureAzureCloudOptions);
      }
      if (ocp) {
        options.push(...infrastructureOcpOptions);
      }
    } else {
      options.push(...ocpOptions);
    }

    const currentItem =
      this.getCurrentTab() === OverviewTab.infrastructure ? currentInfrastructurePerspective : currentOcpPerspective;

    return (
      <Perspective
        currentItem={currentItem || options[0].value}
        onItemClicked={this.handlePerspectiveClick}
        options={options}
      />
    );
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
    const { activeTabKey, currentInfrastructurePerspective, currentOcpPerspective } = this.state;
    const emptyTab = <></>; // Lazily load tabs
    const noData = <NoData showReload={false} />;

    if (activeTabKey !== index) {
      return emptyTab;
    }
    const currentTab = getIdKeyForTab(tab);
    if (currentTab === OverviewTab.infrastructure) {
      if (currentInfrastructurePerspective === InfrastructurePerspective.ocpCloud) {
        const hasData = hasCurrentMonthData(ocpProviders) || hasPreviousMonthData(ocpProviders);
        return hasData ? <OcpCloudDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.aws) {
        const hasData = hasCurrentMonthData(awsProviders) || hasPreviousMonthData(awsProviders);
        return hasData ? <AwsDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.awsCloud) {
        const hasData = hasCurrentMonthData(awsProviders) || hasPreviousMonthData(awsProviders);
        return hasData ? <AwsCloudDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.gcp) {
        const hasData = hasCurrentMonthData(gcpProviders) || hasPreviousMonthData(gcpProviders);
        return hasData ? <GcpDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.ibm) {
        const hasData = hasCurrentMonthData(ibmProviders) || hasPreviousMonthData(ibmProviders);
        return hasData ? <IbmDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.azure) {
        const hasData = hasCurrentMonthData(azureProviders) || hasPreviousMonthData(azureProviders);
        return hasData ? <AzureDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.azureCloud) {
        const hasData = hasCurrentMonthData(azureProviders) || hasPreviousMonthData(azureProviders);
        return hasData ? <AzureCloudDashboard /> : noData;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.ocpUsage) {
        const hasData = hasCurrentMonthData(ocpProviders) || hasPreviousMonthData(ocpProviders);
        return hasData ? <OcpUsageDashboard /> : noData;
      } else {
        const hasData = hasCurrentMonthData(ocpProviders) || hasPreviousMonthData(ocpProviders);
        return hasData ? <OcpCloudDashboard /> : noData; // default
      }
    } else if (currentTab === OverviewTab.ocp) {
      const hasData = hasCurrentMonthData(ocpProviders) || hasPreviousMonthData(ocpProviders);
      if (currentOcpPerspective === OcpPerspective.all) {
        return hasData ? <OcpDashboard /> : noData;
      } else if (currentOcpPerspective === OcpPerspective.supplementary) {
        return hasData ? <OcpSupplementaryDashboard /> : noData;
      } else {
        return hasData ? <OcpDashboard /> : noData; // default
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
    const { t } = this.props;

    if (tab === OverviewTab.infrastructure) {
      return t('overview.infrastructure');
    } else if (tab === OverviewTab.ocp) {
      return t('overview.ocp');
    }
  };

  private handlePerspectiveClick = (value: string) => {
    const currentTab = this.getCurrentTab();
    this.setState({
      ...(currentTab === OverviewTab.infrastructure && {
        currentInfrastructurePerspective: value,
      }),
      ...(currentTab === OverviewTab.ocp && { currentOcpPerspective: value }),
    });
  };

  private handleTabClick = (event, tabIndex) => {
    const { activeTabKey } = this.state;
    if (activeTabKey !== tabIndex) {
      this.setState({
        activeTabKey: tabIndex,
      });
    }
  };

  private isAwsAvailable = () => {
    const { awsProviders, awsProvidersFetchStatus, userAccess } = this.props;
    return isAwsAvailable(userAccess, awsProviders, awsProvidersFetchStatus);
  };

  private isAzureAvailable = () => {
    const { azureProviders, azureProvidersFetchStatus, userAccess } = this.props;
    return isAzureAvailable(userAccess, azureProviders, azureProvidersFetchStatus);
  };

  private isGcpAvailable = () => {
    const { gcpProviders, gcpProvidersFetchStatus, userAccess } = this.props;
    return isGcpAvailable(userAccess, gcpProviders, gcpProvidersFetchStatus);
  };

  private isIbmAvailable = () => {
    const { ibmProviders, ibmProvidersFetchStatus, ibmUserAccess } = this.props;
    return isIbmAvailable(ibmUserAccess, ibmProviders, ibmProvidersFetchStatus);
  };

  private isOcpAvailable = () => {
    const { ocpProviders, ocpProvidersFetchStatus, userAccess } = this.props;
    return isOcpAvailable(userAccess, ocpProviders, ocpProvidersFetchStatus);
  };

  private isOcpCloudAvailable = () => {
    return this.isAwsAvailable() && this.isOcpAvailable();
  };

  public render() {
    const {
      awsProvidersFetchStatus,
      azureProvidersFetchStatus,
      gcpProvidersFetchStatus,
      ibmProvidersFetchStatus,
      ocpProvidersFetchStatus,
      userAccessFetchStatus,
      t,
    } = this.props;
    const availableTabs = this.getAvailableTabs();
    const isLoading =
      awsProvidersFetchStatus === FetchStatus.inProgress ||
      azureProvidersFetchStatus === FetchStatus.inProgress ||
      gcpProvidersFetchStatus === FetchStatus.inProgress ||
      ibmProvidersFetchStatus === FetchStatus.inProgress ||
      ocpProvidersFetchStatus === FetchStatus.inProgress ||
      userAccessFetchStatus === FetchStatus.inProgress;

    // Test for no providers
    const noAwsProviders = !this.isAwsAvailable() && awsProvidersFetchStatus === FetchStatus.complete;
    const noAzureProviders = !this.isAzureAvailable() && azureProvidersFetchStatus === FetchStatus.complete;
    const noGcpProviders = !this.isGcpAvailable() && gcpProvidersFetchStatus === FetchStatus.complete;
    const noIbmProviders = !this.isIbmAvailable() && ibmProvidersFetchStatus === FetchStatus.complete;
    const noOcpProviders = !this.isOcpAvailable() && ocpProvidersFetchStatus === FetchStatus.complete;
    const noProviders = noAwsProviders && noAzureProviders && noGcpProviders && noIbmProviders && noOcpProviders;

    const title = t('cost_management_overview');

    if (noProviders) {
      return <NoProviders title={title} />;
    } else if (isLoading) {
      return <Loading title={title} />;
    }
    return (
      <>
        <section
          className={`pf-l-page-header pf-c-page-header pf-l-page__main-section pf-c-page__main-section pf-m-light headerOverride}`}
        >
          <header className="pf-u-display-flex pf-u-justify-content-space-between pf-u-align-items-center">
            <Title headingLevel="h2" size="2xl">
              {t('cost_management_overview')}
              <span style={styles.infoIcon}>
                <Popover
                  aria-label={t('ocp_details.supplementary_aria_label')}
                  enableFlip
                  bodyContent={
                    <>
                      <p style={styles.infoTitle}>{t('overview.ocp_cloud')}</p>
                      <p>{t('overview.ocp_cloud_desc')}</p>
                      <br />
                      <p style={styles.infoTitle}>{t('overview.ocp')}</p>
                      <p>{t('overview.ocp_desc')}</p>
                      <br />
                      <p style={styles.infoTitle}>{t('overview.gcp')}</p>
                      <p>{t('overview.gcp_desc')}</p>
                      <br />
                      <p style={styles.infoTitle}>{t('overview.ibm')}</p>
                      <p>{t('overview.ibm_desc')}</p>
                      <br />
                      <p style={styles.infoTitle}>{t('overview.aws')}</p>
                      <p>{t('overview.aws_desc')}</p>
                      <br />
                      <p style={styles.infoTitle}>{t('overview.azure')}</p>
                      <p>{t('overview.azure_desc')}</p>
                    </>
                  }
                >
                  <Button variant={ButtonVariant.plain}>
                    <OutlinedQuestionCircleIcon />
                  </Button>
                </Popover>
              </span>
            </Title>
          </header>
          <div style={styles.tabs}>{this.getTabs(availableTabs)}</div>
          <div style={styles.perspective}>{this.getPerspective()}</div>
        </section>
        <section className="pf-l-page__main-section pf-c-page__main-section" page-type="cost-management-overview">
          {this.getTabContent(availableTabs)}
        </section>
      </>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OverviewOwnProps, OverviewStateProps>((state, props) => {
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
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const Overview = withTranslation()(connect(mapStateToProps)(OverviewBase));

export default Overview;
