import { initApi } from 'api/api';
import { getToken } from 'api/session';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { configureStore } from './store';

initApi({
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
    <BrowserRouter basename="insights/platform/cost-management">
      <App />
    </BrowserRouter>
  </Provider>,
  root
);
