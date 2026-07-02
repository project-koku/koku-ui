import { Bullseye, Spinner } from '@patternfly/react-core';
import { ScalprumComponent } from '@scalprum/react-core';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { COST_BASENAME, IAM_BASENAME } from '#/data/routes';
import { costScope, rbacScope, scalprumConfig } from '#/data/scalprum';

import { useIam } from './IamContext';

const remoteLoadingFallback = (
  <Bullseye>
    <Spinner size="lg" />
  </Bullseye>
);

export const AppRoutes: React.FC = () => {
  const { isOnIamSection } = useIam();
  /**
   * Forces a full unmount/remount of the active `ScalprumComponent` when the
   * user crosses the boundary between the Cost and IAM sections.
   *
   * Passing this as the React `key` prop ensures that React tears down the
   * previous micro-frontend's component tree and mounts a fresh one, preventing
   * stale state or module instances from leaking across section boundaries.
   */
  const remoteKey = isOnIamSection ? 'iam' : 'cost';

  return !isOnIamSection ? (
    <Routes>
      <Route path="/" element={<Navigate to={COST_BASENAME} replace />} />
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
