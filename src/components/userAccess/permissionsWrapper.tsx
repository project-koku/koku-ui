import { AccountSettings } from 'api/accountSettings';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import { asyncComponent } from 'components/async';
import { ExportsDrawer } from 'components/exports';
import { PageTitle } from 'components/pageTitle';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { accountSettingsActions, accountSettingsSelectors } from 'store/accountSettings';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersActions, providersQuery, providersSelectors } from 'store/providers';
import { uiActions } from 'store/ui';
import { userAccessActions, userAccessQuery, userAccessSelectors } from 'store/userAccess';

const InactiveSources = asyncComponent(
  () => import(/* webpackChunkName: "notFound" */ 'components/inactiveSources/inactiveSources')
);
const Permissions = asyncComponent(() => import(/* webpackChunkName: "notFound" */ './permissions'));

interface PermissionsWrapperOwnProps {
  children?: React.ReactNode;
}

interface PermissionsWrapperDispatchProps {
  fetchAccountSettings?: typeof accountSettingsActions.fetchAccountSettings;
  fetchProviders?: typeof providersActions.fetchProviders;
  fetchUserAccess: typeof userAccessActions.fetchUserAccess;
  resetState: typeof uiActions.resetState;
}

interface PermissionsWrapperStateProps {
  accountSettings: AccountSettings;
  accountSettingsError: AxiosError;
  accountSettingsFetchStatus?: FetchStatus;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

type PermissionsWrapperProps = PermissionsWrapperOwnProps &
  PermissionsWrapperDispatchProps &
  PermissionsWrapperStateProps &
  WrappedComponentProps;

class PermissionsWrapperBase extends React.Component<PermissionsWrapperProps> {
  public componentDidMount() {
    const {
      fetchAccountSettings,
      fetchProviders,
      fetchUserAccess,
      providersQueryString,
      resetState,
      userAccessQueryString,
    } = this.props;

    // Clear cached API responses
    resetState();

    // Fetched in order of component usage via render()
    fetchUserAccess(UserAccessType.all, userAccessQueryString);
    fetchProviders(ProviderType.all, providersQueryString);
    fetchAccountSettings();
  }

  public render() {
    const { accountSettingsFetchStatus, children, providersFetchStatus, userAccessFetchStatus } = this.props;

    return (
      <PageTitle>
        {userAccessFetchStatus === FetchStatus.complete && (
          <Permissions>
            {providersFetchStatus === FetchStatus.complete && (
              <ExportsDrawer>
                <InactiveSources />
                {accountSettingsFetchStatus === FetchStatus.complete && children}
              </ExportsDrawer>
            )}
          </Permissions>
        )}
      </PageTitle>
    );
  }
}

const mapStateToProps = createMapStateToProps<PermissionsWrapperOwnProps, PermissionsWrapperStateProps>(state => {
  const accountSettings = accountSettingsSelectors.selectAccountSettings(state);
  const accountSettingsError = accountSettingsSelectors.selectAccountSettingsError(state);
  const accountSettingsFetchStatus = accountSettingsSelectors.selectAccountSettingsFetchStatus(state);

  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  const userAccessQueryString = getUserAccessQuery(userAccessQuery);
  const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
  const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
  const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.all,
    userAccessQueryString
  );

  return {
    accountSettings,
    accountSettingsError,
    accountSettingsFetchStatus,
    providers,
    providersError,
    providersFetchStatus,
    providersQueryString,
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const mapDispatchToProps: PermissionsWrapperDispatchProps = {
  fetchAccountSettings: accountSettingsActions.fetchAccountSettings,
  fetchProviders: providersActions.fetchProviders,
  fetchUserAccess: userAccessActions.fetchUserAccess,
  resetState: uiActions.resetState,
};

const PermissionsWrapperConnect = connect(mapStateToProps, mapDispatchToProps)(PermissionsWrapperBase);
const PermissionsWrapper = injectIntl(PermissionsWrapperConnect);

export default PermissionsWrapper;
