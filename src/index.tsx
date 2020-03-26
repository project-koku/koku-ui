import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { initApi } from 'api/api';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { configureStore } from './store';

const pathName = window.location.pathname.split('/');
pathName.shift();

let release = '';
if (pathName[0] === 'beta') {
  pathName.shift();
  release = `/beta`;
}

initApi({
  version: 'v1',
});

const root = document.getElementById('root');
const store = configureStore({
  // session: {
  //   token: getToken(),
  // },
});

const basename = `${release}/${pathName[0]}${
  pathName[1] === 'cost-management' ? `/${pathName[1]}` : ''
}`;

render(
  <Provider store={store as any}>
    <NotificationsPortal />
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </Provider>,
  root
);
