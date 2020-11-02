import './overview.scss';

import { Button, ButtonVariant, Popover, Tab, TabContent, Tabs, TabTitleText, Title } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import AwsCloudDashboard from 'pages/dashboard/awsCloudDashboard/awsCloudDashboard';
import AwsDashboard from 'pages/dashboard/awsDashboard/awsDashboard';
import AzureCloudDashboard from 'pages/dashboard/azureCloudDashboard/azureCloudDashboard';
import AzureDashboard from 'pages/dashboard/azureDashboard/azureDashboard';
import GcpDashboard from 'pages/dashboard/gcpDashboard/gcpDashboard';
import OcpCloudDashboard from 'pages/dashboard/ocpCloudDashboard/ocpCloudDashboard';
import OcpDashboard from 'pages/dashboard/ocpDashboard/ocpDashboard';
import OcpSupplementaryDashboard from 'pages/dashboard/ocpSupplementaryDashboard/ocpSupplementaryDashboard';
import OcpUsageDashboard from 'pages/dashboard/ocpUsageDashboard/ocpUsageDashboard';
import Loading from 'pages/state/loading';
import NoProviders from 'pages/state/noProviders';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  awsProvidersQuery,
  azureProvidersQuery,
  gcpProvidersQuery,
  ocpProvidersQuery,
  providersSelectors,
} from 'store/providers';
import {
  hasAwsPermissions,
  hasAzurePermissions,
  hasEntitledPermissions,
  hasGcpPermissions,
  hasOcpPermissions,
  hasOrgAdminPermissions,
} from 'utils/permissions';

import { styles } from './overview.styles';
import { Perspective } from './perspective';

// eslint-disable-next-line no-shadow
const enum InfrastructurePerspective {
  allCloud = 'all_cloud', // All filtered by Ocp
  aws = 'aws',
  awsFiltered = 'aws_cloud', // Aws filtered by Ocp
  azure = 'azure',
  azureCloud = 'azure_cloud', // Azure filtered by Ocp
  gcp = 'gcp',
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
  ocpProviders: Providers;
  ocpProvidersFetchStatus: FetchStatus;
  ocpProvidersQueryString: string;
}

interface AvailableTab {
  contentRef: React.ReactNode;
  tab: OverviewTab;
}

interface OverviewState {
  activeTabKey: number;
  currentInfrastructurePerspective?: string;
  currentOcpPerspective?: string;
  isAwsAccessAllowed?: boolean;
  isAzureAccessAllowed?: boolean;
  isGcpAccessAllowed?: boolean;
  isOcpAccessAllowed?: boolean;
}

type OverviewProps = OverviewOwnProps & OverviewStateProps;

// Ocp options
const ocpOptions = [
  { label: 'overview.perspective.all', value: 'all' },
  { label: 'overview.perspective.supplementary', value: 'supplementary' },
];

// Infrastructure all cloud options
const infrastructureAllCloudOptions = [{ label: 'overview.perspective.all_cloud', value: 'all_cloud' }];

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

// Infrastructure Ocp options
const infrastructureOcpOptions = [{ label: 'overview.perspective.ocp_usage', value: 'ocp_usage' }];

const getPermissions = async () => {
  const isEntitled = await hasEntitledPermissions();
  const isOrgAdmin = await hasOrgAdminPermissions();
  const isAwsAccessAllowed = isEntitled && (isOrgAdmin || (await hasAwsPermissions()));
  const isAzureAccessAllowed = isEntitled && (isOrgAdmin || (await hasAzurePermissions()));
  const isGcpAccessAllowed = isEntitled && (isOrgAdmin || (await hasGcpPermissions()));
  const isOcpAccessAllowed = isEntitled && (isOrgAdmin || (await hasOcpPermissions()));
  return {
    isAwsAccessAllowed,
    isAzureAccessAllowed,
    isGcpAccessAllowed,
    isOcpAccessAllowed,
  };
};

class OverviewBase extends React.Component<OverviewProps> {
  protected defaultState: OverviewState = {
    activeTabKey: 0,
    isAwsAccessAllowed: false,
    isAzureAccessAllowed: false,
    isGcpAccessAllowed: false,
    isOcpAccessAllowed: false,
  };
  public state: OverviewState = { ...this.defaultState };

