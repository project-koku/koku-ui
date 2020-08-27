import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { AxiosError } from 'axios';
import { I18nProvider } from 'components/i18nProvider';
import Maintenance from 'pages/state/maintenance/maintenance';
import NotAuthorized from 'pages/state/notAuthorized/notAuthorized';
import NotAvailable from 'pages/state/notAvailable/notAvailable';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  awsProvidersQuery,
  azureProvidersQuery,
  ocpProvidersQuery,
  providersActions,
  providersSelectors,
} from 'store/providers';
import { Routes, routes } from './routes';

export interface AppOwnProps extends RouteComponentProps<void> {}

interface AppStateProps {
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

interface AppDispatchProps {
  history: any;
  fetchProviders: typeof providersActions.fetchProviders;
}

interface AppState {
  locale: string;
  maintenanceMode: boolean;
}

type AppProps = AppOwnProps & AppStateProps & AppDispatchProps;

export class App extends React.Component<AppProps, AppState> {
  public appNav: any;

  // Todo: Will Insights provide a flag to enable maintenance mode?
  // https://docs.google.com/document/d/1VLs7vFczWUzyIpH6EUsTEpJugDsjeuh4a_azs6IJbC0/edit#
  public state: AppState = { locale: 'en', maintenanceMode: false };

  public componentDidMount() {
    const {
      awsProviders,
      awsProvidersFetchStatus,
      azureProviders,
      azureProvidersFetchStatus,
      history,
      ocpProviders,
      ocpProvidersFetchStatus,
    } = this.props;

    insights.chrome.init();
    insights.chrome.identifyApp('cost-management');

    this.appNav = insights.chrome.on('APP_NAVIGATION', event => {
      const currRoute = routes.find(({ path }) => path.includes(event.navId));
      if (event.domEvent && currRoute) {
        history.push(currRoute.path);
      }
    });

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

  public componentDidUpdate(prevProps: AppProps) {
    const {
      awsProviders,
      awsProvidersError,
      awsProvidersFetchStatus,
      azureProviders,
      azureProvidersError,
      azureProvidersFetchStatus,
      location,
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
    if (location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  public componentWillUnmount() {
    this.appNav();
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

  public render() {
    const {
      awsProvidersError,
      azureProvidersError,
      ocpProvidersError,
    } = this.props;
    const { maintenanceMode } = this.state;
    let route = <Routes />;

    if (maintenanceMode) {
      route = <Maintenance />;
    } else {
      // The providers API should error while under maintenance
      const error =
        awsProvidersError || azureProvidersError || ocpProvidersError;

      if (error) {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          route = <NotAuthorized />;
        } else {
          route = <NotAvailable />;
        }
      }
    }
    return <I18nProvider locale={this.state.locale}>{route}</I18nProvider>;
  }
}

const mapStateToProps = createMapStateToProps<AppOwnProps, AppStateProps>(
  (state, props) => {
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
  }
);

const mapDispatchToProps: AppDispatchProps = {
  history,
  fetchProviders: providersActions.fetchProviders,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(App);
