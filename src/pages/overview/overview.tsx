import {
  Popover,
  Tab,
  TabContent,
  Tabs,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/providersQuery';
import { AxiosError } from 'axios';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { NoProvidersState } from 'components/state/noProvidersState/noProvidersState';
import AwsDashboard from 'pages/awsDashboard/awsDashboard';
import AzureDashboard from 'pages/azureDashboard/azureDashboard';
import OcpCloudDashboard from 'pages/ocpCloudDashboard/ocpCloudDashboard';
import OcpDashboard from 'pages/ocpDashboard/ocpDashboard';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { onboardingActions } from 'store/onboarding';
import {
  awsProvidersQuery,
  azureProvidersQuery,
  ocpProvidersQuery,
  providersSelectors,
} from 'store/providers';
import { uiActions } from 'store/ui';
import { headerOverride, styles } from './overview.styles';

const enum OverviewTab {
  aws = 'aws',
  azure = 'azure',
  ocp = 'ocp',
  ocpCloud = 'ocpCloud',
}

export const getIdKeyForTab = (tab: OverviewTab) => {
  switch (tab) {
    case OverviewTab.aws:
      return 'aws';
    case OverviewTab.azure:
      return 'azure';
    case OverviewTab.ocp:
      return 'ocp';
    case OverviewTab.ocpCloud:
      return 'ocpCloud';
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
  currentTab?: OverviewTab;
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

type OverviewProps = OverviewOwnProps &
  OverviewStateProps &
  OverviewDispatchProps;

class OverviewBase extends React.Component<OverviewProps> {
  public state = {
    activeTabKey: 0,
    showPopover: false,
  };

  private getAvailableTabs = () => {
    const { awsProviders, azureProviders, ocpProviders } = this.props;
    const availableTabs = [];

    if (
      awsProviders &&
      awsProviders.meta &&
      awsProviders.meta.count &&
      (ocpProviders && ocpProviders.meta && ocpProviders.meta.count)
    ) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: OverviewTab.ocpCloud,
      });
    }
    if (ocpProviders && ocpProviders.meta && ocpProviders.meta.count) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: OverviewTab.ocp,
      });
    }
    if (awsProviders && awsProviders.meta && awsProviders.meta.count) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: OverviewTab.aws,
      });
    }
    if (azureProviders && azureProviders.meta && azureProviders.meta.count) {
      availableTabs.push({
        contentRef: React.createRef(),
        tab: OverviewTab.azure,
      });
    }
    return availableTabs;
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
    const { activeTabKey } = this.state;
    const currentTab = getIdKeyForTab(tab);

    if (currentTab === OverviewTab.ocpCloud) {
      return activeTabKey === index ? <OcpCloudDashboard /> : null;
    } else if (currentTab === OverviewTab.ocp) {
      return activeTabKey === index ? <OcpDashboard /> : null;
    } else if (currentTab === OverviewTab.aws) {
      return activeTabKey === index ? <AwsDashboard /> : null;
    } else if (currentTab === OverviewTab.azure) {
      return activeTabKey === index ? <AzureDashboard /> : null;
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

    if (tab === OverviewTab.aws) {
      return t('overview.aws');
    } else if (tab === OverviewTab.azure) {
      return t('overview.azure');
    } else if (tab === OverviewTab.ocp) {
      return t('overview.ocp');
    } else if (tab === OverviewTab.ocpCloud) {
      return t('overview.ocp_on_cloud');
    }
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
            <Title size={TitleSize['2xl']}>
              {t('overview.title')}
              {Boolean(showTabs) && (
                <span className={css(styles.infoIcon)}>
                  <Popover
                    aria-label="t('ocp_details.derived_aria_label')"
                    enableFlip
                    bodyContent={
                      <>
                        <p className={css(styles.infoTitle)}>
                          {t('overview.ocp_on_cloud')}
                        </p>
                        <p>{t('overview.ocp_on_cloud_desc')}</p>
                        <br />
                        <p className={css(styles.infoTitle)}>
                          {t('overview.ocp')}
                        </p>
                        <p>{t('overview.ocp_desc')}</p>
                        <br />
                        <p className={css(styles.infoTitle)}>
                          {t('overview.aws')}
                        </p>
                        <p>{t('overview.aws_desc')}</p>
                        <br />
                        <p className={css(styles.infoTitle)}>
                          {t('overview.azure')}
                        </p>
                        <p>{t('overview.azure_desc')}</p>
                      </>
                    }
                  >
                    <InfoCircleIcon
                      className={css(styles.info)}
                      onClick={this.handlePopoverClick}
                    />
                  </Popover>
                </span>
              )}
            </Title>
          </header>
          {Boolean(showTabs) && (
            <div className={css(styles.tabs)}>
              {this.getTabs(availableTabs)}
            </div>
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

const Overview = translate()(
  connect(
    mapStateToProps,
    {
      openProvidersModal: onboardingActions.openModal,
    }
  )(OverviewBase)
);

export default Overview;
