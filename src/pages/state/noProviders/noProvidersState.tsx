import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { ProviderType } from 'api/providers';
import CostIcon from 'components/icons/costIcon';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { getReleasePath } from 'utils/pathname';

import { styles } from './noProvidersState.styles';

interface NoProvidersStateOwnProps {
  providerType?: ProviderType;
}

type NoProvidersStateProps = NoProvidersStateOwnProps & WrappedComponentProps & RouteComponentProps<void>;

class NoProvidersStateBase extends React.Component<NoProvidersStateProps> {
  private getDocLink = (textKey: MessageDescriptor, urlKey: MessageDescriptor) => {
    const { intl } = this.props;

    return (
      <a href={intl.formatMessage(urlKey)} rel="noreferrer" target="_blank">
        {intl.formatMessage(textKey)}
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
    const { intl, providerType } = this.props;

    let descKey = messages.NoProvidersStateOverviewDesc;
    let titleKey = messages.NoProvidersStateOverviewTitle;

    let docUrlKey;
    let icon;
    let textKey;

    switch (providerType) {
      case ProviderType.aws:
        descKey = messages.NoProvidersStateAwsDesc;
        titleKey = messages.NoProvidersStateAwsTitle;
        break;
      case ProviderType.azure:
        descKey = messages.NoProvidersStateAzureDesc;
        titleKey = messages.NoProvidersStateAzureTitle;
        break;
      case ProviderType.gcp:
        descKey = messages.NoProvidersStateGcpDesc;
        titleKey = messages.NoProvidersStateGcpTitle;
        break;
      case ProviderType.ibm:
        descKey = messages.NoProvidersStateIbmDesc;
        titleKey = messages.NoProvidersStateIbmTitle;
        break;
      case ProviderType.ocp:
        descKey = messages.NoProvidersStateOcpDesc;
        docUrlKey = messages.DocsAddOcpSources;
        textKey = messages.NoProvidersStateOcpAddSources;
        titleKey = messages.NoProvidersStateOcpTitle;
        break;
      default:
        icon = CostIcon;
    }
    return (
      <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
        <EmptyStateIcon icon={icon ? icon : PlusCircleIcon} />
        <Title headingLevel="h5" size="lg">
          {intl.formatMessage(titleKey)}
        </Title>
        <EmptyStateBody>{intl.formatMessage(descKey)}</EmptyStateBody>
        {docUrlKey && textKey ? (
          <div style={styles.viewSources}>{this.getDocLink(textKey, docUrlKey)}</div>
        ) : (
          <Button variant="primary" component="a" href={this.getRouteToSources()}>
            {intl.formatMessage(messages.NoProvidersStateGetStarted)}
          </Button>
        )}
      </EmptyState>
    );
  }
}

const NoProvidersState = withRouter(injectIntl(NoProvidersStateBase));

export { NoProvidersState };
