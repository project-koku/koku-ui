import './inactiveSources.scss';

import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  awsProvidersQuery,
  azureProvidersQuery,
  gcpProvidersQuery,
  ibmProvidersQuery,
  ocpProvidersQuery,
  providersActions,
  providersSelectors,
} from 'store/providers';
import { deleteInactiveSourcesToken, isInactiveSourcesTokenValid, saveInactiveSourcesToken } from 'utils/localStorage';
import { getReleasePath } from 'utils/pathname';

interface InactiveSourcesOwnProps {
  // TBD...
}

interface InactiveSourcesStateProps {
  awsProviders: Providers;
  awsProvidersError: AxiosError;
  awsProvidersFetchStatus: FetchStatus;
  awsProvidersQueryString: string;
  azureProviders: Providers;
  azureProvidersError: AxiosError;
  azureProvidersFetchStatus: FetchStatus;
  azureProvidersQueryString: string;
  gcpProviders: Providers;
  gcpProvidersError: AxiosError;
  gcpProvidersFetchStatus: FetchStatus;
  gcpProvidersQueryString: string;
  ibmProviders: Providers;
  ibmProvidersError: AxiosError;
  ibmProvidersFetchStatus: FetchStatus;
  ibmProvidersQueryString: string;
  ocpProviders: Providers;
  ocpProvidersError: AxiosError;
  ocpProvidersFetchStatus: FetchStatus;
  ocpProvidersQueryString: string;
}

interface InactiveSourcesDispatchProps {
  fetchProviders: typeof providersActions.fetchProviders;
}

interface InactiveSourcesState {
  // TBD...
}

type InactiveSourcesProps = InactiveSourcesOwnProps &
  InactiveSourcesDispatchProps &
  InactiveSourcesStateProps &
  WrappedComponentProps;

class InactiveSourcesBase extends React.Component<InactiveSourcesProps> {
  protected defaultState: InactiveSourcesState = {
    // TBD...
  };
  public state: InactiveSourcesState = { ...this.defaultState };

  public componentDidMount() {
    const {
      awsProviders,
      awsProvidersFetchStatus,
      azureProviders,
      azureProvidersFetchStatus,
      gcpProviders,
      gcpProvidersFetchStatus,
      ibmProviders,
      ibmProvidersFetchStatus,
      ocpProviders,
      ocpProvidersFetchStatus,
    } = this.props;

    if (!awsProviders && awsProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchAwsProviders();
    }
    if (!azureProviders && azureProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchAzureProviders();
    }
    if (!gcpProviders && gcpProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchGcpProviders();
    }
    if (!ibmProviders && ibmProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchIbmProviders();
    }
    if (!ocpProviders && ocpProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchOcpProviders();
    }
  }

  public componentDidUpdate() {
    const {
      awsProviders,
      awsProvidersError,
      awsProvidersFetchStatus,
      azureProviders,
      azureProvidersError,
      azureProvidersFetchStatus,
      gcpProviders,
      gcpProvidersFetchStatus,
      ibmProviders,
      ibmProvidersFetchStatus,
      ocpProviders,
      ocpProvidersError,
      ocpProvidersFetchStatus,
    } = this.props;

    if (!awsProviders && awsProvidersFetchStatus !== FetchStatus.inProgress && !awsProvidersError) {
      this.fetchAwsProviders();
    }
    if (!azureProviders && azureProvidersFetchStatus !== FetchStatus.inProgress && !azureProvidersError) {
      this.fetchAzureProviders();
    }
    if (!gcpProviders && gcpProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchGcpProviders();
    }
    if (!ibmProviders && ibmProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchIbmProviders();
    }
    if (!ocpProviders && ocpProvidersFetchStatus !== FetchStatus.inProgress && !ocpProvidersError) {
      this.fetchOcpProviders();
    }
  }

  private fetchAwsProviders = () => {
    const { awsProvidersQueryString, fetchProviders } = this.props;
    fetchProviders(ProviderType.aws, awsProvidersQueryString);
  };

