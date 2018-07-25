import { initApi } from 'api/api';
import { getToken } from 'api/session';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { configureStore } from './store';

initApi({
  host:
    process.env.NODE_ENV === 'production'
      ? 'http://koku-' +
        process.env.APP_NAMESPACE +
        '.1b13.insights.openshiftapps.com/'
      : 'http://localhost:8000',
  version: 'v1',
});

const root = document.getElementById('root');
const store = configureStore({
  session: {
    token: getToken(),
  },
});

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  root
);
