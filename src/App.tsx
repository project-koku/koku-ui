import React from 'react';
import { hot } from 'react-hot-loader';
import { AuthProvider } from './components/authProvider';
import { I18nProvider } from './components/i18nProvider';
import { Masthead } from './components/masthead';
import { Page } from './components/page';
import { VerticalNav } from './components/verticalNav';
import { Routes } from './routes';

interface State {
  isLoaded: boolean;
  locale: string;
}

class App extends React.Component<{}, State> {
  public state: State = {
    isLoaded: false,
    locale: 'en',
  };

  public render() {
    return (
      <I18nProvider locale={this.state.locale}>
        <AuthProvider>
          <AuthProvider.Consumer>
            {authContext => (
              <Page
                masthead={<Masthead {...authContext} />}
                verticalNav={<VerticalNav {...authContext} />}
              >
                <Routes />
              </Page>
            )}
          </AuthProvider.Consumer>
        </AuthProvider>
      </I18nProvider>
    );
  }
}

export default hot(module)(App);
