import { asyncComponent } from 'components/async/asyncComponent/asyncComponent';
import { permissionsComponent } from 'components/async/permissionsComponent/permissionsComponent';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

const NotFound = asyncComponent(() => import(/* webpackChunkName: "notFound" */ 'pages/state/notFound'));
const AwsBreakdown = asyncComponent(() => import(/* webpackChunkName: "aws" */ 'pages/view/details/awsBreakdown'));
const AwsDetails = asyncComponent(() => import(/* webpackChunkName: "aws" */ 'pages/view/details/awsDetails'));
const AzureBreakdown = asyncComponent(
  () => import(/* webpackChunkName: "azure" */ 'pages/view/details/azureBreakdown')
);
const AzureDetails = asyncComponent(() => import(/* webpackChunkName: "azure" */ 'pages/view/details/azureDetails'));
const Explorer = asyncComponent(() => import(/* webpackChunkName: "azure" */ 'pages/view/explorer/explorer'));
const GcpBreakdown = asyncComponent(() => import(/* webpackChunkName: "gcp" */ 'pages/view/details/gcpBreakdown'));
const GcpDetails = asyncComponent(() => import(/* webpackChunkName: "gcp" */ 'pages/view/details/gcpDetails'));
const OcpDetails = asyncComponent(() => import(/* webpackChunkName: "ocp" */ 'pages/view/details/ocpDetails'));
const OcpBreakdown = asyncComponent(() => import(/* webpackChunkName: "ocp" */ 'pages/view/details/ocpBreakdown'));
const Overview = asyncComponent(() => import(/* webpackChunkName: "overview" */ 'pages/view/overview'));
const CostModelsDetails = asyncComponent(
  () => import(/* webpackChunkName: "costModels" */ 'pages/costModels/costModelsDetails')
);
// import(/* webpackChunkName: "costModels" */ './pages/costModels/costModelList')
const CostModel = asyncComponent(() => import(/* webpackChunkName: "costModel" */ 'pages/costModels/costModel'));

// For syncing with permissions
const paths = {
  awsDetails: '/infrastructure/aws',
  awsDetailsBreakdown: '/infrastructure/aws/breakdown',
  azureDetails: '/infrastructure/azure',
  azureDetailsBreakdown: '/infrastructure/azure/breakdown',
  costModels: '/cost-models',
  explorer: '/explorer',
  gcpDetails: '/infrastructure/gcp',
  gcpDetailsBreakdown: '/infrastructure/gcp/breakdown',
  ocpDetails: '/ocp',
  ocpDetailsBreakdown: '/ocp/breakdown',
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
    path: paths.explorer,
    labelKey: 'navigation.explorer',
    component: permissionsComponent(Explorer),
    exact: true,
  },
  {
    path: paths.gcpDetails,
    labelKey: 'navigation.gcp_details',
    component: permissionsComponent(GcpDetails),
    exact: true,
  },
  {
    path: paths.gcpDetailsBreakdown,
    labelKey: 'navigation.gcp_details_breakdown',
    component: permissionsComponent(GcpBreakdown),
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
