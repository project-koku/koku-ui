import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';
import type { AxiosError } from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { paths, routes } from 'routes';
import { Loading } from 'routes/state/loading';
import { NotAuthorized } from 'routes/state/notAuthorized';
import { NotAvailable } from 'routes/state/notAvailable';
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
  hasRhelAccess,
  hasRosAccess,
} from 'utils/userAccess';

interface PermissionsOwnProps {
  children?: React.ReactNode;
}

interface PermissionsStateProps {
  isFinsightsFeatureEnabled?: boolean;
  isIbmFeatureEnabled?: boolean;
  isOciFeatureEnabled?: boolean;
  isRosFeatureEnabled?: boolean;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

type PermissionsProps = PermissionsOwnProps & PermissionsStateProps;

const PermissionsBase: React.FC<PermissionsProps> = ({
  children = null,
  isFinsightsFeatureEnabled,
  isIbmFeatureEnabled,
  isOciFeatureEnabled,
  isRosFeatureEnabled,
  userAccess,
  userAccessError,
  userAccessFetchStatus,
}) => {
  const getRoutePath = () => {
    const location = useLocation();

    // cost models may include UUID in path
    const _pathname = location.pathname.startsWith(paths.costModels) ? paths.costModels : location.pathname;
    const currRoute = routes.find(({ path }) => path === _pathname);

    return currRoute ? currRoute.path : undefined;
  };

  const hasPermissions = path => {
    if (!(userAccess && userAccessFetchStatus === FetchStatus.complete)) {
      return false;
    }

    const aws = hasAwsAccess(userAccess);
    const azure = hasAzureAccess(userAccess);
    const costModel = hasCostModelAccess(userAccess);
    const gcp = hasGcpAccess(userAccess);
    const ibm = isIbmFeatureEnabled && hasIbmAccess(userAccess);
    const oci = isOciFeatureEnabled && hasOciAccess(userAccess);
    const ocp = hasOcpAccess(userAccess);
    const rhel = isFinsightsFeatureEnabled && hasRhelAccess(userAccess);
    const ros = isRosFeatureEnabled && hasRosAccess(userAccess);

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
      case paths.recommendations:
        return ros;
      case paths.rhelDetails:
      case paths.rhelDetailsBreakdown:
        return rhel;
      default:
        return false;
    }
  };

  // Page access denied because user doesn't have RBAC permissions and is not an org admin
  const path = getRoutePath();
  let result = <NotAuthorized pathname={path} />;

  if (userAccessFetchStatus === FetchStatus.inProgress) {
    result = <Loading />;
  } else if (userAccessError) {
    result = <NotAvailable />;
  } else if (hasPermissions(path)) {
    result = <>{children}</>;
  }
  return result;
};

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
    isFinsightsFeatureEnabled: featureFlagsSelectors.selectIsFinsightsFeatureEnabled(state),
    isIbmFeatureEnabled: featureFlagsSelectors.selectIsIbmFeatureEnabled(state),
    isOciFeatureEnabled: featureFlagsSelectors.selectIsOciFeatureEnabled(state),
    isRosFeatureEnabled: featureFlagsSelectors.selectIsRosFeatureEnabled(state),
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const Permissions = connect(mapStateToProps, undefined)(PermissionsBase);

export default Permissions;
