import { NotAuthorized as _NotAuthorized } from '@redhat-cloud-services/frontend-components/components/NotAuthorized';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { paths } from 'routes';

interface NotAuthorizedStateOwnProps {
  pathname?: string;
}

type NotAuthorizedStateProps = NotAuthorizedStateOwnProps & WithTranslation & RouteComponentProps<void>;

class NotAuthorizedStateBase extends React.Component<NotAuthorizedStateProps> {
  public render() {
    const { pathname, t } = this.props;

    let serviceName = 'cost_management';

    switch (pathname) {
      case paths.awsDetails:
      case paths.awsDetailsBreakdown:
        serviceName = 'no_auth_state.aws_service_name';
        break;
      case paths.azureDetails:
      case paths.azureDetailsBreakdown:
        serviceName = 'no_auth_state.azure_service_name';
        break;
      case paths.gcpDetails:
      case paths.gcpDetailsBreakdown:
        serviceName = 'no_auth_state.gcp_service_name';
        break;
      case paths.costModels:
        serviceName = 'no_auth_state.cost_models_service_name';
        break;
      case paths.ocpDetails:
      case paths.ocpDetailsBreakdown:
        serviceName = 'no_auth_state.ocp_service_name';
        break;
    }
    return <_NotAuthorized serviceName={t(serviceName)} />;
  }
}

const NotAuthorizedState = withRouter(withTranslation()(NotAuthorizedStateBase));

export { NotAuthorizedState };
