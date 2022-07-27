import { asyncComponent } from 'components/async';
import { permissionsComponent } from 'components/permissions';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

const NotFound = asyncComponent(() => import(/* webpackChunkName: "notFound" */ 'pages/state/notFound'));
const AwsBreakdown = asyncComponent(() => import(/* webpackChunkName: "aws" */ 'pages/views/details/awsBreakdown'));
const AwsDetails = asyncComponent(() => import(/* webpackChunkName: "aws" */ 'pages/views/details/awsDetails'));
const AzureBreakdown = asyncComponent(
  () => import(/* webpackChunkName: "azure" */ 'pages/views/details/azureBreakdown')
);
const OciBreakdown = asyncComponent(() => import(/* webpackChunkName: "oci" */ 'pages/views/details/ociBreakdown'));
const AzureDetails = asyncComponent(() => import(/* webpackChunkName: "azure" */ 'pages/views/details/azureDetails'));
const OciDetails = asyncComponent(() => import(/* webpackChunkName: "oci" */ 'pages/views/details/ociDetails'));
const Explorer = asyncComponent(() => import(/* webpackChunkName: "explorer" */ 'pages/views/explorer'));
const GcpBreakdown = asyncComponent(() => import(/* webpackChunkName: "gcp" */ 'pages/views/details/gcpBreakdown'));
const GcpDetails = asyncComponent(() => import(/* webpackChunkName: "gcp" */ 'pages/views/details/gcpDetails'));
const IbmBreakdown = asyncComponent(() => import(/* webpackChunkName: "ibm" */ 'pages/views/details/ibmBreakdown'));
const IbmDetails = asyncComponent(() => import(/* webpackChunkName: "ibm" */ 'pages/views/details/ibmDetails'));
const OcpDetails = asyncComponent(() => import(/* webpackChunkName: "ocp" */ 'pages/views/details/ocpDetails'));
const OcpBreakdown = asyncComponent(() => import(/* webpackChunkName: "ocp" */ 'pages/views/details/ocpBreakdown'));
const Overview = asyncComponent(() => import(/* webpackChunkName: "overview" */ 'pages/views/overview'));
const CostModelsDetails = asyncComponent(
  () => import(/* webpackChunkName: "costModels" */ 'pages/costModels/costModelsDetails')
);
// import(/* webpackChunkName: "costModels" */ './pages/costModels/costModelList')
const CostModel = asyncComponent(() => import(/* webpackChunkName: "costModel" */ 'pages/costModels/costModel'));

// For syncing with permissions
const paths = {
  awsDetails: '/aws',
  awsDetailsBreakdown: '/aws/breakdown',
  azureDetails: '/azure',
  azureDetailsBreakdown: '/azure/breakdown',
  costModels: '/cost-models',
  explorer: '/explorer',
  gcpDetails: '/gcp',
  gcpDetailsBreakdown: '/gcp/breakdown',
  ibmDetails: '/ibm',
  ibmDetailsBreakdown: '/ibm/breakdown',
  ociDetails: '/oci',
  ociDetailsBreakdown: '/oci/breakdown',
  ocpDetails: '/ocp',
  ocpDetailsBreakdown: '/ocp/breakdown',
  overview: '/',
};

const routes = [
  {
    path: paths.overview,
    labelKey: 'cost_management_overview',
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
    path: paths.ociDetails,
    labelKey: 'navigation.oci_details',
    component: permissionsComponent(OciDetails),
    exact: true,
  },
  {
    path: paths.ociDetailsBreakdown,
    labelKey: 'navigation.oci_details_breakdown',
    component: permissionsComponent(OciBreakdown),
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
    path: paths.ibmDetails,
    labelKey: 'navigation.ibm_details',
    component: permissionsComponent(IbmDetails),
    exact: true,
  },
  {
    path: paths.ibmDetailsBreakdown,
    labelKey: 'navigation.ibm_details_breakdown',
    component: permissionsComponent(IbmBreakdown),
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
