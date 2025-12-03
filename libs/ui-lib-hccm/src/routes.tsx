import { Bullseye, Spinner } from '@patternfly/react-core';
import React, { lazy, Suspense } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

import { userAccess } from './components/userAccess';

const NotFound = lazy(() => import(/* webpackChunkName: "NotFound" */ '@koku-ui/ui-lib/components/page/notFound'));
const AwsBreakdown = lazy(() => import(/* webpackChunkName: "awsBreakdown" */ './routes/details/awsBreakdown'));
const AwsDetails = lazy(() => import(/* webpackChunkName: "awsDetails" */ './routes/details/awsDetails'));
const AzureBreakdown = lazy(() => import(/* webpackChunkName: "azureBreakdown" */ './routes/details/azureBreakdown'));
const AzureDetails = lazy(() => import(/* webpackChunkName: "azureDetails" */ './routes/details/azureDetails'));
const CostModel = lazy(() => import(/* webpackChunkName: "costModel" */ './routes/settings/costModels/costModel'));
const Explorer = lazy(() => import(/* webpackChunkName: "explorer" */ './routes/explorer'));
const GcpBreakdown = lazy(() => import(/* webpackChunkName: "gcpBreakdown" */ './routes/details/gcpBreakdown'));
const GcpDetails = lazy(() => import(/* webpackChunkName: "gcpDetails" */ './routes/details/gcpDetails'));
const OcpBreakdown = lazy(() => import(/* webpackChunkName: "ocpBreakdown" */ './routes/details/ocpBreakdown'));
const OcpDetails = lazy(() => import(/* webpackChunkName: "ocpDetails" */ './routes/details/ocpDetails'));
const OptimizationsBreakdown = lazy(
  () => import(/* webpackChunkName: "recommendations" */ './routes/optimizations/optimizationsBreakdown')
);
const OptimizationsDetails = lazy(
  () => import(/* webpackChunkName: "recommendations" */ './routes/optimizations/optimizationsDetails')
);
const Overview = lazy(() => import(/* webpackChunkName: "overview" */ './routes/overview'));
const Settings = lazy(() => import(/* webpackChunkName: "overview" */ './routes/settings'));

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
    basePath: `/settings/cost-model`,
    element: userAccess(CostModel),
    path: `/settings/cost-model/:uuid`, // Note: Order matters (i.e., dynamic segment must be defined after costModelsDetails)
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
