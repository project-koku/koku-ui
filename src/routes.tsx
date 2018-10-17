import { MoneyBillIcon, TachometerAltIcon } from '@patternfly/react-icons';
import React from 'react';
import { Route, RouteProps, Switch } from 'react-router-dom';
import { asyncComponent } from './utils/asyncComponent';

const Dashboard = asyncComponent(() =>
  import(/* webpackChunkName: "home" */ './pages/dashboard')
);

const NotFound = asyncComponent(() =>
  import(/* webpackChunkName: "notFound" */ './pages/notFound')
);

const CloudCost = asyncComponent(() =>
  import(/* webpackChunkName: "cost" */ './pages/cloudCost')
);

const OcpCharges = asyncComponent(() =>
  import(/* webpackChunkName: "cost" */ './pages/ocpCharges')
);

export interface AppRoute extends RouteProps {
  labelKey: string;
  icon: any;
}

const routes: AppRoute[] = [
  {
    path: '/',
    labelKey: 'navigation.overview',
    component: Dashboard,
    exact: true,
    icon: TachometerAltIcon,
  },
  {
    path: '/cloud',
    labelKey: 'navigation.cloud_cost',
    component: CloudCost,
    exact: true,
    icon: MoneyBillIcon,
  },
  {
    path: '/ocp',
    labelKey: 'navigation.ocp_charges',
    component: OcpCharges,
    exact: true,
    icon: MoneyBillIcon,
  },
];

const Routes = () => (
  <Switch>
    {routes.map(route => <Route key={route.path} {...route} />)}
    <Route component={NotFound} />
  </Switch>
);

export { Routes, routes };
