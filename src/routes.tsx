import { Bullseye, Spinner } from '@patternfly/react-core';
import { userAccess } from 'components/userAccess';
import React, { lazy, Suspense } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

const NotFound = lazy(() => import(/* webpackChunkName: "notFound" */ 'routes/components/page/notFound'));
const AwsBreakdown = lazy(() => import(/* webpackChunkName: "awsBreakdown" */ 'routes/details/awsBreakdown'));
const AwsDetails = lazy(() => import(/* webpackChunkName: "awsDetails" */ 'routes/details/awsDetails'));
const AzureBreakdown = lazy(() => import(/* webpackChunkName: "azureBreakdown" */ 'routes/details/azureBreakdown'));
const AzureDetails = lazy(() => import(/* webpackChunkName: "azureDetails" */ 'routes/details/azureDetails'));
const CostModel = lazy(() => import(/* webpackChunkName: "costModel" */ 'routes/settings/costModels/costModel'));
const Explorer = lazy(() => import(/* webpackChunkName: "explorer" */ 'routes/explorer'));
const GcpBreakdown = lazy(() => import(/* webpackChunkName: "gcpBreakdown" */ 'routes/details/gcpBreakdown'));
const GcpDetails = lazy(() => import(/* webpackChunkName: "gcpDetails" */ 'routes/details/gcpDetails'));
const IbmBreakdown = lazy(() => import(/* webpackChunkName: "ibmBreakdown" */ 'routes/details/ibmBreakdown'));
const IbmDetails = lazy(() => import(/* webpackChunkName: "ibmDetails" */ 'routes/details/ibmDetails'));
const OciBreakdown = lazy(() => import(/* webpackChunkName: "ociBreakdown" */ 'routes/details/ociBreakdown'));
const OciDetails = lazy(() => import(/* webpackChunkName: "ociDetails" */ 'routes/details/ociDetails'));
const OcpBreakdown = lazy(() => import(/* webpackChunkName: "ocpBreakdown" */ 'routes/details/ocpBreakdown'));
const OcpDetails = lazy(() => import(/* webpackChunkName: "ocpDetails" */ 'routes/details/ocpDetails'));
const OptimizationsBreakdown = lazy(
  () => import(/* webpackChunkName: "recommendations" */ 'routes/optimizations/optimizationsBreakdown')
);
const OptimizationsDetails = lazy(
  () => import(/* webpackChunkName: "recommendations" */ 'routes/optimizations/optimizationsDetails')
);
const Overview = lazy(() => import(/* webpackChunkName: "overview" */ 'routes/overview'));
const RhelDetails = lazy(() => import(/* webpackChunkName: "rhelDetails" */ 'routes/details/rhelDetails'));
const RhelBreakdown = lazy(() => import(/* webpackChunkName: "rhelBreakdown" */ 'routes/details/rhelBreakdown'));
const Settings = lazy(() => import(/* webpackChunkName: "overview" */ 'routes/settings'));

export const routes = {
  awsBreakdown: {
    element: userAccess(AwsBreakdown),
    path: '/aws/breakdown',
  },
  awsDetails: {
    element: userAccess(AwsDetails),
    path: '/aws',
  },
  azureBreakdown: {
    element: userAccess(AzureBreakdown),
    path: '/azure/breakdown',
  },
  azureDetails: {
    element: userAccess(AzureDetails),
    path: '/azure',
  },
  costModel: {
    // Note: Order matters here (i.e., dynamic segment must be defined after costModelsDetails)
    basePath: `/settings/cost-model`,
    element: userAccess(CostModel),
    path: `/settings/cost-model/:uuid`,
  },
  explorer: {
    element: userAccess(Explorer),
    path: '/explorer',
  },
  gcpBreakdown: {
    element: userAccess(GcpBreakdown),
    path: '/gcp/breakdown',
  },
  gcpDetails: {
    element: userAccess(GcpDetails),
    path: '/gcp',
  },
  ibmBreakdown: {
    element: userAccess(IbmBreakdown),
    path: '/ibm/breakdown',
  },
  ibmDetails: {
    element: userAccess(IbmDetails),
    path: '/ibm',
  },
  ociBreakdown: {
    element: userAccess(OciBreakdown),
    path: '/oci/breakdown',
  },
  ociDetails: {
    element: userAccess(OciDetails),
    path: '/oci',
  },
  ocpBreakdown: {
    element: userAccess(OcpBreakdown),
    path: '/ocp/breakdown',
  },
  ocpBreakdownOptimizations: {
    element: userAccess(OptimizationsBreakdown),
    path: '/ocp/breakdown/optimizations',
  },
  ocpDetails: {
    element: userAccess(OcpDetails),
    path: '/ocp',
  },
  optimizationsBreakdown: {
    element: userAccess(OptimizationsBreakdown),
    path: '/optimizations/breakdown',
  },
  optimizationsDetails: {
    element: userAccess(OptimizationsDetails),
    path: '/optimizations',
  },
  overview: {
    element: userAccess(Overview),
    path: '/',
  },
  rhelBreakdown: {
    element: userAccess(RhelBreakdown),
    path: '/rhel/breakdown',
  },
  rhelDetails: {
    element: userAccess(RhelDetails),
    path: '/rhel',
  },
  settings: {
    element: userAccess(Settings),
    path: '/settings',
  },
};

export const Routes = () => (
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
