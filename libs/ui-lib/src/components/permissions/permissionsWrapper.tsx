import type { AccountSettings } from '@koku-ui/api/accountSettings';
import { AccountSettingsType } from '@koku-ui/api/accountSettings';
import type { Providers } from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import { getUserAccessQuery } from '@koku-ui/api/queries/userAccessQuery';
import type { UserAccess } from '@koku-ui/api/userAccess';
import { UserAccessType } from '@koku-ui/api/userAccess';
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { accountSettingsActions, accountSettingsSelectors } from '../../store/accountSettings';
import { createMapStateToProps, FetchStatus } from '../../store/common';
import { providersActions, providersQuery, providersSelectors } from '../../store/providers';
import { uiActions } from '../../store/ui';
import { userAccessActions, userAccessQuery, userAccessSelectors } from '../../store/userAccess';
import { asyncComponent } from '../async';
import { CommonDrawer } from '../drawers';
import { PageTitle } from '../pageTitle';

const InactiveSources = asyncComponent(() => import(/* webpackChunkName: "InactiveSources" */ '../inactiveSources'));
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
