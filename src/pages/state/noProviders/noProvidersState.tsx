import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { ProviderType } from 'api/providers';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { getReleasePath } from 'utils/pathname';

interface NoProvidersStateOwnProps {
  providerType?: ProviderType;
}

type NoProvidersStateProps = NoProvidersStateOwnProps & WithTranslation & RouteComponentProps<void>;

class NoProvidersStateBase extends React.Component<NoProvidersStateProps> {
  private getRouteToSources = () => {
    const release = getReleasePath();
    return `${release}/settings/sources`;
  };

  public render() {
    const { providerType, t } = this.props;
    let descKey = 'no_providers_state.overview_desc';
    let titleKey = 'no_providers_state.overview_title';

    switch (providerType) {
      case ProviderType.aws:
        descKey = 'no_providers_state.aws_desc';
        titleKey = 'no_providers_state.aws_title';
        break;
      case ProviderType.azure:
        descKey = 'no_providers_state.azure_desc';
        titleKey = 'no_providers_state.azure_title';
        break;
      case ProviderType.ocp:
        descKey = 'no_providers_state.ocp_desc';
        titleKey = 'no_providers_state.ocp_title';
        break;
    }
    return (
      <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
        <EmptyStateIcon icon={PlusCircleIcon} />
        <Title headingLevel="h5" size="lg">
          {t(titleKey)}
        </Title>
        <EmptyStateBody>{t(descKey)}</EmptyStateBody>
        <Button variant="primary" component="a" href={this.getRouteToSources()}>
          {t('no_providers_state.get_started')}
        </Button>
      </EmptyState>
    );
  }
}

const NoProvidersState = withRouter(withTranslation()(NoProvidersStateBase));

export { NoProvidersState };
