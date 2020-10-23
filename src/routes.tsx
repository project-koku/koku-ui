import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { asyncComponent } from './utils/asyncComponent';
import { permissionsComponent } from './utils/permissionsComponent';

const NotFound = asyncComponent(() => import(/* webpackChunkName: "notFound" */ './pages/state/notFound'));
const AwsBreakdown = asyncComponent(() => import(/* webpackChunkName: "aws" */ './pages/details/awsBreakdown'));
const AwsDetails = asyncComponent(() => import(/* webpackChunkName: "aws" */ './pages/details/awsDetails'));
const AzureBreakdown = asyncComponent(() => import(/* webpackChunkName: "azure" */ './pages/details/azureBreakdown'));
const AzureDetails = asyncComponent(() => import(/* webpackChunkName: "azure" */ './pages/details/azureDetails'));
const OcpDetails = asyncComponent(() => import(/* webpackChunkName: "ocp" */ './pages/details/ocpDetails'));
const OcpBreakdown = asyncComponent(() => import(/* webpackChunkName: "ocp" */ './pages/details/ocpBreakdown'));
const Overview = asyncComponent(() => import(/* webpackChunkName: "overview" */ './pages/overview'));
const CostModelsDetails = asyncComponent(() =>
  import(/* webpackChunkName: "costModels" */ './pages/costModels/costModelsDetails')
);
const CostModel = asyncComponent(() => import(/* webpackChunkName: "costModel" */ './pages/costModels/costModel'));

const getRouteProps = ({ path, labelKey, component }) => {
  return {
    path,
    labelKey,
    component: permissionsComponent(component, path), // Returns NoAuthorized if user doesn't have entitlements and permissions to view page
    exact: true,
  };
};

const routes = [
  getRouteProps({
    path: '/',
    labelKey: 'navigation.overview',
    component: Overview,
  }),
  getRouteProps({
    path: '/cost-models',
    labelKey: 'navigation.cost_models',
    component: CostModelsDetails,
  }),
  getRouteProps({
    path: '/cost-models/:uuid',
    labelKey: 'navigation.cost_models',
    component: CostModel,
  }),
  getRouteProps({
    path: '/details/aws',
    labelKey: 'navigation.aws_details',
    component: AwsDetails,
  }),
  getRouteProps({
    path: '/details/aws/breakdown',
    labelKey: 'navigation.aws_details_cost',
    component: AwsBreakdown,
  }),
  getRouteProps({
    path: '/details/azure',
    labelKey: 'navigation.azure_details',
    component: AzureDetails,
  }),
  getRouteProps({
    path: '/details/azure/breakdown',
    labelKey: 'navigation.azure_details_cost',
    component: AzureBreakdown,
  }),
  getRouteProps({
    path: '/details/ocp',
    labelKey: 'navigation.ocp_details',
    component: OcpDetails,
  }),
  getRouteProps({
    path: '/details/ocp/breakdown',
    labelKey: 'navigation.ocp_details_cost',
    component: OcpBreakdown,
  }),
];

const Routes = () => (
  <Switch>
    {routes.map(route => (
      <Route key={route.path as any} {...route} />
    ))}
    <Route component={NotFound} />
  </Switch>
);

export { Routes, routes };
