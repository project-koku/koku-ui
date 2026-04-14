import { Bullseye, Spinner } from '@patternfly/react-core';
import { userAccess } from 'components/userAccess';
import React, { lazy, Suspense } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

const NotFound = lazy(() => import(/* webpackChunkName: "NotFound" */ '@koku-ui/ui-lib/components/page/notFound'));
const OcpOptimizations = lazy(
  () => import(/* webpackChunkName: "recommendations" */ './routes/staging/optimizations/ocpOptimizationsStaging')
);
const OcpOptimizationsBreakdown = lazy(
  () =>
    import(/* webpackChunkName: "recommendations" */ './routes/staging/optimizations/ocpOptimizationsBreakdownStaging')
);
const OptimizationsBadge = lazy(
  () => import(/* webpackChunkName: "recommendations" */ './routes/staging/optimizations/optimizationsBadgeStaging')
);
const OptimizationsContainersTable = lazy(
  () =>
    import(
      /* webpackChunkName: "recommendations" */ './routes/staging/optimizations/optimizationsContainersTableStaging'
    )
);
const OptimizationsDetails = lazy(
  () => import(/* webpackChunkName: "recommendations" */ './routes/staging/optimizations/optimizationsDetailsStaging')
);
const OptimizationsDetailsBreakdown = lazy(
  () =>
    import(
      /* webpackChunkName: "recommendations" */ './routes/staging/optimizations/optimizationsDetailsBreakdownStaging'
    )
);
const OptimizationsLink = lazy(
  () => import(/* webpackChunkName: "recommendations" */ './routes/staging/optimizations/optimizationsLinkStaging')
);
const OptimizationsProjectsTable = lazy(
  () =>
    import(/* webpackChunkName: "recommendations" */ './routes/staging/optimizations/optimizationsProjectsTableStaging')
);
const OptimizationsSummary = lazy(
  () => import(/* webpackChunkName: "recommendations" */ './routes/staging/optimizations/optimizationsSummaryStaging')
);
const Welcome = lazy(() => import(/* webpackChunkName: "ocpDetails" */ 'routes/components/page/welcome/welcome'));

const routes = {
  ocpOptimizations: {
    element: userAccess(OcpOptimizations),
    path: '/optimizations/ocp',
  },
  ocpOptimizationsBreakdown: {
    element: userAccess(OcpOptimizationsBreakdown),
    path: '/optimizations/ocp/breakdown',
  },
  optimizationsBadge: {
    element: userAccess(OptimizationsBadge),
    path: '/optimizations/badge',
  },
  optimizationsContainersTable: {
    element: userAccess(OptimizationsContainersTable),
    path: '/optimizations/table/containers',
  },
  optimizationsDetails: {
    element: userAccess(OptimizationsDetails),
    path: '/optimizations/details',
  },
  optimizationsDetailsBreakdown: {
    element: userAccess(OptimizationsDetailsBreakdown),
    path: '/optimizations/details/breakdown',
  },
  optimizationsLink: {
    element: userAccess(OptimizationsLink),
    path: '/optimizations/link',
  },
  optimizationsProjectsTable: {
    element: userAccess(OptimizationsProjectsTable),
    path: '/optimizations/table/projects',
  },
  optimizationsSummary: {
    element: userAccess(OptimizationsSummary),
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
