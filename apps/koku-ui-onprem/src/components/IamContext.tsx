import React, { createContext, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { isIamPath } from '#/data/routes';

interface IamContextValue {
  isOnIamSection: boolean;
}

const IamContext = createContext<IamContextValue>({ isOnIamSection: false });

/**
 * Computes `isOnIamSection` once per location change and fans it out via
 * context, avoiding repeated `window.location` reads scattered across the tree.
 *
 * `window.location.pathname` is used instead of `useLocation().pathname`
 * because when the RBAC MFE router is active it sets its basename to `/iam`,
 * making React Router return basename-relative paths (e.g. `/roles` instead of
 * `/iam/roles`). Only the raw browser URL always contains the full path.
 * `pathname` from `useLocation()` is listed as a dependency solely to
 * re-evaluate on every navigation.
 */
export const IamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const value = useMemo(
    () => ({ isOnIamSection: typeof window !== 'undefined' && isIamPath(window.location.pathname) }),
    // pathname drives re-evaluation; the actual check reads window.location
    [pathname]
  );
  return <IamContext.Provider value={value}>{children}</IamContext.Provider>;
};

/**
 * Returns `{ isOnIamSection }` — true when the current page is under `/iam`.
 *
 * Must be used inside `<IamProvider>`.
 */
export const useIam = () => useContext(IamContext);
