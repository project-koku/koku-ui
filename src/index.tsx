import { initApi } from 'api/api';
import { getToken } from 'api/session';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { configureStore } from './store';

const appPublicPath: string =
  process.env.APP_PUBLIC_PATH || 'insights/platform/cost-management';

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
    <BrowserRouter basename={appPublicPath}>
      <App />
    </BrowserRouter>
  </Provider>,
  root
);