  private fetchAzureProviders = () => {
    const { azureProvidersQueryString, fetchProviders } = this.props;
    fetchProviders(ProviderType.azure, azureProvidersQueryString);
  };

  private fetchGcpProviders = () => {
    const { gcpProvidersQueryString, fetchProviders } = this.props;
    fetchProviders(ProviderType.gcp, gcpProvidersQueryString);
  };

  private fetchIbmProviders = () => {
    const { ibmProvidersQueryString, fetchProviders } = this.props;
    fetchProviders(ProviderType.ibm, ibmProvidersQueryString);
  };

  private fetchOcpProviders = () => {
    const { fetchProviders, ocpProvidersQueryString } = this.props;
    fetchProviders(ProviderType.ocp, ocpProvidersQueryString);
  };

  private getInactiveSourceNames = () => {
    const { awsProviders, azureProviders, gcpProviders, ibmProviders, ocpProviders } = this.props;

    const sources = [];

    if (awsProviders && awsProviders.data) {
      awsProviders.data.map(data => {
        if (data.active !== true) {
          sources.push(data.name);
        }
      });
    }
    if (azureProviders && azureProviders.data) {
      azureProviders.data.map(data => {
        if (data.active !== true) {
          sources.push(data.name);
        }
      });
    }
    if (gcpProviders && gcpProviders.data) {
      gcpProviders.data.map(data => {
        if (data.active !== true) {
          sources.push(data.name);
        }
      });
    }
    if (ibmProviders && ibmProviders.data) {
      ibmProviders.data.map(data => {
        if (data.active !== true) {
          sources.push(data.name);
        }
      });
    }
    if (ocpProviders && ocpProviders.data) {
      ocpProviders.data.map(data => {
        if (data.active !== true) {
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
    saveInactiveSourcesToken();
    this.forceUpdate();
  };

  private isAlertClosed = () => {
    // Keep closed if token is valid for current session
    return isInactiveSourcesTokenValid();
  };

  private resetAlert = () => {
    deleteInactiveSourcesToken();
  };

  public render() {
    const {
      awsProviders,
      awsProvidersError,
      awsProvidersFetchStatus,
      azureProviders,
      azureProvidersError,
      azureProvidersFetchStatus,
      gcpProviders,
      gcpProvidersError,
      gcpProvidersFetchStatus,
      ibmProviders,
      ibmProvidersError,
      ibmProvidersFetchStatus,
      ocpProviders,
      ocpProvidersError,
      ocpProvidersFetchStatus,
      intl,
    } = this.props;

    const release = getReleasePath();
    const names = this.getInactiveSourceNames();
    const title =
      names.length === 1
        ? intl.formatMessage(messages.InactiveSourcesTitle, { value: names[0] })
        : intl.formatMessage(messages.InactiveSourcesTitleMultiplier);

    if (names.length === 0) {
      if (
        awsProviders &&
        awsProvidersFetchStatus === FetchStatus.complete &&
        !awsProvidersError &&
        azureProviders &&
        azureProvidersFetchStatus === FetchStatus.complete &&
        !azureProvidersError &&
        gcpProviders &&
        gcpProvidersFetchStatus === FetchStatus.complete &&
        !gcpProvidersError &&
        ibmProviders &&
        ibmProvidersFetchStatus === FetchStatus.complete &&
        !ibmProvidersError &&
        ocpProviders &&
        ocpProvidersFetchStatus === FetchStatus.complete &&
        !ocpProvidersError
      ) {
        this.resetAlert(); // Reset cookie for new alerts
      }
      return null;
    }
    if (this.isAlertClosed()) {
      return null; // Don't display alert
    }
    this.resetAlert(); // Clean up previous cookie, if any

    return (
      <div className="alert">
        <Alert
          isInline
          variant="danger"
          title={title}
          actionClose={<AlertActionCloseButton onClose={this.handleOnClose} />}
          actionLinks={
            <React.Fragment>
              <a href={`${release}/settings/sources`}>{intl.formatMessage(messages.InactiveSourcesGoTo)}</a>
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
  const awsProvidersQueryString = getProvidersQuery(awsProvidersQuery);
  const awsProviders = providersSelectors.selectProviders(state, ProviderType.aws, awsProvidersQueryString);
  const awsProvidersError = providersSelectors.selectProvidersError(state, ProviderType.aws, awsProvidersQueryString);
  const awsProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.aws,
    awsProvidersQueryString
  );

  const azureProvidersQueryString = getProvidersQuery(azureProvidersQuery);
  const azureProviders = providersSelectors.selectProviders(state, ProviderType.azure, azureProvidersQueryString);
  const azureProvidersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.azure,
    azureProvidersQueryString
  );
  const azureProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.azure,
    azureProvidersQueryString
  );

  const gcpProvidersQueryString = getProvidersQuery(gcpProvidersQuery);
  const gcpProviders = providersSelectors.selectProviders(state, ProviderType.gcp, gcpProvidersQueryString);
  const gcpProvidersError = providersSelectors.selectProvidersError(state, ProviderType.gcp, gcpProvidersQueryString);
  const gcpProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.gcp,
    gcpProvidersQueryString
  );

  const ibmProvidersQueryString = getProvidersQuery(ibmProvidersQuery);
  const ibmProviders = providersSelectors.selectProviders(state, ProviderType.ibm, ibmProvidersQueryString);
  const ibmProvidersError = providersSelectors.selectProvidersError(state, ProviderType.ibm, ibmProvidersQueryString);
  const ibmProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ibm,
    ibmProvidersQueryString
  );

  const ocpProvidersQueryString = getProvidersQuery(ocpProvidersQuery);
  const ocpProviders = providersSelectors.selectProviders(state, ProviderType.ocp, ocpProvidersQueryString);
  const ocpProvidersError = providersSelectors.selectProvidersError(state, ProviderType.ocp, ocpProvidersQueryString);
  const ocpProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
  );

  // For testing...
  //
  // if (awsProviders && awsProviders.data) {
  //   if (awsProviders.data.length) {
  //     awsProviders.data[0].active = false;
  //   } else {
  //     awsProviders.data[0] = {
  //       name: 'AWS for OpenShift',
  //       active: false,
  //     };
  //   }
  // }
  // if (azureProviders && azureProviders.data) {
  //   if (azureProviders.data.length) {
  //     azureProviders.data[0].active = false;
  //   } else {
  //     azureProviders.data[0] = {
  //       name: 'Azure for OpenShift',
  //       active: false,
  //     };
  //   }
  // }
  // if (ocpProviders && ocpProviders.data) {
  //   if (ocpProviders.data.length) {
  //     ocpProviders.data[0].active = false;
  //   } else {
  //     ocpProviders.data[0] = {
  //       name: 'OCP',
  //       active: false,
  //     };
  //   }
  // }

  return {
    awsProviders,
    awsProvidersError,
    awsProvidersFetchStatus,
    awsProvidersQueryString,
    azureProviders,
    azureProvidersError,
    azureProvidersFetchStatus,
    azureProvidersQueryString,
    gcpProviders,
    gcpProvidersError,
    gcpProvidersFetchStatus,
    gcpProvidersQueryString,
    ibmProviders,
    ibmProvidersError,
    ibmProvidersFetchStatus,
    ibmProvidersQueryString,
    ocpProviders,
    ocpProvidersError,
    ocpProvidersFetchStatus,
    ocpProvidersQueryString,
  };
});

const mapDispatchToProps: InactiveSourcesDispatchProps = {
  fetchProviders: providersActions.fetchProviders,
};

const InactiveSources = injectIntl(connect(mapStateToProps, mapDispatchToProps)(InactiveSourcesBase));

export { InactiveSources, InactiveSourcesProps };
