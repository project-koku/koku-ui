import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/providersQuery';
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

const ProvidersModal = asyncComponent(() =>
  import(/* webpackChunkName: "providersModal" */ './pages/providersModal')
);

export interface AppOwnProps extends RouteComponentProps<void> {}

interface AppStateProps {
  awsProviders: Providers;
  awsProvidersFetchStatus: FetchStatus;
  awsProvidersQueryString: string;
  ocpProviders: Providers;
  ocpProvidersFetchStatus: FetchStatus;
  ocpProvidersQueryString: string;
}

interface AppDispatchProps {
  history: any;
  fetchProviders: typeof providersActions.fetchProviders;
}

interface AppState {
  locale: string;
}

type AppProps = AppOwnProps & AppStateProps & AppDispatchProps;

export class App extends React.Component<AppProps, AppState> {
  public appNav: any;

  public buildNav: any;

  public state: AppState = { locale: 'en' };

  public componentDidMount() {
    const {
      awsProviders,
      awsProvidersFetchStatus,
      awsProvidersQueryString,
      fetchProviders,
      history,
      ocpProviders,
      ocpProvidersFetchStatus,
      ocpProvidersQueryString,
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
      fetchProviders(ProviderType.aws, awsProvidersQueryString);
    }
    if (!ocpProviders && ocpProvidersFetchStatus !== FetchStatus.inProgress) {
      fetchProviders(ProviderType.ocp, ocpProvidersQueryString);
    }
  }

  public componentDidUpdate(prevProps: AppProps) {
    const {
      awsProviders,
      awsProvidersFetchStatus,
      awsProvidersQueryString,
      fetchProviders,
      location,
      ocpProviders,
      ocpProvidersFetchStatus,
      ocpProvidersQueryString,
    } = this.props;

    if (!awsProviders && awsProvidersFetchStatus !== FetchStatus.inProgress) {
      fetchProviders(ProviderType.aws, awsProvidersQueryString);
    }
    if (!ocpProviders && ocpProvidersFetchStatus !== FetchStatus.inProgress) {
      fetchProviders(ProviderType.ocp, ocpProvidersQueryString);
    }
    if (location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  public componentWillUnmount() {
    this.appNav();
    this.buildNav();
  }

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
      title: 'Cloud Cost',
      id: 'aws',
    },
    {
      title: 'OpenShift Charges',
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
