import './inactiveSources.scss';

import type { Providers } from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import messages from '@koku-ui/i18n/locales/messages';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps, FetchStatus } from '../../store/common';
import { providersQuery, providersSelectors } from '../../store/providers';
import { getReleasePath } from '../../utils/paths';
import { deleteInactiveSources, isInactiveSourcesValid, setInactiveSources } from '../../utils/sessionStorage';

interface InactiveSourcesOwnProps {
  // TBD...
}

interface InactiveSourcesStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
}

type InactiveSourcesProps = InactiveSourcesOwnProps & InactiveSourcesStateProps & WrappedComponentProps;

class InactiveSourcesBase extends React.Component<InactiveSourcesProps, any> {
  private getInactiveSourceNames = () => {
    const { providers } = this.props;

    const sources = [];

    if (providers && providers.data) {
      providers.data.map(data => {
        if (data.active === false && data.paused === false) {
          sources.push(data.name);
        }
      });
    }
    return sources;
  };

  private getInactiveSources = (names: string[]) => {
    if (names.length < 2) {
      return null;
    }
    return (
      <p>
        {names.map((name, index) => {
          if (index === names.length - 1) {
            return name;
          } else {
            return `${name}, `;
          }
        })}
      </p>
    );
  };

  private handleOnClose = () => {
    setInactiveSources('true');
    this.forceUpdate();
  };

  private isAlertClosed = () => {
    // Keep closed if token is valid for current session
    return isInactiveSourcesValid();
  };

  public render() {
    const { providers, providersError, providersFetchStatus, intl } = this.props;

    const release = getReleasePath();
    const names = this.getInactiveSourceNames();
    const title =
      names.length === 1
        ? intl.formatMessage(messages.inactiveSourcesTitle, { value: names[0] })
        : intl.formatMessage(messages.inactiveSourcesTitleMultiplier);

    if (names.length === 0) {
      if (providers && providersFetchStatus === FetchStatus.complete && !providersError) {
        deleteInactiveSources(); // Reset cookie for new alerts
      }
      return null;
    }
    if (this.isAlertClosed()) {
      return null; // Don't display alert
    }

    return (
      <div className="alert">
        <Alert
          isInline
          variant="danger"
          title={title}
          actionClose={<AlertActionCloseButton onClose={this.handleOnClose} />}
          actionLinks={
            <React.Fragment>
              <a href={`${release}/settings/integrations`}>{intl.formatMessage(messages.inactiveSourcesGoTo)}</a>
            </React.Fragment>
          }
        >
          {this.getInactiveSources(names)}
        </Alert>
      </div>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<InactiveSourcesOwnProps, InactiveSourcesStateProps>((state, props) => {
  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  // For testing...
  //
  // if (providers && providers.data) {
  //   if (providers.data.length) {
  //     providers.data[0].active = false;
  //   } else {
  //     providers.data[0] = {
  //       name: 'AWS for OpenShift',
  //       active: false,
  //     };
  //   }
  // }

  return {
    providers,
    providersError,
    providersFetchStatus,
  };
});

const InactiveSources = injectIntl(connect(mapStateToProps, undefined)(InactiveSourcesBase));

export default InactiveSources;
