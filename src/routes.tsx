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
  recommendations: '/recommendations',
  rhelDetails: '/rhel',
  rhelDetailsBreakdown: '/rhel/breakdown',
};

const routes = [
  {
    element: userAccess(Overview),
    path: paths.overview,
  },
  {
    element: userAccess(AwsDetails),
    path: paths.awsDetails,
  },
  {
    element: userAccess(AwsBreakdown),
    path: paths.awsDetailsBreakdown,
  },
  {
    element: userAccess(AzureDetails),
    path: paths.azureDetails,
  },
  {
    element: userAccess(AzureBreakdown),
    path: paths.azureDetailsBreakdown,
  },
  {
    // Note: Path order matters here (i.e., dynamic segment must be defined last)
    element: userAccess(CostModelsDetails),
    path: paths.costModels,
  },
  {
    // Note: Path order matters here (i.e., dynamic segment must be defined last)
    element: userAccess(CostModel),
    path: `${paths.costModels}/:uuid`,
  },
  {
    element: userAccess(Explorer),
    path: paths.explorer,
  },
  {
    element: userAccess(GcpDetails),
    path: paths.gcpDetails,
  },
  {
    element: userAccess(GcpBreakdown),
    path: paths.gcpDetailsBreakdown,
  },
  {
    element: userAccess(IbmDetails),
    path: paths.ibmDetails,
  },
  {
    element: userAccess(IbmBreakdown),
    path: paths.ibmDetailsBreakdown,
  },
  {
    element: userAccess(OciDetails),
    path: paths.ociDetails,
  },
  {
    element: userAccess(OciBreakdown),
    path: paths.ociDetailsBreakdown,
  },
  {
    element: userAccess(OcpDetails),
    path: paths.ocpDetails,
  },
  {
    element: userAccess(OcpBreakdown),
    path: paths.ocpDetailsBreakdown,
  },
  {
    element: userAccess(Recommendations),
    path: paths.recommendations,
  },
  {
    element: userAccess(RhelDetails),
    path: paths.rhelDetails,
  },
  {
    element: userAccess(RhelBreakdown),
    path: paths.rhelDetailsBreakdown,
  },
];

const Routes = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner size="lg" />
      </Bullseye>
    }
  >
    <RouterRoutes>
      {routes.map(route => (
        <Route key={route.path} path={route.path} element={<route.element />} />
      ))}
      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  </Suspense>
);

export { paths, Routes, routes };
