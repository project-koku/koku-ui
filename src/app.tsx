import { Providers } from 'api/providers';
import React from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersActions, providersSelectors } from 'store/providers';
import { I18nProvider } from './components/i18nProvider';
import { Routes } from './routes';
import { asyncComponent } from './utils/asyncComponent';

const ProvidersModal = asyncComponent(() =>
  import(/* webpackChunkName: "providersModal" */ './pages/providersModal')
);

export interface Props {
  getProviders: typeof providersActions.getProviders;
  providers: Providers;
  providersFetchStatus: FetchStatus;
  history: any;
}
interface State {
  locale: string;
}

export class App extends React.Component<Props, State> {
  public appNav: any;

  public buildNav: any;

  public state: State = { locale: 'en' };

  public componentDidMount() {
    insights.chrome.init();
    insights.chrome.identifyApp('cost-management');
    insights.chrome.navigation(buildNavigation());

    this.appNav = insights.chrome.on('APP_NAVIGATION', event =>
      this.props.history.push(`/${event.navId}`)
    );
    this.buildNav = this.props.history.listen(() =>
      insights.chrome.navigation(buildNavigation())
    );

    if (this.props.providersFetchStatus === FetchStatus.none) {
      this.props.getProviders();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.providersFetchStatus === FetchStatus.none) {
      this.props.getProviders();
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

export default hot(module)(
  compose(
    withRouter,
    connect(
      createMapStateToProps(state => ({
        providers: providersSelectors.selectProviders(state),
        providersFetchStatus: providersSelectors.selectProvidersFetchStatus(
          state
        ),
      })),
      {
        history,
        getProviders: providersActions.getProviders,
      }
    )
  )(App)
);
