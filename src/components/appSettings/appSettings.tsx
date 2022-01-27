import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersActions, providersQuery, providersSelectors } from 'store/providers';
import { uiActions } from 'store/ui';
import { userAccessActions, userAccessQuery, userAccessSelectors } from 'store/userAccess';
import { CostTypes } from 'utils/localStorage';

interface AppSettingsOwnProps {
  children?: React.ReactNode;
  isResetState?: boolean;
}

interface AppSettingsDispatchProps {
  fetchProviders?: typeof providersActions.fetchProviders;
  fetchUserAccess: typeof userAccessActions.fetchUserAccess;
  resetState: typeof uiActions.resetState;
}

interface AppSettingsStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

interface AppSettingsState {
  costType?: CostTypes;
  currency?: string;
}

type AppSettingsProps = AppSettingsOwnProps & AppSettingsDispatchProps & AppSettingsStateProps & WrappedComponentProps;

class AppSettingsBase extends React.Component<AppSettingsProps> {
  protected defaultState: AppSettingsState = {
    // TBD...
  };
  public state: AppSettingsState = { ...this.defaultState };

  public componentDidMount() {
    const {
      fetchProviders,
      fetchUserAccess,
      isResetState,
      providersFetchStatus,
      providersQueryString,
      resetState,
      userAccessFetchStatus,
      userAccessQueryString,
    } = this.props;

    // Clear cached API responses
    if (isResetState) {
      resetState();
    }

    if (providersFetchStatus !== FetchStatus.inProgress) {
      fetchProviders(ProviderType.all, providersQueryString);
    }
    if (userAccessFetchStatus !== FetchStatus.inProgress) {
      fetchUserAccess(UserAccessType.all, userAccessQueryString);
    }
  }

  public componentDidUpdate(prevProps: AppSettingsProps) {
    const { providers, userAccess } = this.props;

    if (prevProps.providers !== providers || prevProps.userAccess !== userAccess) {
      // Force update to render children
      this.setState({
        providers,
        userAccess,
      });
    }
  }

  public render() {
    const { children, providersFetchStatus, userAccessFetchStatus } = this.props;

    return providersFetchStatus === FetchStatus.complete && userAccessFetchStatus === FetchStatus.complete
      ? children
      : null;
  }
}

const mapStateToProps = createMapStateToProps<AppSettingsOwnProps, AppSettingsStateProps>(state => {
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

const mapDispatchToProps: AppSettingsDispatchProps = {
  fetchProviders: providersActions.fetchProviders,
  fetchUserAccess: userAccessActions.fetchUserAccess,
  resetState: uiActions.resetState,
};

const CostTypeConnect = connect(mapStateToProps, mapDispatchToProps)(AppSettingsBase);
const AppSettings = injectIntl(CostTypeConnect);

export { AppSettings };
