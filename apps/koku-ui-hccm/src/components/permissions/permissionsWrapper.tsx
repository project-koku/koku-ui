import type { AccountSettings } from 'api/accountSettings';
import { AccountSettingsType } from 'api/accountSettings';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';
import type { AxiosError } from 'axios';
import { asyncComponent } from 'components/async';
import { CommonDrawer } from 'components/drawers';
import { PageTitle } from 'components/pageTitle';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { accountSettingsActions, accountSettingsSelectors } from 'store/accountSettings';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersActions, providersQuery, providersSelectors } from 'store/providers';
import { uiActions } from 'store/ui';
import { userAccessActions, userAccessQuery, userAccessSelectors } from 'store/userAccess';

const InactiveSources = asyncComponent(
  () => import(/* webpackChunkName: "InactiveSources" */ 'components/inactiveSources')
);
const Permissions = asyncComponent(() => import(/* webpackChunkName: "permissions" */ './permissions') as any);

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

class PermissionsWrapperBase extends React.Component<PermissionsWrapperProps, any> {
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
    fetchAccountSettings(AccountSettingsType.settings);
  }

  public render() {
    const { accountSettingsFetchStatus, children, providersFetchStatus, userAccessFetchStatus } = this.props;

    return (
      <PageTitle>
        {userAccessFetchStatus === FetchStatus.complete && (
          <Permissions>
            {providersFetchStatus === FetchStatus.complete && (
              <CommonDrawer>
                <InactiveSources />
                {accountSettingsFetchStatus === FetchStatus.complete && children}
              </CommonDrawer>
            )}
          </Permissions>
        )}
        Cost Konflux TEST 1
      </PageTitle>
    );
  }
}

const mapStateToProps = createMapStateToProps<PermissionsWrapperOwnProps, PermissionsWrapperStateProps>(state => {
  const accountSettings = accountSettingsSelectors.selectAccountSettings(state, AccountSettingsType.settings);
  const accountSettingsError = accountSettingsSelectors.selectAccountSettingsError(state, AccountSettingsType.settings);
  const accountSettingsFetchStatus = accountSettingsSelectors.selectAccountSettingsStatus(
    state,
    AccountSettingsType.settings
  );

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

const PermissionsWrapper = injectIntl(connect(mapStateToProps, mapDispatchToProps)(PermissionsWrapperBase));

export default PermissionsWrapper;
