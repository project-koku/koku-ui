import {
  Popover,
  Tab,
  TabContent,
  Tabs,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { AxiosError } from 'axios';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { NoProvidersState } from 'components/state/noProvidersState/noProvidersState';
import AwsCloudDashboard from 'pages/dashboard/awsCloudDashboard/awsCloudDashboard';
import AwsDashboard from 'pages/dashboard/awsDashboard/awsDashboard';
import AzureCloudDashboard from 'pages/dashboard/azureCloudDashboard/azureCloudDashboard';
import AzureDashboard from 'pages/dashboard/azureDashboard/azureDashboard';
import OcpCloudDashboard from 'pages/dashboard/ocpCloudDashboard/ocpCloudDashboard';
import OcpDashboard from 'pages/dashboard/ocpDashboard/ocpDashboard';
import OcpSupplementaryDashboard from 'pages/dashboard/ocpSupplementaryDashboard/ocpSupplementaryDashboard';
import OcpUsageDashboard from 'pages/dashboard/ocpUsageDashboard/ocpUsageDashboard';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  awsProvidersQuery,
  azureProvidersQuery,
  ocpProvidersQuery,
  providersSelectors,
} from 'store/providers';
import { uiActions } from 'store/ui';
import { headerOverride, styles } from './overview.styles';
import { Perspective } from './perspective';

const enum InfrastructurePerspective {
  allCloud = 'all_cloud', // All filtered by Ocp
  aws = 'aws',
  awsFiltered = 'aws_cloud', // Aws filtered by Ocp
  azure = 'azure',
  azureCloud = 'azure_cloud', // Azure filtered by Ocp
  ocpUsage = 'ocp_usage',
}

