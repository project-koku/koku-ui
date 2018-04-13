import React from 'react';
import { hot } from 'react-hot-loader';
import { I18nextProvider } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import { initI18next } from './i18next';
import { styled } from './styles/styled';
import asyncComponent from './utils/asyncComponent';

const NotFound = asyncComponent(() =>
  import(/* webpackChunkName: "notFound" */ './components/notFound')
);

const Home = asyncComponent(() =>
  import(/* webpackChunkName: "home" */ './components/home')
);

interface Props {
  language: string;
}

interface State {
  isLoaded: boolean;
}

const Header = styled('header');
const Content = styled('main');
const Navigation = styled('aside');

class App extends React.Component<Props, State> {
  public state = {
    isLoaded: false
  };

  private i18n = initI18next(this.props.language);

  public render() {
    return (
      <I18nextProvider i18n={this.i18n}>
        <>
          <Header>Header</Header>
          <Navigation>Side Navigation</Navigation>
          <Content>
            <Switch>
              <Route exact component={Home} path="/" />
              <Route component={NotFound} />
            </Switch>
          </Content>
        </>
      </I18nextProvider>
    );
  }
}

export default hot(module)(App);
