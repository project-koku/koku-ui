import {
  Button,
  ButtonType,
  ButtonVariant,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/providersQuery';
import { AxiosError } from 'axios';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { NoProvidersState } from 'components/state/noProvidersState/noProvidersState';
import { TabData, Tabs } from 'components/tabs';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  awsProvidersQuery,
  ocpProvidersQuery,
  providersSelectors,
} from 'store/providers';
import { uiActions } from 'store/ui';
import { getTestProps, testIds } from 'testIds';
import AwsDashboard from '../awsDashboard';
import OcpDashboard from '../ocpDashboard';

const enum OverviewTab {
  aws = 'aws',
  ocp = 'ocp',
}

type OverviewOwnProps = RouteComponentProps<{}> & InjectedTranslateProps;

interface OverviewStateProps {
  awsProviders: Providers;
  awsProvidersError: AxiosError;
  awsProvidersFetchStatus: FetchStatus;
  awsProvidersQueryString: string;
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

type OverviewProps = OverviewOwnProps &
  OverviewStateProps &
  OverviewDispatchProps;

class OverviewBase extends React.Component<OverviewProps> {
  public state = {
    currentTab: OverviewTab.aws,
  };

  private getAddSourceButton = () => {
    const { openProvidersModal, t } = this.props;

    return (
      <Button
        {...getTestProps(testIds.providers.add_btn)}
        onClick={openProvidersModal}
        type={ButtonType.submit}
        variant={ButtonVariant.secondary}
      >
        {t('providers.add_source')}
      </Button>
    );
  };

  private getTabTitle = (tab: OverviewTab) => {
    const { t } = this.props;

    if (tab === OverviewTab.aws) {
      return t('overview.aws');
    } else if (tab === OverviewTab.ocp) {
      return t('overview.ocp');
    }
  };

  private getTabs = () => {
    const { awsProviders, ocpProviders } = this.props;
    const { currentTab } = this.state;
    const availableTabs = [];

    // Todo: Test AWS providers when API is available -- https://github.com/project-koku/koku/issues/658
    if (awsProviders && awsProviders.meta && awsProviders.meta.count) {
      availableTabs.push(OverviewTab.aws);
    }

    // Todo: Test OCP providers when API is available -- https://github.com/project-koku/koku/issues/658
    if (ocpProviders && ocpProviders.meta && ocpProviders.meta.count) {
      availableTabs.push(OverviewTab.ocp);
    }

    return (
      <Tabs
        isShrink={Boolean(true)}
        tabs={availableTabs.map(tab => ({
          id: tab,
          label: this.getTabTitle(tab),
          content: this.renderTab,
        }))}
        selected={currentTab}
        onChange={this.handleTabChange}
      />
    );
  };

  private handleTabChange = (tabId: OverviewTab) => {
    this.setState({ currentTab: tabId });
  };

  private renderTab = (tabData: TabData) => {
    const currentTab = tabData.id as OverviewTab;

    if (currentTab === OverviewTab.aws) {
      return <AwsDashboard />;
    } else {
      return <OcpDashboard />;
    }
  };

  public render() {
    const {
      awsProviders,
      awsProvidersError,
      awsProvidersFetchStatus,
      ocpProviders,
      ocpProvidersError,
      ocpProvidersFetchStatus,
      t,
    } = this.props;

    const hasAwsMeta = awsProviders && awsProviders.meta;
    const ocpAwsMeta = ocpProviders && ocpProviders.meta;
    const hasProviders =
      hasAwsMeta &&
      awsProviders.meta.count > 0 &&
      awsProvidersFetchStatus === FetchStatus.complete &&
      (ocpAwsMeta &&
        ocpProviders.meta.count > 0 &&
        ocpProvidersFetchStatus === FetchStatus.complete);
    const noProviders =
      hasAwsMeta &&
      awsProviders.meta.count === 0 &&
      awsProvidersFetchStatus === FetchStatus.complete &&
      (ocpAwsMeta &&
        ocpProviders.meta.count === 0 &&
        ocpProvidersFetchStatus === FetchStatus.complete);

    return (
      <>
        <section className="pf-l-page-header pf-c-page-header pf-l-page__main-section pf-c-page__main-section pf-m-light">
          <header className="pf-u-display-flex pf-u-justify-content-space-between pf-u-align-items-center">
            <Title size={TitleSize.lg}>{t('overview.title')}</Title>
            {this.getAddSourceButton()}
          </header>
        </section>
        <section
          className="pf-l-page__main-section pf-c-page__main-section"
          page-type="cost-management-overview"
        >
          {Boolean(awsProvidersError || ocpProvidersError) ? (
            <ErrorState error={awsProvidersError || ocpProvidersError} />
          ) : Boolean(hasProviders) ? (
            this.getTabs()
          ) : Boolean(noProviders) ? (
            <NoProvidersState />
          ) : (
            <LoadingState />
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
      openProvidersModal: uiActions.openProvidersModal,
    }
  )(OverviewBase)
);

export default Overview;