const enum OcpPerspective {
  all = 'all',
  supplementary = 'supplementary',
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

type OverviewOwnProps = RouteComponentProps<{}> & InjectedTranslateProps;

interface OverviewStateProps {
  awsProviders: Providers;
  awsProvidersError: AxiosError;
  awsProvidersFetchStatus: FetchStatus;
  awsProvidersQueryString: string;
  azureProviders: Providers;
  azureProvidersError: AxiosError;
  azureProvidersFetchStatus: FetchStatus;
  azureProvidersQueryString: string;
  availableTabs?: OverviewTab[];
  ocpProviders: Providers;
  ocpProvidersError: AxiosError;
  ocpProvidersFetchStatus: FetchStatus;
  ocpProvidersQueryString: string;
}

interface OverviewDispatchProps {
  openProvidersModal: typeof uiActions.openProvidersModal;
}

interface AvailableTab {
  contentRef: React.ReactNode;
  tab: OverviewTab;
}

interface OverviewState {
  activeTabKey: number;
  currentInfrastructurePerspective: string;
  currentOcpPerspective?: string;
  showPopover: boolean;
}

type OverviewProps = OverviewOwnProps &
  OverviewStateProps &
  OverviewDispatchProps;

// Ocp options
const ocpOptions = [
  { label: 'overview.perspective.all', value: 'all' },
  { label: 'overview.perspective.supplementary', value: 'supplementary' },
];

// Infrastructure options
const infrastructureOptions = [
  { label: 'overview.perspective.all_cloud', value: 'all_cloud' },
];

// Infrastructure AWS options
const infrastructureAwsOptions = [
  { label: 'overview.perspective.aws', value: 'aws' },
  { label: 'overview.perspective.aws_cloud', value: 'aws_cloud' },
];

// Infrastructure Azure options
const infrastructureAzureOptions = [
  { label: 'overview.perspective.azure', value: 'azure' },
  { label: 'overview.perspective.azure_cloud', value: 'azure_cloud' },
];

// Infrastructure Ocp options
const infrastructureOcpOptions = [
  { label: 'overview.perspective.ocp_usage', value: 'ocp_usage' },
];

class OverviewBase extends React.Component<OverviewProps> {
  protected defaultState: OverviewState = {
    activeTabKey: 0,
    currentInfrastructurePerspective: infrastructureOptions[0].value,
    currentOcpPerspective: ocpOptions[0].value,
    showPopover: false,
  };
  public state: OverviewState = { ...this.defaultState };

  private getAvailableTabs = () => {
    const { awsProviders, azureProviders, ocpProviders } = this.props;
    const availableTabs = [];
    const isAwsAvailable =
      awsProviders && awsProviders.meta && awsProviders.meta.count;
    const isAzureAvailable =
      azureProviders && azureProviders.meta && azureProviders.meta.count;
    const isOcpAvailable =
      ocpProviders && ocpProviders.meta && ocpProviders.meta.count;
    const isOcpCloudAvailable = isOcpAvailable && isAwsAvailable;

    if (isOcpAvailable) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: OverviewTab.ocp,
      });
    }
    if (isAwsAvailable || isAzureAvailable || isOcpCloudAvailable) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: OverviewTab.infrastructure,
      });
    }
    return availableTabs;
  };

  private getCurrentTab = () => {
    const { activeTabKey } = this.state;
    return activeTabKey === 0 ? OverviewTab.ocp : OverviewTab.infrastructure;
  };

  private getPerspective = () => {
    const { awsProviders, azureProviders, ocpProviders } = this.props;
    const {
      currentInfrastructurePerspective,
      currentOcpPerspective,
    } = this.state;

    let currentItem = currentOcpPerspective;
    let options = [...ocpOptions];

    // Dynamically show options if providers are available
    if (this.getCurrentTab() === OverviewTab.infrastructure) {
      const isAwsAvailable =
        awsProviders && awsProviders.meta && awsProviders.meta.count;
      const isAzureAvailable =
        azureProviders && azureProviders.meta && azureProviders.meta.count;
      const isOcpAvailable =
        ocpProviders && ocpProviders.meta && ocpProviders.meta.count;
      currentItem = currentInfrastructurePerspective;
      options = [
        ...infrastructureOptions,
        ...(isAwsAvailable && infrastructureAwsOptions),
        ...(isAzureAvailable && infrastructureAzureOptions),
        ...(isOcpAvailable && infrastructureOcpOptions),
      ];
    }
    return (
      <Perspective
        currentItem={currentItem}
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

  private getTabItem = (tab: OverviewTab, index: number) => {
    const {
      activeTabKey,
      currentInfrastructurePerspective,
      currentOcpPerspective,
    } = this.state;
    if (activeTabKey !== index) {
      return null;
    }
    const currentTab = getIdKeyForTab(tab);
    if (currentTab === OverviewTab.infrastructure) {
      if (
        currentInfrastructurePerspective === InfrastructurePerspective.allCloud
      ) {
        return <OcpCloudDashboard />;
      } else if (
        currentInfrastructurePerspective === InfrastructurePerspective.aws
      ) {
        return <AwsDashboard />;
      } else if (
        currentInfrastructurePerspective ===
        InfrastructurePerspective.awsFiltered
      ) {
        return <AwsCloudDashboard />;
      } else if (
        currentInfrastructurePerspective === InfrastructurePerspective.azure
      ) {
        return <AzureDashboard />;
      } else if (
        currentInfrastructurePerspective ===
        InfrastructurePerspective.azureCloud
      ) {
        return <AzureCloudDashboard />;
      } else if (
        currentInfrastructurePerspective === InfrastructurePerspective.ocpUsage
      ) {
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
      return null;
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

  private handlePopoverClick = () => {
    this.setState({
      show: !this.state.showPopover,
    });
  };

  private handleTabClick = (event, tabIndex) => {
    this.setState({
      activeTabKey: tabIndex,
    });
  };

  public render() {
    const {
      awsProviders,
      awsProvidersError,
      awsProvidersFetchStatus,
      azureProviders,
      azureProvidersError,
      azureProvidersFetchStatus,
      ocpProviders,
      ocpProvidersError,
      ocpProvidersFetchStatus,
      t,
    } = this.props;

    const availableTabs = this.getAvailableTabs();
    const error = awsProvidersError || azureProvidersError || ocpProvidersError;
    const isLoading =
      awsProvidersFetchStatus === FetchStatus.inProgress ||
      azureProvidersFetchStatus === FetchStatus.inProgress ||
      ocpProvidersFetchStatus === FetchStatus.inProgress;
    const noAwsProviders =
      awsProviders !== undefined &&
      awsProviders.meta !== undefined &&
      awsProviders.meta.count === 0 &&
      awsProvidersFetchStatus === FetchStatus.complete;
    const noAzureProviders =
      azureProviders !== undefined &&
      azureProviders.meta !== undefined &&
      azureProviders.meta.count === 0 &&
      azureProvidersFetchStatus === FetchStatus.complete;
    const noOcpProviders =
      ocpProviders !== undefined &&
      ocpProviders.meta !== undefined &&
      ocpProviders.meta.count === 0 &&
      ocpProvidersFetchStatus === FetchStatus.complete;
    const noProviders = noAwsProviders && noAzureProviders && noOcpProviders;
    const showTabs = !(error || noProviders || isLoading);

    return (
      <>
        <section
          className={`pf-l-page-header pf-c-page-header pf-l-page__main-section pf-c-page__main-section pf-m-light ${
            showTabs ? headerOverride : ''
          }`}
        >
          <header className="pf-u-display-flex pf-u-justify-content-space-between pf-u-align-items-center">
            <Title headingLevel="h1" size={TitleSizes['2xl']}>
              {t('overview.title')}
              {Boolean(showTabs) && (
                <span style={styles.infoIcon}>
                  <Popover
                    aria-label="t('ocp_details.supplementary_aria_label')"
                    enableFlip
                    bodyContent={
                      <>
                        <p style={styles.infoTitle}>
                          {t('overview.ocp_cloud')}
                        </p>
                        <p>{t('overview.ocp_cloud_desc')}</p>
                        <br />
                        <p style={styles.infoTitle}>{t('overview.ocp')}</p>
                        <p>{t('overview.ocp_desc')}</p>
                        <br />
                        <p style={styles.infoTitle}>{t('overview.aws')}</p>
                        <p>{t('overview.aws_desc')}</p>
                        <br />
                        <p style={styles.infoTitle}>{t('overview.azure')}</p>
                        <p>{t('overview.azure_desc')}</p>
                      </>
                    }
                  >
                    <InfoCircleIcon
                      style={styles.info}
                      onClick={this.handlePopoverClick}
                    />
                  </Popover>
                </span>
              )}
            </Title>
          </header>
          {Boolean(showTabs) && (
            <>
              <div style={styles.tabs}>{this.getTabs(availableTabs)}</div>
              <div style={styles.perspective}>{this.getPerspective()}</div>
            </>
          )}
        </section>
        <section
          className="pf-l-page__main-section pf-c-page__main-section"
          page-type="cost-management-overview"
        >
          {Boolean(error) ? (
            <ErrorState error={error} />
          ) : Boolean(noProviders) ? (
            <NoProvidersState />
          ) : Boolean(isLoading) ? (
            <LoadingState />
          ) : (
            this.getTabContent(availableTabs)
          )}
        </section>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  OverviewOwnProps,
  OverviewStateProps
>(state => {
  const awsProvidersQueryString = getProvidersQuery(awsProvidersQuery);
  const awsProviders = providersSelectors.selectProviders(
    state,
    ProviderType.aws,
    awsProvidersQueryString
  );
  const awsProvidersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.aws,
    awsProvidersQueryString
  );
  const awsProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.aws,
    awsProvidersQueryString
  );

  const azureProvidersQueryString = getProvidersQuery(azureProvidersQuery);
  const azureProviders = providersSelectors.selectProviders(
    state,
    ProviderType.azure,
    azureProvidersQueryString
  );
  const azureProvidersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.azure,
    azureProvidersQueryString
  );
  const azureProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.azure,
    azureProvidersQueryString
  );

  const ocpProvidersQueryString = getProvidersQuery(ocpProvidersQuery);
  const ocpProviders = providersSelectors.selectProviders(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
  );
  const ocpProvidersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
  );
  const ocpProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
  );

  return {
    awsProviders,
    awsProvidersError,
    awsProvidersFetchStatus,
    awsProvidersQueryString,
    azureProviders,
    azureProvidersError,
    azureProvidersFetchStatus,
    azureProvidersQueryString,
    ocpProviders,
    ocpProvidersError,
    ocpProvidersFetchStatus,
    ocpProvidersQueryString,
  };
});

const Overview = translate()(connect(mapStateToProps)(OverviewBase));

export default Overview;
