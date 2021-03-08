import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import Loading from 'pages/state/loading';
import NotAuthorized from 'pages/state/notAuthorized';
import NotAvailable from 'pages/state/notAvailable';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { paths, routes } from 'routes';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { allUserAccessQuery, userAccessActions, userAccessSelectors } from 'store/userAccess';

interface PermissionsOwnProps extends RouteComponentProps<void> {
  children?: React.ReactNode;
}

interface PermissionsStateProps {
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

interface PermissionsDispatchProps {
  fetchUserAccess: typeof userAccessActions.fetchUserAccess;
}

interface PermissionsState {
  // TBD...
}

type PermissionsProps = PermissionsOwnProps & PermissionsDispatchProps & PermissionsStateProps;

class PermissionsBase extends React.Component<PermissionsProps> {
  protected defaultState: PermissionsState = {
    // TBD...
  };
  public state: PermissionsState = { ...this.defaultState };

  public componentDidMount() {
    const { userAccessQueryString, fetchUserAccess } = this.props;

    fetchUserAccess(UserAccessType.all, userAccessQueryString);
  }

  private hasPermissions() {
    const { location, userAccess }: any = this.props;

    if (!userAccess) {
      return false;
    }

    // Todo: Remove override when API is available
    if (userAccess && userAccess.data) {
      userAccess.data.push({
        type: 'explorer',
        access: true,
      });
    }

    const aws = userAccess.data.find(d => d.type === UserAccessType.aws);
    const azure = userAccess.data.find(d => d.type === UserAccessType.azure);
    const costModel = userAccess.data.find(d => d.type === UserAccessType.cost_model);
    const explorer = userAccess.data.find(d => d.type === UserAccessType.explorer);
    const gcp = userAccess.data.find(d => d.type === UserAccessType.gcp);
    const ibm = userAccess.data.find(d => d.type === UserAccessType.ibm);
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
          (ibm && ibm.access) ||
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
      case paths.explorer:
        return explorer && explorer.access;
      case paths.gcpDetails:
      case paths.gcpDetailsBreakdown:
        return gcp && gcp.access;
      case paths.ibmDetails:
      case paths.ibmDetailsBreakdown:
        return ibm && ibm.access;
      case paths.ocpDetails:
      case paths.ocpDetailsBreakdown:
        return ocp && ocp.access;
      default:
        return false;
    }
  }

  public render() {
    const { children = null, location, userAccess, userAccessFetchStatus, userAccessError } = this.props;

    if (userAccessFetchStatus === FetchStatus.inProgress) {
      return <Loading />;
    } else if (userAccessError) {
      return <NotAvailable />;
    } else if (userAccess && userAccessFetchStatus === FetchStatus.complete && this.hasPermissions()) {
      return children;
    }

    // Page access denied because user doesn't have RBAC permissions and is not an org admin
    return <NotAuthorized pathname={location.pathname} />;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<PermissionsOwnProps, PermissionsStateProps>((state, props) => {
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

const Permissions = withRouter(connect(mapStateToProps, mapDispatchToProps)(PermissionsBase));

export { Permissions, PermissionsProps };
