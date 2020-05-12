import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncComponent } from './utils/asyncComponent';

const NotFound = asyncComponent(() =>
  import(/* webpackChunkName: "notFound" */ './pages/notFound')
);
const AwsDetails = asyncComponent(() =>
  import(/* webpackChunkName: "aws" */ './pages/details/awsDetails')
);
const AzureDetails = asyncComponent(() =>
  import(/* webpackChunkName: "azure" */ './pages/details/azureDetails')
);
const OcpDetails = asyncComponent(() =>
  import(/* webpackChunkName: "ocp" */ './pages/details/ocpDetails')
);
const OcpCostDetails = asyncComponent(() =>
  import(/* webpackChunkName: "ocp" */ './pages/details/ocpCostDetails')
);
const OcpCloudDetails = asyncComponent(() =>
  import(/* webpackChunkName: "ocpCloud" */ './pages/details/ocpCloudDetails')
);
const Overview = asyncComponent(() =>
  import(/* webpackChunkName: "overview" */ './pages/overview')
);
const CostModelsDetails = asyncComponent(() =>
  import(
    /* webpackChunkName: "costModels" */ './pages/costModels/costModelsDetails'
  )
);

const routes = [
  {
    path: '/',
    labelKey: 'navigation.overview',
    component: Overview,
    exact: true,
  },
  {
    path: '/details/aws',
    labelKey: 'navigation.aws_details',
    component: AwsDetails,
    exact: true,
  },
  {
    path: '/details/aws/cost',
    labelKey: 'navigation.aws_details_cost',
    component: OcpCostDetails, // Todo: Create AwsCostDetails
    exact: true,
  },
  {
    path: '/details/azure',
    labelKey: 'navigation.azure_details',
    component: AzureDetails,
    exact: true,
  },
  {
    path: '/details/azure/cost',
    labelKey: 'navigation.azure_details_cost',
    component: OcpCostDetails, // Todo: Create AzureCostDetails
    exact: true,
  },
  {
    path: '/details/ocp',
    labelKey: 'navigation.ocp_details',
    component: OcpDetails,
    exact: true,
  },
  {
    path: '/details/ocp/cost',
    labelKey: 'navigation.ocp_details_cost',
    component: OcpCostDetails,
    exact: true,
  },
  {
    path: '/details/ocp-cloud',
    labelKey: 'navigation.ocp_cloud_details',
    component: OcpCloudDetails,
    exact: true,
  },
  {
    path: '/cost-models',
    labelKey: 'navigation.cost_models',
    component: CostModelsDetails,
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

export { Routes, routes };
