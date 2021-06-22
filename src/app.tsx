import { I18nProvider } from 'components/i18n';
import Maintenance from 'pages/state/maintenance';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { createMapStateToProps } from 'store/common';
import { getLocale } from 'components/i18n/localeEnv';

import { Routes, routes } from './routes';

export interface AppOwnProps extends RouteComponentProps<void> {}

interface AppStateProps {}

interface AppDispatchProps {
  history: any;
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
    const { history, location } = this.props;

    insights.chrome.init();
    insights.chrome.identifyApp('cost-management');

    if (location && location.pathname) {
      insights.chrome.appAction(location.pathname);
    }

    this.appNav = insights.chrome.on('APP_NAVIGATION', event => {
      const currRoute = routes.find(({ path }) => path.includes(event.navId));
      if (event.domEvent && currRoute) {
        history.push(currRoute.path);
      }
    });
  }

  public componentDidUpdate(prevProps: AppProps) {
    const { location } = this.props;

    if (location && location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
      insights.chrome.appAction(location.pathname);
    }
  }

  public componentWillUnmount() {
    this.appNav();
    insights.chrome.appAction(undefined);
  }

  public render() {
    const { maintenanceMode } = this.state;
    const route = maintenanceMode ? <Maintenance /> : <Routes />;
    const local = getLocale();

    return (
      <IntlProvider locale={local}>
        <I18nProvider locale={this.state.locale}>{route}</I18nProvider>
      </IntlProvider>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AppOwnProps, AppStateProps>((state, props) => {
  return {};
});

const mapDispatchToProps: AppDispatchProps = { history };

export default compose(withRouter, connect(mapStateToProps, mapDispatchToProps))(App);
