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

const OcpOnAwsDetails = asyncComponent(() =>
  import(/* webpackChunkName: "ocp-on-aws" */ './pages/ocpOnAwsDetails')
);

const Overview = asyncComponent(() =>
  import(/* webpackChunkName: "home" */ './pages/overview')
);

const SourceSettings = asyncComponent(() =>
  import(/* webpackChunkName: "ocp" */ './pages/sourceSettings')
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
    labelKey: 'navigation.aws_details',
    component: AwsDetails,
    exact: true,
    icon: MoneyBillIcon,
  },
  {
    path: '/ocp',
    labelKey: 'navigation.ocp_on_aws_details',
    component: OcpDetails,
    exact: true,
    icon: MoneyBillIcon,
  },
  {
    path: '/ocp-on-aws',
    labelKey: 'navigation.ocp_details',
    component: OcpOnAwsDetails,
    exact: true,
    icon: MoneyBillIcon,
  },
  {
    path: '/sources',
    labelKey: 'navigation.source_settings',
    component: SourceSettings,
    exact: true,
    icon: MoneyBillIcon,
  },
];

const Routes = () => (
  <Switch>
    {routes.map(route => (
      <Route key={route.path} {...route} />
    ))}
    <Route component={NotFound} />
  </Switch>
);

export { Routes, routes };
