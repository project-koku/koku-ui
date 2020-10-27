import { NotAuthorized as _NotAuthorized } from '@redhat-cloud-services/frontend-components/components/NotAuthorized';
import { ProviderType } from 'api/providers';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';

interface NotAuthorizedStateOwnProps {
  providerType?: ProviderType;
}

type NotAuthorizedStateProps = NotAuthorizedStateOwnProps & WithTranslation & RouteComponentProps<void>;

class NotAuthorizedStateBase extends React.Component<NotAuthorizedStateProps> {
  public render() {
    const { providerType, t } = this.props;

    let serviceName = 'cost_management';

    switch (providerType) {
      case ProviderType.aws:
        serviceName = 'no_auth_state.aws_service_name';
        break;
      case ProviderType.azure:
        serviceName = 'no_auth_state.azure_service_name';
        break;
      case ProviderType.ocp:
        serviceName = 'no_auth_state.ocp_service_name';
        break;
    }
    return <_NotAuthorized serviceName={t(serviceName)} />;
  }
}

const NotAuthorizedState = withRouter(withTranslation()(NotAuthorizedStateBase));

export { NotAuthorizedState };
