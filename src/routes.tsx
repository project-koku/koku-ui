import React from 'react';
import { Route, RouteProps, Switch } from 'react-router-dom';
import { asyncComponent } from './utils/asyncComponent';

const Dashboard = asyncComponent(() =>
  import(/* webpackChunkName: "home" */ './pages/dashboard')
);

const NotFound = asyncComponent(() =>
  import(/* webpackChunkName: "notFound" */ './pages/notFound')
);

export interface AppRoute extends RouteProps {
  labelKey: string;
}

const routes: AppRoute[] = [
  {
    path: '/',
    labelKey: 'dashboard',
    component: Dashboard,
    exact: true,
  },
  {
    path: '/cost',
    labelKey: 'Cost Details',
    component: () => <div>Cost Details Page</div>,
    exact: true,
  },
  {
    path: '/resources',
    labelKey: 'Resource Details',
    component: () => <div>Resource Details Page</div>,
    exact: true,
  },
  {
    path: '/analyze',
    labelKey: 'Analyze',
    component: () => <div>Analyze Page</div>,
    exact: true,
  },
];

const Routes = () => (
  <Switch>
    {routes.map(route => <Route key={route.path} {...route} />)}
    <Route component={NotFound} />
  </Switch>
);

export { Routes, routes };
