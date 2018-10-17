import { Grid, GridItem } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { Providers } from 'api/providers';
import { EmptyState } from 'components/emptyState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsDashboardSelectors } from 'store/awsDashboard';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersSelectors } from 'store/providers';
import { uiActions } from 'store/ui';
import { emptyState, theme } from './awsDashboard.styles';
import { AwsDashboardWidget } from './awsDashboardWidget';

type AwsDashboardOwnProps = InjectedTranslateProps;

interface AwsDashboardStateProps {
  providers: Providers;
  providersFetchStatus: FetchStatus;
  widgets: number[];
}

interface AwsDashboardDispatchProps {
  openProvidersModal: typeof uiActions.openProvidersModal;
}

type AwsDashboardProps = AwsDashboardOwnProps &
  AwsDashboardStateProps &
  AwsDashboardDispatchProps;

const AwsDashboardBase: React.SFC<AwsDashboardProps> = ({
  t,
  openProvidersModal,
  providers,
  providersFetchStatus,
  widgets,
}) => (
  <div className={theme}>
    {Boolean(
      providers &&
        providers.count > 0 &&
        providersFetchStatus === FetchStatus.complete
    ) ? (
      <Grid gutter="md">
        {widgets.map(widgetId => {
          return (
            <GridItem xl={4} lg={6} key={widgetId}>
              <AwsDashboardWidget widgetId={widgetId} />
            </GridItem>
          );
        })}
      </Grid>
    ) : (
      <Grid className={css(emptyState)} gutter="md">
        <GridItem>
          <EmptyState title={t('aws_dashboard.empty_state_title')}>
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
  AwsDashboardOwnProps,
  AwsDashboardStateProps
>(state => {
  return {
    providers: providersSelectors.selectProviders(state),
    providersFetchStatus: providersSelectors.selectProvidersFetchStatus(state),
    widgets: awsDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AwsDashboard = translate()(
  connect(
    mapStateToProps,
    {
      openProvidersModal: uiActions.openProvidersModal,
    }
  )(AwsDashboardBase)
);

export default AwsDashboard;
