import { Bullseye, Spinner } from '@patternfly/react-core';
import { ScalprumComponent } from '@scalprum/react-core';
import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { COST_BASENAME, IAM_BASENAME, SETTINGS_INTEGRATIONS_PATH } from '#/data/routes';
import { costScope, rbacScope, scalprumConfig } from '#/data/scalprum';

import { useIam } from './IamContext';

const remoteLoadingFallback = (
  <Bullseye>
    <Spinner size="lg" />
  </Bullseye>
);

/**
 * Old left-nav URLs under `/integrations` land on Settings. The remainder
 * (`/detail/:id`, `/new`, …) stays on the vendor app unless
 * `KOKU_UI_ONPREM_SOURCES_ENABLED=false` selects koku-ui-sources.
 */
const IntegrationsRedirect: React.FC = () => {
  const location = useLocation();
  const legacySources = process.env.KOKU_UI_ONPREM_SOURCES_ENABLED === 'false';

  if (legacySources) {
    return <Navigate to={`${COST_BASENAME}/settings`} replace />;
  }

  const rest = location.pathname.replace(/^\/integrations/, '');
  const params = new URLSearchParams(location.search);
  if (!params.get('category') && !params.get('activeVendor')) {
    params.set('category', 'Red Hat');
  }

  return <Navigate to={`${SETTINGS_INTEGRATIONS_PATH}${rest}?${params.toString()}`} replace />;
};

export const AppRoutes: React.FC = () => {
  const { isOnIamSection } = useIam();
  /**
   * Forces a full unmount/remount of the active `ScalprumComponent` when the
   * user crosses the boundary between Cost and IAM.
   */
  const remoteKey = isOnIamSection ? 'iam' : 'cost';

  return !isOnIamSection ? (
    <Routes>
      <Route path="/" element={<Navigate to={COST_BASENAME} replace />} />
      <Route path="/integrations/*" element={<IntegrationsRedirect />} />
      <Route
        path={`${COST_BASENAME}/*`}
        element={
          <ScalprumComponent
            key={remoteKey}
            scope={costScope}
            module={scalprumConfig[costScope].module!}
            fallback={remoteLoadingFallback}
          />
        }
      />
      <Route
        path={`${IAM_BASENAME}/*`}
        element={
          <ScalprumComponent
            key={remoteKey}
            scope={rbacScope}
            module={scalprumConfig[rbacScope].module!}
            fallback={remoteLoadingFallback}
          />
        }
      />
    </Routes>
  ) : (
    <Routes>
      <Route
        path="/*"
        element={
          <ScalprumComponent
            key={remoteKey}
            scope={rbacScope}
            module={scalprumConfig[rbacScope].module!}
            fallback={remoteLoadingFallback}
          />
        }
      />
    </Routes>
  );
};
