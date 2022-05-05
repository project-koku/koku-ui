import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { IntlProvider } from '@redhat-cloud-services/frontend-components-translations';
import { createStore } from 'redux';
import { App, AppOwnProps } from './app';
import { FetchStatus } from './store/common';
import { RootState } from '../src/store';
import { rootReducer } from '../src/store/rootReducer';
import messages from '../locales/data.json';
import { injectIntl, IntlCache, IntlConfig } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { PageTitle } from '../src/components/pageTitle/pageTitle'

//TODO: enzyme - these tests don't really do anything, perhaps make them useful or remove?

const props: AppOwnProps = {
  fetchProviders: jest.fn(),
  awsProviders: null,
  awsProvidersFetchStatus: FetchStatus.none,
  awsProvidersQueryString: '',
  history: {
    push: jest.fn(),
    listen: jest.fn(),
  },
  location: null,
  ocpProviders: null,
  ocpProvidersFetchStatus: FetchStatus.none,
  ocpProvidersQueryString: '',
} as any;

jest.mock('components/pageTitle/pageTitle', () => {
  return jest.fn(() => PageTitle)
});

xtest('renders login if isLoggedIn is false', () => {
  const state: Partial<RootState> = {};
  const store = createStore(rootReducer, state);
  const history = createMemoryHistory();
  const cache = {} as IntlCache;
  const prevConfig = {} as IntlConfig;

  const view = render(
    <IntlProvider locale={'en'} messages={messages['en']} cache={cache} prevConfig={prevConfig}>
      <Provider store={store}>
        <Router history={history}>
          <App {...props} />
        </Router>
      </Provider>
    </IntlProvider>);
  expect(view.container).toMatchSnapshot();
});