import {
  Button,
  ButtonType,
  ButtonVariant,
  Grid,
  GridItem,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { Providers } from 'api/providers';
import { EmptyState } from 'components/emptyState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { dashboardSelectors } from 'store/dashboard';
import { providersSelectors } from 'store/providers';
import { uiActions } from 'store/ui';
import { getTestProps, testIds } from 'testIds';
import { emptyState, styles, theme } from './dashboard.styles';
import { DashboardWidget } from './dashboardWidget';

type DashboardOwnProps = RouteComponentProps<{}> & InjectedTranslateProps;

interface DashboardStateProps {
  providers: Providers;
  providersFetchStatus: FetchStatus;
  widgets: number[];
}

interface DashboardDispatchProps {
  openProvidersModal: typeof uiActions.openProvidersModal;
}

type DashboardProps = DashboardOwnProps &
  DashboardStateProps &
  DashboardDispatchProps;

const DashboardBase: React.SFC<DashboardProps> = ({
  t,
  openProvidersModal,
  providers,
  providersFetchStatus,
  widgets,
}) => (
  <div className={theme}>
    <header className={css(styles.banner)}>
      <Title size={TitleSize.lg}>{t('dashboard_page.title')}</Title>
      <Button
        {...getTestProps(testIds.providers.add_btn)}
        onClick={openProvidersModal}
        type={ButtonType.submit}
        variant={ButtonVariant.secondary}
      >
        {t('providers.add_account')}
      </Button>
    </header>
    <div className={css(styles.content)}>
      {Boolean(
        providers &&
          providers.count > 0 &&
          providersFetchStatus === FetchStatus.complete
      ) ? (
        <Grid gutter="md">
          {widgets.map(widgetId => {
            return (
              <GridItem xl={4} lg={6} key={widgetId}>
                <DashboardWidget widgetId={widgetId} />
              </GridItem>
            );
          })}
        </Grid>
      ) : (
        <Grid className={css(emptyState)} gutter="md">
          <GridItem>
            <EmptyState title={t('dashboard_page.cloud.empty_state_title')}>
              View the
              <a
                target="_blank"
                href="https://koku.readthedocs.io/en/latest/providers.html#adding-an-aws-account"
              >
                {' '}
                Koku documentation{' '}
              </a>
              and learn how to configure your AWS account to allow Koku access.
              Then, click
              <a href="javascript:void(0)" onClick={openProvidersModal}>
                {' '}
                Add Account
              </a>{' '}
              to configure.
            </EmptyState>
          </GridItem>
        </Grid>
      )}
    </div>
  </div>
);

const mapStateToProps = createMapStateToProps<
  DashboardOwnProps,
  DashboardStateProps
>(state => {
  return {
    providers: providersSelectors.selectProviders(state),
    providersFetchStatus: providersSelectors.selectProvidersFetchStatus(state),
    widgets: dashboardSelectors.selectCurrentWidgets(state),
  };
});

const Dashboard = translate()(
  connect(
    mapStateToProps,
    {
      openProvidersModal: uiActions.openProvidersModal,
    }
  )(DashboardBase)
);

export default Dashboard;
