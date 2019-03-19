import { initApi } from 'api/api';
import { getToken } from 'api/session';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { configureStore } from './store';

const pathName = window.location.pathname.split('/');
pathName.shift();

if (pathName[0] === 'beta') {
  pathName.shift();
}

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
    <BrowserRouter basename={`${pathName[0]}/${pathName[1]}`}>
      <App />
    </BrowserRouter>
  </Provider>,
  root
);
