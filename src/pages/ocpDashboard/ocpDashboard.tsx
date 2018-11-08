import { Grid, GridItem } from '@patternfly/react-core';
import { Providers } from 'api/providers';
import { EmptyState } from 'components/emptyState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpDashboardSelectors } from 'store/ocpDashboard';
import { providersSelectors } from 'store/providers';
import { uiActions } from 'store/ui';
import { OcpDashboardWidget } from './ocpDashboardWidget';

type OcpDashboardOwnProps = InjectedTranslateProps;

interface OcpDashboardStateProps {
  providers: Providers;
  providersFetchStatus: FetchStatus;
  widgets: number[];
}

interface OcpDashboardDispatchProps {
  openProvidersModal: typeof uiActions.openProvidersModal;
}

type OcpDashboardProps = OcpDashboardOwnProps &
  OcpDashboardStateProps &
  OcpDashboardDispatchProps;

const OcpDashboardBase: React.SFC<OcpDashboardProps> = ({
  t,
  openProvidersModal,
  providers,
  providersFetchStatus,
  widgets,
}) => (
  <div>
    {Boolean(
      providers &&
        providers.count > 0 &&
        providersFetchStatus === FetchStatus.complete
    ) ? (
      <Grid gutter="md">
        {widgets.map(widgetId => {
          return (
            <GridItem xl={4} lg={6} key={widgetId}>
              <OcpDashboardWidget widgetId={widgetId} />
            </GridItem>
          );
        })}
      </Grid>
    ) : (
      <Grid gutter="md">
        <GridItem>
          <EmptyState title={t('ocp_dashboard.empty_state_title')}>
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
);

const mapStateToProps = createMapStateToProps<
  OcpDashboardOwnProps,
  OcpDashboardStateProps
>(state => {
  return {
    providers: providersSelectors.selectProviders(state),
    providersFetchStatus: providersSelectors.selectProvidersFetchStatus(state),
    widgets: ocpDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpDashboard = translate()(
  connect(
    mapStateToProps,
    {
      openProvidersModal: uiActions.openProvidersModal,
    }
  )(OcpDashboardBase)
);

export default OcpDashboard;
