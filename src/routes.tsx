import { Bullseye, Spinner } from '@patternfly/react-core';
import { userAccess } from 'components/userAccess';
import React, { lazy, Suspense } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

const NotFound = lazy(() => import(/* webpackChunkName: "notFound" */ 'routes/state/notFound'));
const AwsBreakdown = lazy(() => import(/* webpackChunkName: "awsBreakdown" */ 'routes/views/details/awsBreakdown'));
const AwsDetails = lazy(() => import(/* webpackChunkName: "awsDetails" */ 'routes/views/details/awsDetails'));
const AzureBreakdown = lazy(
  () => import(/* webpackChunkName: "azureBreakdown" */ 'routes/views/details/azureBreakdown')
);
const AzureDetails = lazy(() => import(/* webpackChunkName: "azureDetails" */ 'routes/views/details/azureDetails'));
const CostModelsDetails = lazy(() => import(/* lazy: "costModelsDetails" */ 'routes/costModels/costModelsDetails'));
const CostModel = lazy(() => import(/* webpackChunkName: "costModel" */ 'routes/costModels/costModel'));
const Explorer = lazy(() => import(/* webpackChunkName: "explorer" */ 'routes/views/explorer'));
const GcpBreakdown = lazy(() => import(/* webpackChunkName: "gcpBreakdown" */ 'routes/views/details/gcpBreakdown'));
const GcpDetails = lazy(() => import(/* webpackChunkName: "gcpDetails" */ 'routes/views/details/gcpDetails'));
const IbmBreakdown = lazy(() => import(/* webpackChunkName: "ibmBreakdown" */ 'routes/views/details/ibmBreakdown'));
const IbmDetails = lazy(() => import(/* webpackChunkName: "ibmDetails" */ 'routes/views/details/ibmDetails'));
const OciBreakdown = lazy(() => import(/* webpackChunkName: "ociBreakdown" */ 'routes/views/details/ociBreakdown'));
const OciDetails = lazy(() => import(/* webpackChunkName: "ociDetails" */ 'routes/views/details/ociDetails'));
const OcpBreakdown = lazy(() => import(/* webpackChunkName: "ocpBreakdown" */ 'routes/views/details/ocpBreakdown'));
const OcpDetails = lazy(() => import(/* webpackChunkName: "ocpDetails" */ 'routes/views/details/ocpDetails'));
const Overview = lazy(() => import(/* webpackChunkName: "overview" */ 'routes/views/overview'));
const Recommendations = lazy(() => import(/* webpackChunkName: "ocpDetails" */ 'routes/views/ros/recommendations'));
const RhelDetails = lazy(() => import(/* webpackChunkName: "ocpDetails" */ 'routes/views/details/rhelDetails'));
const RhelBreakdown = lazy(() => import(/* webpackChunkName: "ocpDetails" */ 'routes/views/details/rhelBreakdown'));

const routes = {
  awsDetails: {
    element: userAccess(AwsDetails),
    path: '/aws',
  },
  awsDetailsBreakdown: {
    element: userAccess(AwsBreakdown),
    path: '/aws/breakdown',
  },
  azureDetails: {
    element: userAccess(AzureDetails),
    path: '/azure',
  },
  azureDetailsBreakdown: {
    element: userAccess(AzureBreakdown),
    path: '/azure/breakdown',
  },
  costModelsDetails: {
    element: userAccess(CostModelsDetails),
    path: '/cost-models',
  },
  costModels: {
    // Note: Order matters here (i.e., dynamic segment must be defined after costModelsDetails)
    element: userAccess(CostModel),
    path: `/cost-models/:uuid`,
  },
  explorer: {
    element: userAccess(Explorer),
    path: '/explorer',
  },
  gcpDetails: {
    element: userAccess(GcpDetails),
    path: '/gcp',
  },
  gcpDetailsBreakdown: {
    element: userAccess(GcpBreakdown),
    path: '/gcp/breakdown',
  },
  ibmDetails: {
    element: userAccess(IbmDetails),
    path: '/ibm',
  },
  ibmDetailsBreakdown: {
    element: userAccess(IbmBreakdown),
    path: '/ibm/breakdown',
  },
  ociDetails: {
    element: userAccess(OciDetails),
    path: '/oci',
  },
  ociDetailsBreakdown: {
    element: userAccess(OciBreakdown),
    path: '/oci/breakdown',
  },
  ocpDetails: {
    element: userAccess(OcpDetails),
    path: '/ocp',
  },
  ocpDetailsBreakdown: {
    element: userAccess(OcpBreakdown),
    path: '/ocp/breakdown',
  },
  overview: {
    element: userAccess(Overview),
    path: '/',
  },
  recommendations: {
    element: userAccess(Recommendations),
    path: '/recommendations',
  },
  rhelDetails: {
    element: userAccess(RhelDetails),
    path: '/rhel',
  },
  rhelDetailsBreakdown: {
    element: userAccess(RhelBreakdown),
    path: '/rhel/breakdown',
  },
};

const Routes = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner size="lg" />
      </Bullseye>
    }
  >
    <RouterRoutes>
      {Object.keys(routes).map(key => {
        const route = routes[key];
        return <Route key={route.path} path={route.path} element={<route.element />} />;
      })}
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  </Suspense>
);

export { routes, Routes };
