import { MessageDescriptor } from '@formatjs/intl/src/types';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import Loading from 'pages/state/loading';
import NotAuthorized from 'pages/state/notAuthorized';
import NotAvailable from 'pages/state/notAvailable';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { paths, routes } from 'routes';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { allUserAccessQuery, ibmUserAccessQuery, userAccessActions, userAccessSelectors } from 'store/userAccess';
import {
  hasAwsAccess,
  hasAzureAccess,
  hasCostModelAccess,
  hasGcpAccess,
  hasIbmAccess,
  hasOcpAccess,
} from 'utils/userAccess';

interface PermissionsOwnProps extends RouteComponentProps<void> {
  children?: React.ReactNode;
}

interface PermissionsStateProps {
  ibmUserAccess: UserAccess;
  ibmUserAccessError: AxiosError;
  ibmUserAccessFetchStatus: FetchStatus;
  ibmUserAccessQueryString: string;
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

type PermissionsProps = PermissionsOwnProps & PermissionsDispatchProps & PermissionsStateProps & WrappedComponentProps;

class PermissionsBase extends React.Component<PermissionsProps> {
  protected defaultState: PermissionsState = {
    // TBD...
  };
  public state: PermissionsState = { ...this.defaultState };

  public componentDidMount() {
    const { ibmUserAccessQueryString, userAccessQueryString, fetchUserAccess } = this.props;

    fetchUserAccess(UserAccessType.all, userAccessQueryString);
    fetchUserAccess(UserAccessType.ibm, ibmUserAccessQueryString);
  }

  private getPath() {
    // cost models may include :uuid
    const _pathname = location.pathname.startsWith(paths.costModels) ? paths.costModels : location.pathname;
    const currRoute = routes.find(({ path }) => path === _pathname);

    return currRoute ? currRoute.path : undefined;
  }

  private getTitle(): MessageDescriptor {
    switch (this.getPath()) {
      case paths.explorer:
        return messages.ExplorerTitle;
      case paths.overview:
        return messages.OverviewTitle;
      case paths.awsDetails:
      case paths.awsDetailsBreakdown:
        return messages.AWSDetailsTitle;
      case paths.azureDetails:
      case paths.azureDetailsBreakdown:
        return messages.AzureDetailsTitle;
      case paths.costModels:
        return messages.CostModelsTitle;
      case paths.gcpDetails:
      case paths.gcpDetailsBreakdown:
        return messages.GCPDetailsTitle;
      case paths.ibmDetails:
      case paths.ibmDetailsBreakdown:
        return messages.IBMDetailsTitle;
      case paths.ocpDetails:
      case paths.ocpDetailsBreakdown:
        return messages.OCPDetailsTitle;
      default:
        return {};
    }
  }

  private hasPermissions() {
    const { ibmUserAccess, userAccess }: any = this.props;

    if (!userAccess) {
      return false;
    }

    const aws = hasAwsAccess(userAccess);
    const azure = hasAzureAccess(userAccess);
    const costModel = hasCostModelAccess(userAccess);
    const gcp = hasGcpAccess(userAccess);
    const ibm = hasIbmAccess(ibmUserAccess);
    const ocp = hasOcpAccess(userAccess);

    switch (this.getPath()) {
      case paths.explorer:
      case paths.overview:
        return aws || azure || costModel || gcp || ibm || ocp;
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
    const { children = null, intl, location, userAccess, userAccessFetchStatus, userAccessError } = this.props;

    if (userAccessFetchStatus === FetchStatus.inProgress) {
      return <Loading />;
    } else if (userAccessError) {
      return <NotAvailable title={intl.formatMessage(this.getTitle())} />;
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

  // Todo: temporarily request IBM separately with beta flag.
  const ibmUserAccessQueryString = getUserAccessQuery(ibmUserAccessQuery);
  const ibmUserAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.ibm, ibmUserAccessQueryString);
  const ibmUserAccessError = userAccessSelectors.selectUserAccessError(
    state,
    UserAccessType.ibm,
    ibmUserAccessQueryString
  );
  const ibmUserAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.ibm,
    ibmUserAccessQueryString
  );

  return {
    ibmUserAccess,
    ibmUserAccessError,
    ibmUserAccessFetchStatus,
    ibmUserAccessQueryString,
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const mapDispatchToProps: PermissionsDispatchProps = {
  fetchUserAccess: userAccessActions.fetchUserAccess,
};

const PermissionsConnect = connect(mapStateToProps, mapDispatchToProps)(PermissionsBase);
const Permissions = withRouter(injectIntl(PermissionsConnect));

export { Permissions, PermissionsProps };
