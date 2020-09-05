import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { AxiosError } from 'axios';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  awsProvidersQuery,
  azureProvidersQuery,
  ocpProvidersQuery,
  providersActions,
  providersSelectors,
} from 'store/providers';
import {
  deleteSessionCookie,
  getCookieValue,
  setSessionCookie,
} from 'utils/cookie';
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
  InjectedTranslateProps;

const inactiveSourcesID = 'cost_inactiveSources';
const tokenID = 'cs_jwt';

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
      ocpProviders,
      ocpProvidersFetchStatus,
    } = this.props;

    if (!awsProviders && awsProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchAwsProviders();
    }
    if (
      !azureProviders &&
      azureProvidersFetchStatus !== FetchStatus.inProgress
    ) {
      this.fetchAzureProviders();
    }
    if (!ocpProviders && ocpProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchOcpProviders();
    }
  }

  public componentDidUpdate(prevProps: InactiveSourcesProps) {
    const {
      awsProviders,
      awsProvidersError,
      awsProvidersFetchStatus,
      azureProviders,
      azureProvidersError,
      azureProvidersFetchStatus,
      ocpProviders,
      ocpProvidersError,
      ocpProvidersFetchStatus,
    } = this.props;

    if (
      !awsProviders &&
      awsProvidersFetchStatus !== FetchStatus.inProgress &&
      !awsProvidersError
    ) {
      this.fetchAwsProviders();
    }
    if (
      !azureProviders &&
      azureProvidersFetchStatus !== FetchStatus.inProgress &&
      !azureProvidersError
    ) {
      this.fetchAzureProviders();
    }
    if (
      !ocpProviders &&
      ocpProvidersFetchStatus !== FetchStatus.inProgress &&
      !ocpProvidersError
    ) {
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

  private fetchOcpProviders = () => {
    const { fetchProviders, ocpProvidersQueryString } = this.props;
    fetchProviders(ProviderType.ocp, ocpProvidersQueryString);
  };

  private getInactiveSourceNames = () => {
    const { awsProviders, azureProviders, ocpProviders } = this.props;

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
    setSessionCookie(inactiveSourcesID, getCookieValue(tokenID));
    this.forceUpdate();
  };

  private isAlertClosed = () => {
    // Keep closed if token matches current session
    return getCookieValue(tokenID) === getCookieValue(inactiveSourcesID);
  };

  private resetAlert = () => {
    // Delete only if cookie exists
    if (getCookieValue(inactiveSourcesID)) {
      deleteSessionCookie(inactiveSourcesID);
    }
  };

  public render() {
    const { t } = this.props;

    const release = getReleasePath();
    const names = this.getInactiveSourceNames();
    const title =
      names.length === 1
        ? t('inactive_sources.title', { value: names[0] })
        : t('inactive_sources.title_multiple');

    if (names.length === 0) {
      this.resetAlert(); // Reset cookie for new alerts
      return null;
    }
    if (this.isAlertClosed()) {
      return null; // Don't display alert
    }
    this.resetAlert(); // Clean up previous cookie, if any

    return (
      <Alert
        isInline
        variant="danger"
        title={title}
        actionClose={<AlertActionCloseButton onClose={this.handleOnClose} />}
        actionLinks={
          <React.Fragment>
            <a href={`${release}/settings/sources`}>
              {t('inactive_sources.go_to_sources')}
            </a>
          </React.Fragment>
        }
      >
        {this.getInactiveSources(names)}
      </Alert>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  InactiveSourcesOwnProps,
  InactiveSourcesStateProps
>((state, props) => {
  const awsProvidersQueryString = getProvidersQuery(awsProvidersQuery);
  const awsProviders = providersSelectors.selectProviders(
    state,
    ProviderType.aws,
    awsProvidersQueryString
  );
  const awsProvidersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.aws,
    awsProvidersQueryString
  );
  const awsProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.aws,
    awsProvidersQueryString
  );

  const azureProvidersQueryString = getProvidersQuery(azureProvidersQuery);
  const azureProviders = providersSelectors.selectProviders(
    state,
    ProviderType.azure,
    azureProvidersQueryString
  );
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

  const ocpProvidersQueryString = getProvidersQuery(ocpProvidersQuery);
  const ocpProviders = providersSelectors.selectProviders(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
  );
  const ocpProvidersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
  );
  const ocpProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ocp,
    ocpProvidersQueryString
  );

  return {
    awsProviders,
    awsProvidersError,
    awsProvidersFetchStatus,
    awsProvidersQueryString,
    azureProviders,
    azureProvidersError,
    azureProvidersFetchStatus,
    azureProvidersQueryString,
    ocpProviders,
    ocpProvidersError,
    ocpProvidersFetchStatus,
    ocpProvidersQueryString,
  };
});

const mapDispatchToProps: InactiveSourcesDispatchProps = {
  fetchProviders: providersActions.fetchProviders,
};

const InactiveSources = translate()(
  connect(mapStateToProps, mapDispatchToProps)(InactiveSourcesBase)
);

export { InactiveSources, InactiveSourcesProps };
