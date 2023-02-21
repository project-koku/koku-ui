import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';
import type { AxiosError } from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { routes } from 'routes';
import { Loading } from 'routes/state/loading';
import { NotAuthorized } from 'routes/state/notAuthorized';
import { NotAvailable } from 'routes/state/notAvailable';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import { usePathname } from 'utils/paths';
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
  const hasPermissions = pathname => {
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

    switch (pathname) {
      case routes.explorer.pathname:
      case routes.overview.pathname:
        return aws || azure || costModel || gcp || ibm || ocp || oci;
      case routes.awsDetails.pathname:
      case routes.awsDetailsBreakdown.pathname:
        return aws;
      case routes.azureDetails.pathname:
      case routes.azureDetailsBreakdown.pathname:
        return azure;
      case routes.costModelsDetails.pathname:
        return costModel;
      case routes.gcpDetails.pathname:
      case routes.gcpDetailsBreakdown.pathname:
        return gcp;
      case routes.ociDetails.pathname:
      case routes.ociDetailsBreakdown.pathname:
        return oci;
      case routes.ibmDetails.pathname:
      case routes.ibmDetailsBreakdown.pathname:
        return ibm;
      case routes.ocpDetails.pathname:
      case routes.ocpDetailsBreakdown.pathname:
        return ocp;
      case routes.recommendations.pathname:
        return ros;
      case routes.rhelDetails.pathname:
      case routes.rhelDetailsBreakdown.pathname:
        return rhel;
      default:
        return false;
    }
  };

  // Page access denied because user doesn't have RBAC permissions and is not an org admin
  const pathname = usePathname();
  let result = <NotAuthorized pathname={pathname} />;

  if (userAccessFetchStatus === FetchStatus.inProgress) {
    result = <Loading />;
  } else if (userAccessError) {
    result = <NotAvailable />;
  } else if (hasPermissions(pathname)) {
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
