import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
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
    path: '/details/azure',
    labelKey: 'navigation.azure_details',
    component: AzureDetails,
    exact: true,
  },
  {
    path: '/details/ocp',
    labelKey: 'navigation.ocp_details',
    component: OcpDetails,
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

/* Redirect workaround for https://github.com/project-koku/koku-ui/issues/1389 */
const Routes = () => (
  <Switch>
    {routes.map(route => (
      <Route key={route.path as any} {...route} />
    ))}
    <Route path="/aws" exact render={() => <Redirect to="/details/aws" />} />
    <Route path="/ocp" exact render={() => <Redirect to="/details/ocp" />} />
    <Route component={NotFound} />
  </Switch>
);

export { Routes, routes };
