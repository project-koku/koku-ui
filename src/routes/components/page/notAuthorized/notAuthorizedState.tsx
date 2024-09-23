import UnauthorizedAccess from '@patternfly/react-component-groups/dist/esm/UnauthorizedAccess';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

interface NotAuthorizedStateOwnProps {
  pathname?: string;
}

type NotAuthorizedStateProps = NotAuthorizedStateOwnProps & WrappedComponentProps;

class NotAuthorizedStateBase extends React.Component<NotAuthorizedStateProps, any> {
  public render() {
    const { intl, pathname } = this.props;

    let msg;

    switch (pathname) {
      case formatPath(routes.awsBreakdown.path):
      case formatPath(routes.awsDetails.path):
        msg = messages.notAuthorizedStateAws;
        break;
      case formatPath(routes.azureBreakdown.path):
      case formatPath(routes.azureDetails.path):
        msg = messages.notAuthorizedStateAzure;
        break;
      case formatPath(routes.costModel.basePath):
        msg = messages.notAuthorizedStateCostModels;
        break;
      case formatPath(routes.gcpBreakdown.path):
      case formatPath(routes.gcpDetails.path):
        msg = messages.notAuthorizedStateGcp;
        break;
      case formatPath(routes.ibmBreakdown.path):
      case formatPath(routes.ibmDetails.path):
        msg = messages.notAuthorizedStateIbm;
        break;
      case formatPath(routes.ociBreakdown.path):
      case formatPath(routes.ociDetails.path):
        msg = messages.notAuthorizedStateOci;
        break;
      case formatPath(routes.ocpBreakdown.path):
      case formatPath(routes.ocpDetails.path):
        msg = messages.notAuthorizedStateOcp;
        break;
      case formatPath(routes.optimizationsBreakdown.path):
      case formatPath(routes.optimizationsDetails.path):
        msg = messages.notAuthorizedStateOptimizations;
        break;
      case formatPath(routes.rhelBreakdown.path):
      case formatPath(routes.rhelDetails.path):
        msg = messages.notAuthorizedStateRhel;
        break;
      case formatPath(routes.settings.path):
        msg = messages.notAuthorizedStateSettings;
        break;
      case formatPath(routes.explorer.path):
      default:
        msg = messages.costManagement;
        break;
    }
    return (
      <>
        Test
        <UnauthorizedAccess serviceName={intl.formatMessage(msg)} />
      </>
    );
  }
}

const NotAuthorizedState = injectIntl(NotAuthorizedStateBase);

export { NotAuthorizedState };
