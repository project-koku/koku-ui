import { NotAuthorized as UnAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
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

class NotAuthorizedStateBase extends React.Component<NotAuthorizedStateProps> {
  public render() {
    const { intl, pathname } = this.props;

    let msg;

    switch (pathname) {
      case formatPath(routes.awsDetails.path):
      case formatPath(routes.awsDetailsBreakdown.path):
        msg = messages.notAuthorizedStateAws;
        break;
      case formatPath(routes.azureDetails.path):
      case formatPath(routes.azureDetailsBreakdown.path):
        msg = messages.notAuthorizedStateAzure;
        break;
      case formatPath(routes.costModelsDetails.path):
        msg = messages.notAuthorizedStateCostModels;
        break;
      case formatPath(routes.gcpDetails.path):
      case formatPath(routes.gcpDetailsBreakdown.path):
        msg = messages.notAuthorizedStateGcp;
        break;
      case formatPath(routes.ibmDetails.path):
      case formatPath(routes.ibmDetailsBreakdown.path):
        msg = messages.notAuthorizedStateIbm;
        break;
      case formatPath(routes.ociDetails.path):
      case formatPath(routes.ociDetailsBreakdown.path):
        msg = messages.notAuthorizedStateOci;
        break;
      case formatPath(routes.ocpDetails.path):
      case formatPath(routes.ocpDetailsBreakdown.path):
        msg = messages.notAuthorizedStateOcp;
        break;
      case formatPath(routes.rhelDetails.path):
      case formatPath(routes.rhelDetailsBreakdown.path):
        msg = messages.notAuthorizedStateRhel;
        break;
      case formatPath(routes.recommendations.path):
        msg = messages.notAuthorizedStateRecommendations;
        break;
      case formatPath(routes.explorer.path):
      default:
        msg = messages.costManagement;
        break;
    }
    return <UnAuthorized serviceName={intl.formatMessage(msg)} />;
  }
}

const NotAuthorizedState = injectIntl(NotAuthorizedStateBase);

export { NotAuthorizedState };
