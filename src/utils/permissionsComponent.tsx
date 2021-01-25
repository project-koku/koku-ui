import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { paths, routes } from 'routes';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { allUserAccessQuery, userAccessActions, userAccessSelectors } from 'store/userAccess';

import { asyncComponent } from './asyncComponent';

const InactiveSources = asyncComponent(() =>
  import(/* webpackChunkName: "notFound" */ 'components/sources/inactiveSources')
);
const NotAuthorized = asyncComponent(() => import(/* webpackChunkName: "notAuthorized" */ 'pages/state/notAuthorized'));
const NotAvailable = asyncComponent(() => import(/* webpackChunkName: "notAvailable" */ 'pages/state/notAvailable'));

interface PermissionsDispatchProps {
  fetchUserAccess: typeof userAccessActions.fetchUserAccess;
}

interface PermissionsState {}

type PermissionsOwnProps = PermissionsDispatchProps;

interface PermissionsStateProps {
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

// Permissions component wrapper for AsyncComponent
export function permissionsComponent<Props>(AysncComponent) {
  class PermissionsBase extends React.Component<Props, PermissionsState> {
    public componentDidMount() {
      const { userAccess, userAccessFetchStatus }: any = this.props;

      if (!userAccess && userAccessFetchStatus !== FetchStatus.inProgress) {
        this.fetchUserAccess();
      }
    }

    public componentDidUpdate() {
      const { userAccess, userAccessError, userAccessFetchStatus }: any = this.props;

      if (!userAccess && userAccessFetchStatus !== FetchStatus.inProgress && !userAccessError) {
        this.fetchUserAccess();
      }
    }

    private fetchUserAccess = () => {
      const { userAccessQueryString, fetchUserAccess }: any = this.props;
      fetchUserAccess(UserAccessType.all, userAccessQueryString);
    };

    private hasPermissions() {
      const { location, userAccess }: any = this.props;

      if (!userAccess) {
        return false;
      }

      const aws = userAccess.data.find(d => d.type === UserAccessType.aws);
      const azure = userAccess.data.find(d => d.type === UserAccessType.azure);
      const costModel = userAccess.data.find(d => d.type === UserAccessType.cost_model);
      const gcp = userAccess.data.find(d => d.type === UserAccessType.gcp);
      const ocp = userAccess.data.find(d => d.type === UserAccessType.ocp);

      // cost models may include :uuid
      const _pathname = location.pathname.includes(paths.costModels) ? paths.costModels : location.pathname;
      const currRoute = routes.find(({ path }) => path.includes(_pathname));

      switch (currRoute.path) {
        case paths.overview:
          return (
            (aws && aws.access) ||
            (azure && azure.access) ||
            (costModel && costModel.access) ||
            (gcp && gcp.access) ||
            (ocp && ocp.access)
          );
        case paths.awsDetails:
        case paths.awsDetailsBreakdown:
          return aws && aws.access;
        case paths.azureDetails:
        case paths.azureDetailsBreakdown:
          return azure && azure.access;
        case paths.costModels:
          return costModel && costModel.access;
        case paths.gcpDetails:
        case paths.gcpDetailsBreakdown:
          return gcp && gcp.access;
        case paths.ocpDetails:
        case paths.ocpDetailsBreakdown:
          return ocp && ocp.access;
        default:
          return false;
      }
    }

    public render() {
      const { location, userAccess, userAccessFetchStatus, userAccessError }: any = this.props;

      if (userAccessFetchStatus === FetchStatus.inProgress) {
        return null;
      } else if (userAccessError) {
        return <NotAvailable />;
      } else if (userAccess && userAccessFetchStatus === FetchStatus.complete) {
        if (this.hasPermissions()) {
          return (
            <>
              <InactiveSources {...this.props} />
              <AysncComponent {...this.props} />
            </>
          );
        }
      }

      // Page access denied because user doesn't have RBAC permissions and is not an org admin
      return <NotAuthorized pathname={location.pathname} />;
    }
  }

  const mapStateToProps = createMapStateToProps<PermissionsOwnProps, PermissionsStateProps>(state => {
    const userAccessQueryString = getUserAccessQuery(allUserAccessQuery);
    const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
    const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
    const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
      state,
      UserAccessType.all,
      userAccessQueryString
    );

    return {
      userAccess,
      userAccessError,
      userAccessFetchStatus,
      userAccessQueryString,
    };
  });

  const mapDispatchToProps: PermissionsDispatchProps = {
    fetchUserAccess: userAccessActions.fetchUserAccess,
  };

  const Permissions = connect(mapStateToProps, mapDispatchToProps)(PermissionsBase);

  return Permissions;
}
