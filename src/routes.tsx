import { asyncComponent } from 'components/async';
import { userAccess } from 'components/userAccess';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

const NotFound = asyncComponent(() => import(/* webpackChunkName: "notFound" */ 'routes/state/notFound'));
const AwsBreakdown = asyncComponent(() => import(/* webpackChunkName: "aws" */ 'routes/views/details/awsBreakdown'));
const AwsDetails = asyncComponent(() => import(/* webpackChunkName: "aws" */ 'routes/views/details/awsDetails'));
const AzureBreakdown = asyncComponent(
  () => import(/* webpackChunkName: "azure" */ 'routes/views/details/azureBreakdown')
);
const OciBreakdown = asyncComponent(() => import(/* webpackChunkName: "oci" */ 'routes/views/details/ociBreakdown'));
const AzureDetails = asyncComponent(() => import(/* webpackChunkName: "azure" */ 'routes/views/details/azureDetails'));
const OciDetails = asyncComponent(() => import(/* webpackChunkName: "oci" */ 'routes/views/details/ociDetails'));
const Explorer = asyncComponent(() => import(/* webpackChunkName: "explorer" */ 'routes/views/explorer'));
const GcpBreakdown = asyncComponent(() => import(/* webpackChunkName: "gcp" */ 'routes/views/details/gcpBreakdown'));
const GcpDetails = asyncComponent(() => import(/* webpackChunkName: "gcp" */ 'routes/views/details/gcpDetails'));
const IbmBreakdown = asyncComponent(() => import(/* webpackChunkName: "ibm" */ 'routes/views/details/ibmBreakdown'));
const IbmDetails = asyncComponent(() => import(/* webpackChunkName: "ibm" */ 'routes/views/details/ibmDetails'));
const OcpDetails = asyncComponent(() => import(/* webpackChunkName: "ocp" */ 'routes/views/details/ocpDetails'));
const OcpBreakdown = asyncComponent(() => import(/* webpackChunkName: "ocp" */ 'routes/views/details/ocpBreakdown'));
const Overview = asyncComponent(() => import(/* webpackChunkName: "overview" */ 'routes/views/overview'));
const CostModelsDetails = asyncComponent(
  () => import(/* webpackChunkName: "costModels" */ 'routes/costModels/costModelsDetails')
);
// import(/* webpackChunkName: "costModels" */ './routes/costModels/costModelList')
const CostModel = asyncComponent(() => import(/* webpackChunkName: "costModel" */ 'routes/costModels/costModel'));

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
    component: userAccess(Overview),
    exact: true,
  },
  {
    path: paths.costModels,
    labelKey: 'navigation.cost_models',
    component: userAccess(CostModelsDetails),
    exact: true,
  },
  {
    path: `${paths.costModels}/:uuid`,
    labelKey: 'navigation.cost_models',
    component: userAccess(CostModel),
    exact: true,
  },
  {
    path: paths.awsDetails,
    labelKey: 'navigation.aws_details',
    component: userAccess(AwsDetails),
    exact: true,
  },
  {
    path: paths.awsDetailsBreakdown,
    labelKey: 'navigation.aws_details_breakdown',
    component: userAccess(AwsBreakdown),
    exact: true,
  },
  {
    path: paths.azureDetails,
    labelKey: 'navigation.azure_details',
    component: userAccess(AzureDetails),
    exact: true,
  },
  {
    path: paths.azureDetailsBreakdown,
    labelKey: 'navigation.azure_details_breakdown',
    component: userAccess(AzureBreakdown),
    exact: true,
  },
  {
    path: paths.ociDetails,
    labelKey: 'navigation.oci_details',
    component: userAccess(OciDetails),
    exact: true,
  },
  {
    path: paths.ociDetailsBreakdown,
    labelKey: 'navigation.oci_details_breakdown',
    component: userAccess(OciBreakdown),
    exact: true,
  },
  {
    path: paths.explorer,
    labelKey: 'navigation.explorer',
    component: userAccess(Explorer),
    exact: true,
  },
  {
    path: paths.gcpDetails,
    labelKey: 'navigation.gcp_details',
    component: userAccess(GcpDetails),
    exact: true,
  },
  {
    path: paths.gcpDetailsBreakdown,
    labelKey: 'navigation.gcp_details_breakdown',
    component: userAccess(GcpBreakdown),
    exact: true,
  },
  {
    path: paths.ibmDetails,
    labelKey: 'navigation.ibm_details',
    component: userAccess(IbmDetails),
    exact: true,
  },
  {
    path: paths.ibmDetailsBreakdown,
    labelKey: 'navigation.ibm_details_breakdown',
    component: userAccess(IbmBreakdown),
    exact: true,
  },
  {
    path: paths.ocpDetails,
    labelKey: 'navigation.ocp_details',
    component: userAccess(OcpDetails),
    exact: true,
  },
  {
    path: paths.ocpDetailsBreakdown,
    labelKey: 'navigation.ocp_details_breakdown',
    component: userAccess(OcpBreakdown),
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
