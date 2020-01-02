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

const AzureDetails = asyncComponent(() =>
  import(/* webpackChunkName: "azure" */ './pages/azureDetails')
);

const OcpDetails = asyncComponent(() =>
  import(/* webpackChunkName: "ocp" */ './pages/ocpDetails')
);

const OcpCloudDetails = asyncComponent(() =>
  import(/* webpackChunkName: "ocp-cloud" */ './pages/ocpCloudDetails')
);

const Overview = asyncComponent(() =>
  import(/* webpackChunkName: "home" */ './pages/overview')
);

const SourceSettings = asyncComponent(() =>
  import(/* webpackChunkName: "cost-settings" */ './pages/sourceSettings')
);

const CostModelsDetails = asyncComponent(() =>
  import(/* webpackChunkName: "cost-models" */ './pages/costModelsDetails')
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
    path: '/azure',
    labelKey: 'navigation.azure_details',
    component: AzureDetails,
    exact: true,
    icon: MoneyBillIcon,
  },
  {
    path: '/ocp',
    labelKey: 'navigation.ocp_cloud_details',
    component: OcpDetails,
    exact: true,
    icon: MoneyBillIcon,
  },
  {
    path: '/ocp-on-aws', // Todo: rename ocp-on-aws to ocp-cloud
    labelKey: 'navigation.ocp_details',
    component: OcpCloudDetails,
    exact: true,
    icon: MoneyBillIcon,
  },
  {
    path: '/cost-models',
    labelKey: 'navigation.cost_models_details',
    component: CostModelsDetails,
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
