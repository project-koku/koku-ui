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
import { formatPath, usePathname } from 'utils/paths';
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
  isRosFeatureEnabled?: boolean;
  isSettingsEnabled?: boolean;
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
  isRosFeatureEnabled,
  isSettingsEnabled,
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
    const oci = hasOciAccess(userAccess);
    const ocp = hasOcpAccess(userAccess);
    const rhel = isFinsightsFeatureEnabled && hasRhelAccess(userAccess);
    const ros = isRosFeatureEnabled && hasRosAccess(userAccess);
    const settings = isSettingsEnabled;

    switch (pathname) {
      case formatPath(routes.explorer.path):
      case formatPath(routes.overview.path):
        return aws || azure || costModel || gcp || ibm || ocp || oci;
      case formatPath(routes.awsDetails.path):
      case formatPath(routes.awsDetailsBreakdown.path):
        return aws;
      case formatPath(routes.azureDetails.path):
      case formatPath(routes.azureDetailsBreakdown.path):
        return azure;
      case formatPath(routes.costModel.basePath):
      case formatPath(routes.costModelsDetails.path):
        return costModel;
      case formatPath(routes.gcpDetails.path):
      case formatPath(routes.gcpDetailsBreakdown.path):
        return gcp;
      case formatPath(routes.ociDetails.path):
      case formatPath(routes.ociDetailsBreakdown.path):
        return oci;
      case formatPath(routes.ibmDetails.path):
      case formatPath(routes.ibmDetailsBreakdown.path):
        return ibm;
      case formatPath(routes.ocpDetails.path):
      case formatPath(routes.ocpDetailsBreakdown.path):
        return ocp;
      case formatPath(routes.optimizations.path):
        return ros;
      case formatPath(routes.rhelDetails.path):
      case formatPath(routes.rhelDetailsBreakdown.path):
        return rhel;
      case formatPath(routes.settings.path):
        return settings;
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
    isRosFeatureEnabled: featureFlagsSelectors.selectIsRosFeatureEnabled(state),
    isSettingsEnabled: featureFlagsSelectors.selectIsSettingsFeatureEnabled(state),
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const Permissions = connect(mapStateToProps, undefined)(PermissionsBase);

export default Permissions;
