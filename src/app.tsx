import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/providersQuery';
import { AxiosError } from 'axios';
import { I18nProvider } from 'components/i18nProvider';
import React from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  awsProvidersQuery,
  ocpProvidersQuery,
  providersActions,
  providersSelectors,
} from 'store/providers';
import { asyncComponent } from 'utils/asyncComponent';
import { Routes } from './routes';
import * as onboardingSelectors from './store/onboarding/selectors';

const ProvidersModal = asyncComponent(() =>
  import(/* webpackChunkName: "providersModal" */ './pages/onboardingModal')
);

export interface AppOwnProps extends RouteComponentProps<void> {}

interface AppStateProps {
  awsProviders: Providers;
  awsProvidersFetchStatus: FetchStatus;
  awsProvidersQueryString: string;
  ocpProviders: Providers;
  ocpProvidersFetchStatus: FetchStatus;
  ocpProvidersQueryString: string;
  onboardingErrors: AxiosError;
  onboardingStatus: FetchStatus;
}

interface AppDispatchProps {
  history: any;
  fetchProviders: typeof providersActions.fetchProviders;
}

interface AppState {
  locale: string;
}

type AppProps = AppOwnProps & AppStateProps & AppDispatchProps;

// This is a test
export class App extends React.Component<AppProps, AppState> {
  public appNav: any;

  public buildNav: any;

  public state: AppState = { locale: 'en' };

  public componentDidMount() {
    const {
      awsProviders,
      awsProvidersFetchStatus,
      history,
      ocpProviders,
      ocpProvidersFetchStatus,
    } = this.props;

    insights.chrome.init();
    insights.chrome.identifyApp('cost-management');
    insights.chrome.navigation(buildNavigation());

    this.appNav = insights.chrome.on('APP_NAVIGATION', event =>
      history.push(`/${event.navId}`)
    );
    this.buildNav = history.listen(() =>
      insights.chrome.navigation(buildNavigation())
    );

    if (!awsProviders && awsProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchAwsProviders();
    }
    if (!ocpProviders && ocpProvidersFetchStatus !== FetchStatus.inProgress) {
      this.fetchOcpProviders();
    }
  }

  public componentDidUpdate(prevProps: AppProps) {
    const {
      awsProviders,
      awsProvidersFetchStatus,
      location,
      ocpProviders,
      ocpProvidersFetchStatus,
      onboardingErrors,
      onboardingStatus,
    } = this.props;

    if (
      (!awsProviders ||
        (onboardingStatus === FetchStatus.complete && !onboardingErrors)) &&
      awsProvidersFetchStatus !== FetchStatus.inProgress
    ) {
      this.fetchAwsProviders();
    }
    if (
      (!ocpProviders ||
        (onboardingStatus === FetchStatus.complete && !onboardingErrors)) &&
      ocpProvidersFetchStatus !== FetchStatus.inProgress
    ) {
      this.fetchOcpProviders();
    }
    if (location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  public componentWillUnmount() {
    this.appNav();
    this.buildNav();
  }

  private fetchAwsProviders = () => {
    const { awsProvidersQueryString, fetchProviders } = this.props;
    fetchProviders(ProviderType.aws, awsProvidersQueryString);
  };

  private fetchOcpProviders = () => {
    const { fetchProviders, ocpProvidersQueryString } = this.props;
    fetchProviders(ProviderType.ocp, ocpProvidersQueryString);
  };

  public render() {
    return (
      <I18nProvider locale={this.state.locale}>
        <Routes />
        <ProvidersModal />
      </I18nProvider>
    );
  }
}

function buildNavigation() {
  const currentPath = window.location.pathname.split('/').slice(-1)[0];
  return [
    {
      title: 'Overview',
      id: '',
    },
    {
      title: 'Aws Details',
      id: 'aws',
    },
    {
      title: 'OpenShift Details',
      id: 'ocp',
    },
  ].map(item => ({
    ...item,
    active: item.id === currentPath,
  }));
}

const mapStateToProps = createMapStateToProps<AppOwnProps, AppStateProps>(
  (state, props) => {
    const awsProvidersQueryString = getProvidersQuery(awsProvidersQuery);
    const awsProviders = providersSelectors.selectProviders(
      state,
      ProviderType.aws,
      awsProvidersQueryString
    );
    const awsProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
      state,
      ProviderType.aws,
      awsProvidersQueryString
    );

    const ocpProvidersQueryString = getProvidersQuery(ocpProvidersQuery);
    const ocpProviders = providersSelectors.selectProviders(
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
      awsProvidersFetchStatus,
      awsProvidersQueryString,
      ocpProviders,
      ocpProvidersFetchStatus,
      ocpProvidersQueryString,
      onboardingErrors: onboardingSelectors.selectApiErrors(state),
      onboardingStatus: onboardingSelectors.selectApiStatus(state),
    };
  }
);

const mapDispatchToProps: AppDispatchProps = {
  history,
  fetchProviders: providersActions.fetchProviders,
};

export default hot(module)(
  compose(
    withRouter,
    connect(
      mapStateToProps,
      mapDispatchToProps
    )
  )(App)
);
