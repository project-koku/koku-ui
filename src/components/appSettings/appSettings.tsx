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
import { userAccessActions, userAccessQuery, userAccessSelectors } from 'store/userAccess';
import { CostTypes } from 'utils/localStorage';

interface PermissionsWrapperOwnProps {
  children?: React.ReactNode;
}

interface PermissionsWrapperDispatchProps {
  fetchProviders?: typeof providersActions.fetchProviders;
  fetchUserAccess: typeof userAccessActions.fetchUserAccess;
}

interface PermissionsWrapperStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

interface PermissionsWrapperState {
  costType?: CostTypes;
  currency?: string;
}

type PermissionsWrapperProps = PermissionsWrapperOwnProps &
  PermissionsWrapperDispatchProps &
  PermissionsWrapperStateProps &
  WrappedComponentProps;

class PermissionsWrapperBase extends React.Component<PermissionsWrapperProps> {
  protected defaultState: PermissionsWrapperState = {
    // TBD...
  };
  public state: PermissionsWrapperState = { ...this.defaultState };

  public componentDidMount() {
    const {
      fetchProviders,
      fetchUserAccess,
      providersFetchStatus,
      providersQueryString,
      userAccessFetchStatus,
      userAccessQueryString,
    } = this.props;

    if (providersFetchStatus !== FetchStatus.inProgress) {
      fetchProviders(ProviderType.all, providersQueryString);
    }
    if (userAccessFetchStatus !== FetchStatus.inProgress) {
      fetchUserAccess(UserAccessType.all, userAccessQueryString);
    }
  }

  public componentDidUpdate(prevProps: PermissionsWrapperProps) {
    const { providers } = this.props;

    if (prevProps.providers !== providers) {
      // Force update to render children
      this.setState({
        providers,
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

const mapStateToProps = createMapStateToProps<PermissionsWrapperOwnProps, PermissionsWrapperStateProps>(state => {
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

const mapDispatchToProps: PermissionsWrapperDispatchProps = {
  fetchProviders: providersActions.fetchProviders,
  fetchUserAccess: userAccessActions.fetchUserAccess,
};

const CostTypeConnect = connect(mapStateToProps, mapDispatchToProps)(PermissionsWrapperBase);
const Access = injectIntl(CostTypeConnect);

export { Access };
