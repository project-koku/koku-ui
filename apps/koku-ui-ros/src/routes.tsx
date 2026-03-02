import { Bullseye, Spinner } from '@patternfly/react-core';
import { userAccess } from 'components/userAccess';
import React, { lazy, Suspense } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

const NotFound = lazy(() => import(/* webpackChunkName: "NotFound" */ '@koku-ui/ui-lib/components/page/notFound'));
const OptimizationsBadgeStaging = lazy(
  () => import(/* webpackChunkName: "recommendations" */ 'routes/staging/optimizations/optimizationsBadgeStaging')
);
const OptimizationsBreakdownStaging = lazy(
  () => import(/* webpackChunkName: "recommendations" */ 'routes/staging/optimizations/optimizationsBreakdownStaging')
);
const OptimizationsContainersTableStaging = lazy(
  () =>
    import(/* webpackChunkName: "recommendations" */ 'routes/staging/optimizations/optimizationsContainersTableStaging')
);
const OptimizationsDetailsStaging = lazy(
  () => import(/* webpackChunkName: "recommendations" */ 'routes/staging/optimizations/optimizationsDetailsStaging')
);
const OptimizationsLinkStaging = lazy(
  () => import(/* webpackChunkName: "recommendations" */ 'routes/staging/optimizations/optimizationsLinkStaging')
);
const OptimizationsOcpBreakdownStaging = lazy(
  () =>
    import(/* webpackChunkName: "recommendations" */ 'routes/staging/optimizations/optimizationsOcpBreakdownStaging')
);
const OptimizationsProjectsTableStaging = lazy(
  () =>
    import(/* webpackChunkName: "recommendations" */ 'routes/staging/optimizations/optimizationsProjectsTableStaging')
);
const OptimizationsSummaryStaging = lazy(
  () => import(/* webpackChunkName: "recommendations" */ 'routes/staging/optimizations/optimizationsSummaryStaging')
);

const Welcome = lazy(() => import(/* webpackChunkName: "ocpDetails" */ 'routes/components/page/welcome/welcome'));

const routes = {
  optimizationsBadge: {
    element: userAccess(OptimizationsBadgeStaging),
    path: '/optimizations/badge',
  },
  optimizationsBreakdown: {
    element: userAccess(OptimizationsBreakdownStaging),
    path: '/optimizations/breakdown',
  },
  optimizationsContainersTable: {
    element: userAccess(OptimizationsContainersTableStaging),
    path: '/optimizations/table/containers',
  },
  optimizationsDetails: {
    element: userAccess(OptimizationsDetailsStaging),
    path: '/optimizations/details',
  },
  optimizationsLink: {
    element: userAccess(OptimizationsLinkStaging),
    path: '/optimizations/link',
  },
  optimizationsOcpBreakdown: {
    element: userAccess(OptimizationsOcpBreakdownStaging),
    path: '/optimizations/ocp/breakdown',
  },
  optimizationsProjectsTable: {
    element: userAccess(OptimizationsProjectsTableStaging),
    path: '/optimizations/table/projects',
  },
  optimizationsSummary: {
    element: userAccess(OptimizationsSummaryStaging),
    path: '/optimizations/summary',
  },
  welcome: {
    element: userAccess(Welcome),
    path: '/',
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
