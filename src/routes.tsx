import some from 'lodash/some';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { asyncComponent } from './utils/asyncComponent';

/**
 * Aysnc imports of components
 *
 * https://webpack.js.org/guides/code-splitting/
 * https://reactjs.org/docs/code-splitting.html
 *
 * pros:
 *      1) code splitting
 *      2) can be used in server-side rendering
 * cons:
 *      1) nameing chunk names adds unnecessary docs to code,
 *         see the difference with DashboardMap and InventoryDeployments.
 *
 */
const AwsDetails = asyncComponent(() =>
  import(/* webpackChunkName: "aws" */ './pages/details/awsDetails')
);
const AzureDetails = asyncComponent(() =>
  import(/* webpackChunkName: "azure" */ './pages/details/azureDetails')
);
const CostModels = asyncComponent(() =>
  import(
    /* webpackChunkName: "costModels" */ './pages/costModels/costModelsDetails'
  )
);
const OcpCloudDetails = asyncComponent(() =>
  import(/* webpackChunkName: "ocpCloud" */ './pages/details/ocpCloudDetails')
);
const OcpDetails = asyncComponent(() =>
  import(/* webpackChunkName: "ocp" */ './pages/details/ocpDetails')
);
const Overview = asyncComponent(() =>
  import(/* webpackChunkName: "overview" */ './pages/overview')
);

const paths = {
  awsDetails: '/details/infrastructure/aws',
  azureDetails: '/details/infrastructure/azure',
  costModels: '/cost-models',
  ocpCloudDetails: '/details/infrastructure/ocp-cloud',
  ocpDetails: '/details/ocp',
  overview: '/',
};

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
  const root = document.getElementById('root');
  root.removeAttribute('class');
  root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
  root.setAttribute('role', 'main');

  return <Route {...rest} component={Component} />;
};

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = props => {
  const path = props.childProps.location.pathname;

  return (
    <Switch>
      <InsightsRoute
        path={paths.awsDetails}
        component={AwsDetails}
        rootClass="awsdetails"
      />
      <InsightsRoute
        path={paths.azureDetails}
        component={AzureDetails}
        rootClass="azuredetails"
      />
      <InsightsRoute
        path={paths.costModels}
        component={CostModels}
        rootClass="costmodels"
      />
      <InsightsRoute
        path={paths.ocpCloudDetails}
        component={OcpCloudDetails}
        rootClass="ocpclouddetails"
      />
      <InsightsRoute
        path={paths.ocpDetails}
        component={OcpDetails}
        rootClass="ocpdetails"
      />
      <InsightsRoute
        path={paths.overview}
        component={Overview}
        rootClass="overview"
      />

      {/* Finally, catch all unmatched routes */}
      <Route
        render={() =>
          some(paths, p => p === path) ? null : <Redirect to={paths.overview} />
        }
      />
    </Switch>
  );
};
