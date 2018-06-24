import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncComponent } from './utils/asyncComponent';

const NotFound = asyncComponent(() =>
  import(/* webpackChunkName: "notFound" */ './pages/notFound')
);

const Dashboard = asyncComponent(() =>
  import(/* webpackChunkName: "home" */ './pages/dashboard')
);

const Routes = () => (
  <Switch>
    <Route exact component={Dashboard} path="/" />
    <Route component={NotFound} />
  </Switch>
);

export { Routes };
