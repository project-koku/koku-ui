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

// For syncing with permissions
const paths = {
  awsDetails: '/details/aws',
  awsDetailsBreakdown: '/details/aws/breakdown',
  azureDetails: '/details/azure',
  azureDetailsBreakdown: '/details/azure/breakdown',
  costModels: '/cost-models',
  ocpDetails: '/details/ocp',
  ocpDetailsBreakdown: '/details/ocp/breakdown',
  overview: '/',
};

const routes = [
  {
    path: paths.overview,
    labelKey: 'navigation.overview',
    component: permissionsComponent(Overview),
    exact: true,
  },
  {
    path: paths.costModels,
    labelKey: 'navigation.cost_models',
    component: permissionsComponent(CostModelsDetails),
    exact: true,
  },
  {
    path: `${paths.costModels}/:uuid`,
    labelKey: 'navigation.cost_models',
    component: permissionsComponent(CostModel),
    exact: true,
  },
  {
    path: paths.awsDetails,
    labelKey: 'navigation.aws_details',
    component: permissionsComponent(AwsDetails),
    exact: true,
  },
  {
    path: paths.awsDetailsBreakdown,
    labelKey: 'navigation.aws_details_breakdown',
    component: permissionsComponent(AwsBreakdown),
    exact: true,
  },
  {
    path: paths.azureDetails,
    labelKey: 'navigation.azure_details',
    component: permissionsComponent(AzureDetails),
    exact: true,
  },
  {
    path: paths.azureDetailsBreakdown,
    labelKey: 'navigation.azure_details_breakdown',
    component: permissionsComponent(AzureBreakdown),
    exact: true,
  },
  {
    path: paths.ocpDetails,
    labelKey: 'navigation.ocp_details',
    component: permissionsComponent(OcpDetails),
    exact: true,
  },
  {
    path: paths.ocpDetailsBreakdown,
    labelKey: 'navigation.ocp_details_breakdown',
    component: permissionsComponent(OcpBreakdown),
    exact: true,
  },
];

const Routes = () => (
  <Switch>
    {routes.map(route => (
      <Route key={route.path as any} {...route} />
    ))}
    <Route component={NotFound} />
  </Switch>
);

export { paths, Routes, routes };
