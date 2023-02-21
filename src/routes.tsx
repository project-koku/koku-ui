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

const basename = '/openshift/cost-management';

const routes = {
  awsDetails: {
    element: userAccess(AwsDetails),
    pathname: `${basename}/aws`,
    path: '/aws',
  },
  awsDetailsBreakdown: {
    element: userAccess(AwsBreakdown),
    pathname: `${basename}/aws/breakdown`,
    path: '/aws/breakdown',
  },
  azureDetails: {
    element: userAccess(AzureDetails),
    pathname: `${basename}/azure`,
    path: '/azure',
  },
  azureDetailsBreakdown: {
    element: userAccess(AzureBreakdown),
    pathname: `${basename}/azure/breakdown`,
    path: '/azure/breakdown',
  },
  costModelsDetails: {
    element: userAccess(CostModelsDetails),
    pathname: `${basename}/cost-models`,
    path: '/cost-models',
  },
  costModels: {
    // Note: Path order matters here (i.e., dynamic segment must be defined after costModelsDetails)
    element: userAccess(CostModel),
    pathname: `${basename}/cost-models`,
    path: `/cost-models/:uuid`,
  },
  explorer: {
    element: userAccess(Explorer),
    pathname: `${basename}/explorer`,
    path: '/explorer',
  },
  gcpDetails: {
    element: userAccess(GcpDetails),
    pathname: `${basename}/gcp`,
    path: '/gcp',
  },
  gcpDetailsBreakdown: {
    element: userAccess(GcpBreakdown),
    pathname: `${basename}/gcp/breakdown`,
    path: '/gcp/breakdown',
  },
  ibmDetails: {
    element: userAccess(IbmDetails),
    pathname: `${basename}/ibm`,
    path: '/ibm',
  },
  ibmDetailsBreakdown: {
    element: userAccess(IbmBreakdown),
    pathname: `${basename}/ibm/breakdown`,
    path: '/ibm/breakdown',
  },
  ociDetails: {
    element: userAccess(OciDetails),
    pathname: `${basename}/oci`,
    path: '/oci',
  },
  ociDetailsBreakdown: {
    element: userAccess(OciBreakdown),
    pathname: `${basename}/oci/breakdown`,
    path: '/oci/breakdown',
  },
  ocpDetails: {
    element: userAccess(OcpDetails),
    pathname: `${basename}/ocp`,
    path: '/ocp',
  },
  ocpDetailsBreakdown: {
    element: userAccess(OcpBreakdown),
    pathname: `${basename}/ocp/breakdown`,
    path: '/ocp/breakdown',
  },
  overview: {
    element: userAccess(Overview),
    pathname: `${basename}`,
    path: '/',
  },
  recommendations: {
    element: userAccess(Recommendations),
    pathname: `${basename}/recommendations`,
    path: '/recommendations',
  },
  rhelDetails: {
    element: userAccess(RhelDetails),
    pathname: `${basename}/rhel`,
    path: '/rhel',
  },
  rhelDetailsBreakdown: {
    element: userAccess(RhelBreakdown),
    pathname: `${basename}/rhel/breakdown`,
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

export { Routes, routes };
