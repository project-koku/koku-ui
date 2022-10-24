import _NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import type { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { paths } from 'routes';

interface NotAuthorizedStateOwnProps {
  pathname?: string;
}

type NotAuthorizedStateProps = NotAuthorizedStateOwnProps & WrappedComponentProps & RouteComponentProps<void>;

class NotAuthorizedStateBase extends React.Component<NotAuthorizedStateProps> {
  public render() {
    const { intl, pathname } = this.props;

    let msg;

    switch (pathname) {
      case paths.awsDetails:
      case paths.awsDetailsBreakdown:
        msg = messages.notAuthorizedStateAws;
        break;
      case paths.azureDetails:
      case paths.azureDetailsBreakdown:
        msg = messages.notAuthorizedStateAzure;
        break;
      case paths.costModels:
        msg = messages.notAuthorizedStateCostModels;
        break;
      case paths.gcpDetails:
      case paths.gcpDetailsBreakdown:
        msg = messages.notAuthorizedStateGcp;
        break;
      case paths.ibmDetails:
      case paths.ibmDetailsBreakdown:
        msg = messages.notAuthorizedStateIbm;
        break;
      case paths.ociDetails:
      case paths.ociDetailsBreakdown:
        msg = messages.notAuthorizedStateOci;
        break;
      case paths.ocpDetails:
      case paths.ocpDetailsBreakdown:
        msg = messages.notAuthorizedStateOcp;
        break;
      case paths.explorer:
      default:
        msg = messages.costManagement;
        break;
    }
    return <_NotAuthorized serviceName={intl.formatMessage(msg)} />;
  }
}

const NotAuthorizedState = injectIntl(withRouter(NotAuthorizedStateBase));

export { NotAuthorizedState };
