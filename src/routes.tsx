import { MoneyBillIcon, TachometerAltIcon } from '@patternfly/react-icons';
import React from 'react';
import { Route, RouteProps, Switch } from 'react-router-dom';
import { asyncComponent } from './utils/asyncComponent';

const NotFound = asyncComponent(() =>
  import(/* webpackChunkName: "notFound" */ './pages/notFound')
);

const AwsDetails = asyncComponent(() =>
  import(/* webpackChunkName: "aws" */ './pages/awsDetails')
);

const OcpDetails = asyncComponent(() =>
  import(/* webpackChunkName: "ocp" */ './pages/ocpDetails')
);

const Overview = asyncComponent(() =>
  import(/* webpackChunkName: "home" */ './pages/overview')
);

export interface AppRoute extends RouteProps {
  labelKey: string;
  icon: any;
}

const routes: AppRoute[] = [
  {
    path: '/',
    labelKey: 'navigation.overview',
    component: Overview,
    exact: true,
    icon: TachometerAltIcon,
  },
  {
    path: '/aws',
    labelKey: 'navigation.cloud_cost',
    component: AwsDetails,
    exact: true,
    icon: MoneyBillIcon,
  },
  {
    path: '/ocp',
    labelKey: 'navigation.ocp_charges',
    component: OcpDetails,
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