  public componentDidMount() {
    getPermissions().then(({ isAwsAccessAllowed, isAzureAccessAllowed, isGcpAccessAllowed, isOcpAccessAllowed }) => {
      this.setState({
        currentInfrastructurePerspective: this.getDefaultInfrastructurePerspective(),
        currentOcpPerspective: this.getDefaultOcpPerspective(),
        isAwsAccessAllowed,
        isAzureAccessAllowed,
        isGcpAccessAllowed,
        isOcpAccessAllowed,
      });
    });
  }

  public componentDidUpdate(prevProps: OverviewProps) {
    const { awsProviders, azureProviders, gcpProviders, ocpProviders } = this.props;

    if (
      prevProps.awsProviders !== awsProviders ||
      prevProps.azureProviders !== azureProviders ||
      prevProps.gcpProviders !== gcpProviders ||
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

    const isAwsAvailable = this.isAwsAvailable();
    const isAzureAvailable = this.isAzureAvailable();
    const isGcpAvailable = this.isGcpAvailable();
    const isOcpAvailable = this.isOcpAvailable();
    const isOcpCloudAvailable = this.isOcpCloudAvailable();

    if (isOcpAvailable) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: OverviewTab.ocp,
      });
    }
    if (isAwsAvailable || isAzureAvailable || isGcpAvailable || isOcpCloudAvailable) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: OverviewTab.infrastructure,
      });
    }
    return availableTabs;
  };

  private getCurrentTab = () => {
    const { activeTabKey } = this.state;
    const isAwsAvailable = this.isAwsAvailable();
    const isAzureAvailable = this.isAzureAvailable();
    const isGcpAvailable = this.isGcpAvailable();
    const isOcpAvailable = this.isOcpAvailable();
    const isOcpCloudAvailable = this.isOcpCloudAvailable();

    const showOcpOnly =
      isOcpAvailable && !(isAwsAvailable || isAzureAvailable || isGcpAvailable || isOcpCloudAvailable);
    const showInfrastructureOnly =
      !isOcpAvailable && (isAwsAvailable || isAzureAvailable || isGcpAvailable || isOcpCloudAvailable);

    if (showOcpOnly) {
      return OverviewTab.ocp;
    } else if (showInfrastructureOnly) {
      return OverviewTab.infrastructure;
    } else {
      return activeTabKey === 0 ? OverviewTab.ocp : OverviewTab.infrastructure;
    }
  };

  private getDefaultInfrastructurePerspective = () => {
    const isAwsAvailable = this.isAwsAvailable();
    const isAzureAvailable = this.isAzureAvailable();
    const isGcpAvailable = this.isGcpAvailable();
    const isOcpAvailable = this.isOcpAvailable();

    if (isOcpAvailable) {
      return InfrastructurePerspective.allCloud;
    }
    if (isAwsAvailable) {
      return InfrastructurePerspective.aws;
    }
    if (isAzureAvailable) {
      return InfrastructurePerspective.azure;
    }
    if (isGcpAvailable) {
      return InfrastructurePerspective.gcp;
    }
    return undefined;
  };

  private getDefaultOcpPerspective = () => {
    const isOcpAvailable = this.isOcpAvailable();

    if (isOcpAvailable) {
      return OcpPerspective.all;
    }
    return undefined;
  };

  private getPerspective = () => {
    const { currentInfrastructurePerspective, currentOcpPerspective } = this.state;

    const isAwsAvailable = this.isAwsAvailable();
    const isAzureAvailable = this.isAzureAvailable();
    const isGcpAvailable = this.isGcpAvailable();
    const isOcpAvailable = this.isOcpAvailable();

    if (!(isAwsAvailable || isAzureAvailable || isGcpAvailable || isOcpAvailable)) {
      return null;
    }

    // Dynamically show options if providers are available
    const options = [];
    if (this.getCurrentTab() === OverviewTab.infrastructure) {
      if (isOcpAvailable) {
        options.push(...infrastructureAllCloudOptions);
      }
      if (isAwsAvailable) {
        options.push(...infrastructureAwsOptions);
      }
      if (isOcpAvailable && isAwsAvailable) {
        options.push(...infrastructureAwsCloudOptions);
      }
      if (isAzureAvailable) {
        options.push(...infrastructureAzureOptions);
      }
      if (isGcpAvailable) {
        options.push(...infrastructureGcpOptions);
      }
      if (isOcpAvailable && isAzureAvailable) {
        options.push(...infrastructureAzureCloudOptions);
      }
      if (isOcpAvailable) {
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
    const { activeTabKey, currentInfrastructurePerspective, currentOcpPerspective } = this.state;
    const emptyTab = <></>; // Lazily load tabs

    if (activeTabKey !== index) {
      return emptyTab;
    }
    const currentTab = getIdKeyForTab(tab);
    if (currentTab === OverviewTab.infrastructure) {
      if (currentInfrastructurePerspective === InfrastructurePerspective.allCloud) {
        return <OcpCloudDashboard />;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.aws) {
        return <AwsDashboard />;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.awsFiltered) {
        return <AwsCloudDashboard />;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.azure) {
        return <AzureDashboard />;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.azureCloud) {
        return <AzureCloudDashboard />;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.gcp) {
        return <GcpDashboard />;
      } else if (currentInfrastructurePerspective === InfrastructurePerspective.ocpUsage) {
        return <OcpUsageDashboard />;
      } else {
        return <OcpCloudDashboard />; // default
      }
    } else if (currentTab === OverviewTab.ocp) {
      if (currentOcpPerspective === OcpPerspective.all) {
        return <OcpDashboard />;
      } else if (currentOcpPerspective === OcpPerspective.supplementary) {
        return <OcpSupplementaryDashboard />;
      } else {
        return <OcpDashboard />; // default
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
    const { awsProviders } = this.props;
    const { isAwsAccessAllowed } = this.state;

    return (
      // API returns empy data array for no sources
      isAwsAccessAllowed && awsProviders !== undefined && awsProviders.meta !== undefined && awsProviders.meta.count > 0
    );
  };

  private isAzureAvailable = () => {
    const { azureProviders } = this.props;
    const { isAzureAccessAllowed } = this.state;
    return (
      // API returns empty data array for no sources
      isAzureAccessAllowed &&
      azureProviders !== undefined &&
      azureProviders.meta !== undefined &&
      azureProviders.meta.count > 0
    );
  };

  private isGcpAvailable = () => {
    const { gcpProviders } = this.props;
    const { isGcpAccessAllowed } = this.state;

    return (
      // API returns empty data array for no sources
      isGcpAccessAllowed && gcpProviders !== undefined && gcpProviders.meta !== undefined && gcpProviders.meta.count > 0
    );
  };

  private isOcpAvailable = () => {
    const { ocpProviders } = this.props;
    const { isOcpAccessAllowed } = this.state;
    return (
      // API returns empty data array for no sources
      isOcpAccessAllowed && ocpProviders !== undefined && ocpProviders.meta !== undefined && ocpProviders.meta.count > 0
    );
  };

  private isOcpCloudAvailable = () => {
    return this.isAwsAvailable() && this.isOcpAvailable();
  };

  public render() {
    const {
      awsProvidersFetchStatus,
      azureProvidersFetchStatus,
      gcpProvidersFetchStatus,
      ocpProvidersFetchStatus,
      t,
    } = this.props;
    const availableTabs = this.getAvailableTabs();
    const isLoading =
      awsProvidersFetchStatus === FetchStatus.inProgress ||
      azureProvidersFetchStatus === FetchStatus.inProgress ||
      gcpProvidersFetchStatus === FetchStatus.inProgress ||
      ocpProvidersFetchStatus === FetchStatus.inProgress;

    // Test for no providers
    const noAwsProviders = !this.isAwsAvailable() && awsProvidersFetchStatus === FetchStatus.complete;
    const noAzureProviders = !this.isAzureAvailable() && azureProvidersFetchStatus === FetchStatus.complete;
    const noGcpProviders = !this.isGcpAvailable() && gcpProvidersFetchStatus === FetchStatus.complete;
    const noOcpProviders = !this.isOcpAvailable() && ocpProvidersFetchStatus === FetchStatus.complete;
    const noProviders = noAwsProviders && noAzureProviders && noGcpProviders && noOcpProviders;

    const title = t('navigation.overview');

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
              {t('overview.title')}
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

  const ocpProvidersQueryString = getProvidersQuery(ocpProvidersQuery);
  const ocpProviders = providersSelectors.selectProviders(state, ProviderType.ocp, ocpProvidersQueryString);
  const ocpProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
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
    ocpProviders,
    ocpProvidersFetchStatus,
    ocpProvidersQueryString,
  };
});

const Overview = withTranslation()(connect(mapStateToProps)(OverviewBase));

export default Overview;
