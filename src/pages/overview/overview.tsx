import {
  Button,
  ButtonType,
  ButtonVariant,
  Grid,
  GridItem,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { Providers } from 'api/providers';
import { AxiosError } from 'axios';
import { TabData, Tabs } from 'components/tabs';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersSelectors } from 'store/providers';
import { uiActions } from 'store/ui';
import { getTestProps, testIds } from 'testIds';
import AwsDashboard from '../awsDashboard';
import OcpDashboard from '../ocpDashboard';
import { EmptyState } from './emptyState';
import { ErrorState } from './errorState';
import { LoadingState } from './loadingState';

const enum OverviewTab {
  aws = 'aws',
  ocp = 'ocp',
}

type OverviewOwnProps = RouteComponentProps<{}> & InjectedTranslateProps;

interface OverviewStateProps {
  availableTabs?: OverviewTab[];
  currentTab?: OverviewTab;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
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

  private getEmptyState = () => {
    const { t } = this.props;

    return (
      <Grid gutter="lg">
        <GridItem>
          <EmptyState
            primaryAction={this.getAddSourceButton()}
            title={t('overview.empty_state_title')}
            subTitle={t('overview.empty_state_desc')}
          />
        </GridItem>
      </Grid>
    );
  };

  private getErrorState = () => {
    const { providersError, t } = this.props;
    let isUnauthorized = false;
    let title = t('overview.error_unexpected_title');
    let subTitle = t('overview.error_unexpected_desc');

    if (
      providersError &&
      providersError.response &&
      providersError.response.status === 401
    ) {
      isUnauthorized = true;
      title = t('overview.error_unauthorized_title');
      subTitle = t('overview.error_unauthorized_desc');
    }

    return (
      <Grid gutter="lg">
        <GridItem>
          <ErrorState
            isUnauthorized={isUnauthorized}
            title={title}
            subTitle={subTitle}
          />
        </GridItem>
      </Grid>
    );
  };

  private getLoadingState = () => {
    const { t } = this.props;

    return (
      <Grid gutter="lg">
        <GridItem>
          <LoadingState
            title={t('overview.loading_state_title')}
            subTitle={t('overview.loading_state_desc')}
          />
        </GridItem>
      </Grid>
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
    const { availableTabs } = this.props;
    const { currentTab } = this.state;

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
    const { providers, providersError, providersFetchStatus, t } = this.props;

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
          {Boolean(providersError)
            ? this.getErrorState()
            : Boolean(
              providers &&
              providers.count > 0 &&
              providersFetchStatus === FetchStatus.complete
            )
              ? this.getTabs()
              : Boolean(
                providers &&
                providers.count === 0 &&
                providersFetchStatus === FetchStatus.complete
              )
                ? this.getEmptyState()
                : this.getLoadingState()}
        </section>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  OverviewOwnProps,
  OverviewStateProps
>(state => {
  const availableTabs = [];
  const providers = providersSelectors.selectProviders(state);

  if (providers && providers.results) {
    let showAWSTab = false;
    let showOCPTab = false;
    for (const result of providers.results) {
      if (result.type === 'AWS') {
        showAWSTab = true;
      } else if (result.type === 'OCP') {
        showOCPTab = true;
      }
    }
    if (showAWSTab) {
      availableTabs.push(OverviewTab.aws);
    }
    if (showOCPTab) {
      availableTabs.push(OverviewTab.ocp);
    }
  }

  return {
    availableTabs,
    providers,
    providersError: providersSelectors.selectProvidersError(state),
    providersFetchStatus: providersSelectors.selectProvidersFetchStatus(state),
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
