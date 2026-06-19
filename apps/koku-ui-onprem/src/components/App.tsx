import { ScalprumProvider } from '@scalprum/react-core';
import { FlagProvider } from '@unleash/proxy-client-react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { IAM_BASENAME, isIamPath } from '#/data/routes';
import { scalprumConfig } from '#/data/scalprum';

import { AppLayout } from './AppLayout';
import { IamProvider } from './IamContext';

/**
 * Returns the correct `basename` for the top-level `BrowserRouter`.
 *
 * ## Background
 *
 * This app serves two distinct URL spaces:
 * - **Cost Management** — routes under `/openshift/cost-management/*`
 * - **IAM / RBAC** — routes under `/iam/*`, rendered by the `insights-rbac-ui`
 *   federated micro-frontend loaded via Scalprum.
 *
 * ## Why a conditional basename?
 *
 * React Router's `BrowserRouter` uses `window.history` for navigation. When
 * multiple modules share the same history object (as happens in a
 * micro-frontend host), every router in the tree must agree on which URL
 * prefix belongs to it. Setting `basename` tells `BrowserRouter` to strip
 * that prefix before matching routes, so the federated RBAC module can declare
 * routes starting with `/user-access/...` even though the browser shows
 * `/iam/user-access/...`.
 *
 * Without the correct basename on the **host** router, the RBAC module cannot
 * safely use a `BrowserRouter` of its own (two routers fighting over the same
 * `window.history` cause unpredictable navigation). The workaround teams
 * typically reach for is wrapping the MFE in a `MemoryRouter` — an in-memory
 * history that is invisible to the browser. That breaks deep-linking, the
 * browser back/forward buttons, and shareable URLs.
 *
 * By returning `IAM_BASENAME` (`"/iam"`) when the page is already under that
 * path, we scope the host router correctly and let the RBAC module participate
 * in real browser history without a nested `MemoryRouter`.
 *
 * For all other paths (Cost Management routes) no prefix is needed, so the
 * function returns `undefined` and `BrowserRouter` operates from the
 * document root.
 */
const getBasename = (): string | undefined =>
  window?.location.pathname && isIamPath(window.location.pathname) ? IAM_BASENAME : undefined;

export const App: React.FC = () => {
  return (
    <ScalprumProvider config={scalprumConfig} api={{}}>
      <FlagProvider>
        <BrowserRouter basename={getBasename()}>
          <IamProvider>
            <AppLayout />
          </IamProvider>
        </BrowserRouter>
      </FlagProvider>
    </ScalprumProvider>
  );
};
