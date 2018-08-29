import { Providers } from 'api/providers';
import { User } from 'api/users';
import React from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersActions, providersSelectors } from 'store/providers';
import { sessionActions, sessionSelectors } from 'store/session';
import { usersActions, usersSelectors } from 'store/users';
import { I18nProvider } from './components/i18nProvider';
import { Masthead } from './components/masthead';
import { Page } from './components/page';
import { Sidebar } from './components/sidebar';
import { Routes } from './routes';
import { asyncComponent } from './utils/asyncComponent';

const LoginPage = asyncComponent(() =>
  import(/* webpackChunkName: "login" */ './pages/login')
);

const ProvidersModal = asyncComponent(() =>
  import(/* webpackChunkName: "login" */ './pages/providersModal')
);

export interface Props {
  currentUser: User;
  getCurrentUser: typeof usersActions.getCurrentUser;
  getProviders: typeof providersActions.getProviders;
  isLoggedIn: boolean;
  logout: typeof sessionActions.logout;
  providers: Providers;
  providersFetchStatus: FetchStatus;
}
interface State {
  isLoaded: boolean;
  locale: string;
}

export class App extends React.Component<Props, State> {
  public state: State = {
    isLoaded: false,
    locale: 'en',
  };

  public componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.getCurrentUser();
      this.props.getProviders();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.props.getCurrentUser();
    }

    // Todo: Start onboarding when user has no providers?
  }

  public render() {
    const { isLoggedIn } = this.props;
    return (
      <I18nProvider locale={this.state.locale}>
        {!isLoggedIn ? (
          <LoginPage />
        ) : (
          <Page masthead={<Masthead />} sidebar={<Sidebar />}>
            <Routes />
            <ProvidersModal />
          </Page>
        )}
      </I18nProvider>
    );
  }
}

export default hot(module)(
  compose(
    withRouter,
    connect(
      createMapStateToProps(state => ({
        isLoggedIn: sessionSelectors.selectIsLoggedIn(state),
        currentUser: usersSelectors.selectCurrentUser(state),
        providers: providersSelectors.selectProviders(state),
        providersFetchStatus: providersSelectors.selectProvidersFetchStatus(
          state
        ),
      })),
      {
        logout: sessionActions.logout,
        getCurrentUser: usersActions.getCurrentUser,
        getProviders: providersActions.getProviders,
      }
    )
  )(App)
);
