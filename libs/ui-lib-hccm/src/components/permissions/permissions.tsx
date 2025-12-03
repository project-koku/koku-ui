import { getUserAccessQuery } from '@koku-ui/api/queries/userAccessQuery';
import type { UserAccess } from '@koku-ui/api/userAccess';
import { UserAccessType } from '@koku-ui/api/userAccess';
import type { AxiosError } from 'axios';
import React from 'react';
import { connect } from 'react-redux';

import { routes } from '../../routes';
import { Loading } from '../../routes/components/page/loading';
import { NotAuthorized } from '../../routes/components/page/notAuthorized';
import { NotAvailable } from '../../routes/components/page/notAvailable';
import { createMapStateToProps, FetchStatus } from '../../store/common';
import { userAccessQuery, userAccessSelectors } from '../../store/userAccess';
import { formatPath, usePathname } from '../../utils/paths';
import {
  hasAwsAccess,
  hasAzureAccess,
  hasCostModelAccess,
  hasGcpAccess,
  hasOcpAccess,
  hasSettingsAccess,
} from '../../utils/userAccess';

interface PermissionsOwnProps {
  children?: React.ReactNode;
}

interface PermissionsStateProps {
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

type PermissionsProps = PermissionsOwnProps & PermissionsStateProps;

const PermissionsBase: React.FC<PermissionsProps> = ({
  children = null,
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
    const ocp = hasOcpAccess(userAccess);
    const settings = costModel || hasSettingsAccess(userAccess);

    switch (pathname) {
      case formatPath(routes.explorer.path):
      case formatPath(routes.overview.path):
        return aws || azure || gcp || ocp;
      case formatPath(routes.awsBreakdown.path):
      case formatPath(routes.awsDetails.path):
        return aws;
      case formatPath(routes.azureBreakdown.path):
      case formatPath(routes.azureDetails.path):
        return azure;
      case formatPath(routes.costModel.basePath):
        return costModel;
      case formatPath(routes.gcpBreakdown.path):
      case formatPath(routes.gcpDetails.path):
        return gcp;
      case formatPath(routes.ocpBreakdown.path):
      case formatPath(routes.ocpBreakdownOptimizations.path):
      case formatPath(routes.ocpDetails.path):
      case formatPath(routes.optimizationsBreakdown.path):
      case formatPath(routes.optimizationsDetails.path):
        return ocp;
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
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const Permissions = connect(mapStateToProps, undefined)(PermissionsBase);

export default Permissions;
