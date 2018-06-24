import { User } from 'api/users';
import React from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { sessionActions, sessionSelectors } from 'store/session';
import { usersActions, usersSelectors } from 'store/users';
import { I18nProvider } from './components/i18nProvider';
import { Masthead } from './components/masthead';
import { Page } from './components/page';
import { VerticalNav } from './components/verticalNav';
import { Routes } from './routes';
import { asyncComponent } from './utils/asyncComponent';

const LoginPage = asyncComponent(() =>
  import(/* webpackChunkName: "login" */ './pages/login')
);

export interface Props {
  isLoggedIn: boolean;
  logout: typeof sessionActions.logout;
  getCurrentUser: typeof usersActions.getCurrentUser;
  currentUser: User;
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
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.props.getCurrentUser();
    }
  }

  public render() {
    const { isLoggedIn } = this.props;
    return (
      <I18nProvider locale={this.state.locale}>
        {!isLoggedIn ? (
          <LoginPage />
        ) : (
          <Page
            masthead={
              <Masthead
                user={this.props.currentUser}
                onLogout={this.props.logout}
              />
            }
            verticalNav={<VerticalNav />}
          >
            <Routes />
          </Page>
        )}
      </I18nProvider>
    );
  }
}

export default hot(module)(
  connect(
    createMapStateToProps(state => ({
      isLoggedIn: sessionSelectors.selectIsLoggedIn(state),
      currentUser: usersSelectors.selectCurrentUser(state),
    })),
    {
      logout: sessionActions.logout,
      getCurrentUser: usersActions.getCurrentUser,
    }
  )(App)
);
