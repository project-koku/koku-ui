import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { ProviderType } from 'api/providers';
import CostIcon from 'components/icons/costIcon';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { getReleasePath } from 'utils/pathname';

import { styles } from './noProvidersState.styles';

interface NoProvidersStateOwnProps {
  providerType?: ProviderType;
}

type NoProvidersStateProps = NoProvidersStateOwnProps & WithTranslation & RouteComponentProps<void>;

class NoProvidersStateBase extends React.Component<NoProvidersStateProps> {
  private getDocLink = (textKey, urlKey) => {
    const { t } = this.props;

    return (
      <a href={t(urlKey)} rel="noreferrer" target="_blank">
        {t(textKey)}
        <span style={styles.iconSpacer}>
          <ExternalLinkAltIcon />
        </span>
      </a>
    );
  };

  private getRouteToSources = () => {
    const release = getReleasePath();
    return `${release}/settings/sources`;
  };

  public render() {
    const { providerType, t } = this.props;

    let descKey = 'no_providers_state.overview_desc';
    let titleKey = 'no_providers_state.overview_title';

    let docUrlKey;
    let icon;
    let textKey;

    switch (providerType) {
      case ProviderType.aws:
        descKey = 'no_providers_state.aws_desc';
        titleKey = 'no_providers_state.aws_title';
        break;
      case ProviderType.azure:
        descKey = 'no_providers_state.azure_desc';
        titleKey = 'no_providers_state.azure_title';
        break;
      case ProviderType.gcp:
        descKey = 'no_providers_state.gcp_desc';
        titleKey = 'no_providers_state.gcp_title';
        break;
      case ProviderType.ocp:
        descKey = 'no_providers_state.ocp_desc';
        docUrlKey = 'docs.add_ocp_sources';
        textKey = 'no_providers_state.ocp_add_sources';
        titleKey = 'no_providers_state.ocp_title';
        break;
      default:
        icon = CostIcon;
    }
    return (
      <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
        <EmptyStateIcon icon={icon ? icon : PlusCircleIcon} />
        <Title headingLevel="h5" size="lg">
          {t(titleKey)}
        </Title>
        <EmptyStateBody>{t(descKey)}</EmptyStateBody>
        {docUrlKey && textKey ? (
          <div style={styles.viewSources}>{this.getDocLink(textKey, docUrlKey)}</div>
        ) : (
          <Button variant="primary" component="a" href={this.getRouteToSources()}>
            {t('no_providers_state.get_started')}
          </Button>
        )}
      </EmptyState>
    );
  }
}

const NoProvidersState = withRouter(withTranslation()(NoProvidersStateBase));

export { NoProvidersState };
