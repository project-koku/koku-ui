import type { MessageDescriptor } from '@formatjs/intl/src/types';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { ProviderType } from 'api/providers';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { CostIcon } from 'routes/components/icons/costIcon';
import { getReleasePath } from 'utils/paths';

import { styles } from './noProvidersState.styles';

interface NoProvidersStateOwnProps {
  detailsComponent?: React.ReactNode;
  providerType?: ProviderType;
}

type NoProvidersStateProps = NoProvidersStateOwnProps & WrappedComponentProps;

class NoProvidersStateBase extends React.Component<NoProvidersStateProps, any> {
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
    return `${release}/settings/integrations`;
  };

  public render() {
    const { detailsComponent, intl, providerType } = this.props;

    let descKey = messages.noProvidersStateOverviewDesc;
    let titleKey = messages.noProvidersStateOverviewTitle;

    let docUrlKey;
    let icon;
    let textKey;

    switch (providerType) {
      case ProviderType.aws:
        descKey = messages.noProvidersStateAwsDesc;
        titleKey = messages.noProvidersStateAwsTitle;
        break;
      case ProviderType.azure:
        descKey = messages.noProvidersStateAzureDesc;
        titleKey = messages.noProvidersStateAzureTitle;
        break;
      case ProviderType.gcp:
        descKey = messages.noProvidersStateGcpDesc;
        titleKey = messages.noProvidersStateGcpTitle;
        break;
      case ProviderType.ibm:
        descKey = messages.noProvidersStateIbmDesc;
        titleKey = messages.noProvidersStateIbmTitle;
        break;
      case ProviderType.ocp:
        descKey = messages.noProvidersStateOcpDesc;
        docUrlKey = messages.docsAddOcpSources;
        textKey = messages.noProvidersStateOcpAddSources;
        titleKey = messages.noProvidersStateOcpTitle;
        break;
      default:
        icon = CostIcon;
    }
    return (
      <EmptyState
        headingLevel="h1"
        icon={icon ? icon : PlusCircleIcon}
        titleText={intl.formatMessage(titleKey)}
        variant={EmptyStateVariant.lg}
        className="pf-m-redhat-font"
      >
        <EmptyStateBody>
          {intl.formatMessage(descKey)}
          {detailsComponent && <Bullseye style={styles.details}>{detailsComponent}</Bullseye>}
        </EmptyStateBody>
        <EmptyStateFooter>
          {docUrlKey && textKey ? (
            <div style={styles.viewSources}>{this.getDocLink(textKey, docUrlKey)}</div>
          ) : (
            <Button variant="primary" component="a" href={this.getRouteToSources()}>
              {intl.formatMessage(messages.noProvidersStateGetStarted)}
            </Button>
          )}
        </EmptyStateFooter>
      </EmptyState>
    );
  }
}

const NoProvidersState = injectIntl(NoProvidersStateBase);

export { NoProvidersState };
