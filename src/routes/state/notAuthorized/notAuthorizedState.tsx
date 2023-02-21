import { NotAuthorized as UnAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { routes } from 'routes';

interface NotAuthorizedStateOwnProps {
  pathname?: string;
}

type NotAuthorizedStateProps = NotAuthorizedStateOwnProps & WrappedComponentProps;

class NotAuthorizedStateBase extends React.Component<NotAuthorizedStateProps> {
  public render() {
    const { intl, pathname } = this.props;

    let msg;

    switch (pathname) {
      case routes.awsDetails.pathname:
      case routes.awsDetailsBreakdown.pathname:
        msg = messages.notAuthorizedStateAws;
        break;
      case routes.azureDetails.pathname:
      case routes.azureDetailsBreakdown.pathname:
        msg = messages.notAuthorizedStateAzure;
        break;
      case routes.costModelsDetails.pathname:
        msg = messages.notAuthorizedStateCostModels;
        break;
      case routes.gcpDetails.pathname:
      case routes.gcpDetailsBreakdown.pathname:
        msg = messages.notAuthorizedStateGcp;
        break;
      case routes.ibmDetails.pathname:
      case routes.ibmDetailsBreakdown.pathname:
        msg = messages.notAuthorizedStateIbm;
        break;
      case routes.ociDetails.pathname:
      case routes.ociDetailsBreakdown.pathname:
        msg = messages.notAuthorizedStateOci;
        break;
      case routes.ocpDetails.pathname:
      case routes.ocpDetailsBreakdown.pathname:
        msg = messages.notAuthorizedStateOcp;
        break;
      case routes.rhelDetails.pathname:
      case routes.rhelDetailsBreakdown.pathname:
        msg = messages.notAuthorizedStateRhel;
        break;
      case routes.recommendations.pathname:
        msg = messages.notAuthorizedStateRecommendations;
        break;
      case routes.explorer.pathname:
      default:
        msg = messages.costManagement;
        break;
    }
    return <UnAuthorized serviceName={intl.formatMessage(msg)} />;
  }
}

const NotAuthorizedState = injectIntl(NotAuthorizedStateBase);

export { NotAuthorizedState };
