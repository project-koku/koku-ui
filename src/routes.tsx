import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncComponent } from './utils/asyncComponent';

const NotFound = asyncComponent(() =>
  import(/* webpackChunkName: "notFound" */ './pages/notFound')
);
const AwsBreakdown = asyncComponent(() =>
  import(/* webpackChunkName: "aws" */ './pages/details/awsBreakdown')
);
const AwsDetails = asyncComponent(() =>
  import(/* webpackChunkName: "aws" */ './pages/details/awsDetails')
);
const AzureBreakdown = asyncComponent(() =>
  import(/* webpackChunkName: "azure" */ './pages/details/azureBreakdown')
);
const AzureDetails = asyncComponent(() =>
  import(/* webpackChunkName: "azure" */ './pages/details/azureDetails')
);
const OcpDetails = asyncComponent(() =>
  import(/* webpackChunkName: "ocp" */ './pages/details/ocpDetails')
);
const OcpBreakdown = asyncComponent(() =>
  import(/* webpackChunkName: "ocp" */ './pages/details/ocpBreakdown')
);
const Overview = asyncComponent(() =>
  import(/* webpackChunkName: "overview" */ './pages/overview')
);
const CostModelsDetails = asyncComponent(() =>
  import(
    /* webpackChunkName: "costModels" */ './pages/costModels/costModelsDetails'
  )
);
const CostModel = asyncComponent(() =>
  import(/* webpackChunkName: "costModel" */ './pages/costModels/costModel')
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
    path: '/details/aws/breakdown',
    labelKey: 'navigation.aws_details_cost',
    component: AwsBreakdown,
    exact: true,
  },
  {
    path: '/details/azure',
    labelKey: 'navigation.azure_details',
    component: AzureDetails,
    exact: true,
  },
  {
    path: '/details/azure/breakdown',
    labelKey: 'navigation.azure_details_cost',
    component: AzureBreakdown,
    exact: true,
  },
  {
    path: '/details/ocp',
    labelKey: 'navigation.ocp_details',
    component: OcpDetails,
    exact: true,
  },
  {
    path: '/details/ocp/breakdown',
    labelKey: 'navigation.ocp_details_cost',
    component: OcpBreakdown,
    exact: true,
  },
  {
    path: '/cost-models',
    labelKey: 'navigation.cost_models',
    component: CostModelsDetails,
    exact: true,
  },
  {
    path: '/cost-models/:uuid',
    labelKey: 'navigation.cost_models',
    component: CostModel,
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
