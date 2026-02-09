import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';
import type { AxiosError } from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { routes } from 'routes';
import { Loading } from 'routes/components/page/loading';
import { NotAuthorized } from 'routes/components/page/notAuthorized';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { userAccessQuery, userAccessSelectors } from 'store/userAccess';
import type { ChromeComponentProps } from 'utils/chrome';
import { withChrome } from 'utils/chrome';
import { formatPath, usePathname } from 'utils/paths';
import { hasRosAccess } from 'utils/userAccess';

interface PermissionsOwnProps extends ChromeComponentProps {
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
  // chrome,
  userAccess,
  userAccessError,
  userAccessFetchStatus,
}) => {
  const hasPermissions = pathname => {
    if (!(userAccess && userAccessFetchStatus === FetchStatus.complete)) {
      return false;
    }

    const ros = hasRosAccess(userAccess);

    switch (pathname) {
      case formatPath(routes.optimizationsBadge.path):
      case formatPath(routes.optimizationsBreakdown.path):
      case formatPath(routes.optimizationsDetails.path):
      case formatPath(routes.optimizationsLink.path):
      case formatPath(routes.optimizationsOcpBreakdown.path):
      case formatPath(routes.optimizationsSummary.path):
      case formatPath(routes.optimizationsTable.path):
      case formatPath(routes.welcome.path):
        return ros;
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

const Permissions = withChrome(connect(mapStateToProps, undefined)(PermissionsBase));

export default Permissions;
