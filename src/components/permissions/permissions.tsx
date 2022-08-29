import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { paths, routes } from 'routes';
import Loading from 'routes/state/loading';
import NotAuthorized from 'routes/state/notAuthorized';
import NotAvailable from 'routes/state/notAvailable';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import {
  hasAwsAccess,
  hasAzureAccess,
  hasCostModelAccess,
  hasGcpAccess,
  hasIbmAccess,
  hasOciAccess,
  hasOcpAccess,
} from 'utils/userAccess';

interface PermissionsOwnProps extends RouteComponentProps<void> {
  children?: React.ReactNode;
}

interface PermissionsStateProps {
  isIbmFeatureEnabled?: boolean;
  isOciFeatureEnabled?: boolean;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

type PermissionsProps = PermissionsOwnProps & PermissionsStateProps;

class PermissionsBase extends React.Component<PermissionsProps> {
  private getRoutePath() {
    const { location } = this.props;

    // cost models may include UUID in path
    const _pathname =
      location.pathname && location.pathname.startsWith(paths.costModels) ? paths.costModels : location.pathname;
    const currRoute = routes.find(({ path }) => path === _pathname);

    return currRoute ? currRoute.path : undefined;
  }

  private hasPermissions() {
    const { isIbmFeatureEnabled, isOciFeatureEnabled, userAccess, userAccessFetchStatus } = this.props;

    if (!(userAccess && userAccessFetchStatus === FetchStatus.complete)) {
      return false;
    }

    const aws = hasAwsAccess(userAccess);
    const azure = hasAzureAccess(userAccess);
    const oci = hasOciAccess(userAccess) && isOciFeatureEnabled;
    const costModel = hasCostModelAccess(userAccess);
    const gcp = hasGcpAccess(userAccess);
    const ibm = hasIbmAccess(userAccess) && isIbmFeatureEnabled;
    const ocp = hasOcpAccess(userAccess);
    const path = this.getRoutePath();

    switch (path) {
      case paths.explorer:
      case paths.overview:
        return aws || azure || costModel || gcp || ibm || ocp || oci;
      case paths.awsDetails:
      case paths.awsDetailsBreakdown:
        return aws;
      case paths.azureDetails:
      case paths.azureDetailsBreakdown:
        return azure;
      case paths.costModels:
        return costModel;
      case paths.gcpDetails:
      case paths.gcpDetailsBreakdown:
        return gcp;
      case paths.ociDetails:
      case paths.ociDetailsBreakdown:
        return oci;
      case paths.ibmDetails:
      case paths.ibmDetailsBreakdown:
        return ibm;
      case paths.ocpDetails:
      case paths.ocpDetailsBreakdown:
        return ocp;
      default:
        return false;
    }
  }

  public render() {
    const { children = null, location, userAccessFetchStatus, userAccessError } = this.props;

    if (userAccessFetchStatus === FetchStatus.inProgress) {
      return <Loading />;
    } else if (userAccessError) {
      return <NotAvailable />;
    } else if (this.hasPermissions()) {
      return children;
    }

    // Page access denied because user doesn't have RBAC permissions and is not an org admin
    return <NotAuthorized pathname={location.pathname} />;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<PermissionsOwnProps, PermissionsStateProps>((state, props) => {
  const userAccessQueryString = getUserAccessQuery(userAccessQuery);
  const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
  const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
  const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.all,
    userAccessQueryString
  );

  return {
    isIbmFeatureEnabled: featureFlagsSelectors.selectIsIbmFeatureEnabled(state),
    isOciFeatureEnabled: featureFlagsSelectors.selectIsOciFeatureEnabled(state),
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const Permissions = withRouter(connect(mapStateToProps, undefined)(PermissionsBase));

export { Permissions, PermissionsProps };
