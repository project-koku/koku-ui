import _NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
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
        msg = messages.NotAuthorizedStateAws;
        break;
      case paths.azureDetails:
      case paths.azureDetailsBreakdown:
        msg = messages.NotAuthorizedStateAzure;
        break;
      case paths.costModels:
        msg = messages.NotAuthorizedStateCostModels;
        break;
      case paths.gcpDetails:
      case paths.gcpDetailsBreakdown:
        msg = messages.NotAuthorizedStateGcp;
        break;
      case paths.ibmDetails:
      case paths.ibmDetailsBreakdown:
        msg = messages.NotAuthorizedStateIbm;
        break;
      case paths.ocpDetails:
      case paths.ocpDetailsBreakdown:
        msg = messages.NotAuthorizedStateOcp;
        break;
      case paths.explorer:
      default:
        msg = messages.CostManagement;
        break;
    }
    return <_NotAuthorized serviceName={intl.formatMessage(msg)} />;
  }
}

const NotAuthorizedState = injectIntl(withRouter(NotAuthorizedStateBase));

export { NotAuthorizedState };
