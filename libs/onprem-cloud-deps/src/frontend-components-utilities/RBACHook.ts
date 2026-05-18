import { useEffect, useState } from 'react';

import useChrome from '../frontend-components/useChrome';

export type PermissionsResult = {
  isLoading: boolean;
  hasAccess: boolean;
  isOrgAdmin: boolean;
  permissions: string[];
};

/**
 * On-prem stub for Chrome RBAC permission checks.
 * Avoids bundling frontend-components-utilities/RBAC (rbac-client types) into the federated remote.
 */
export function usePermissions(
  appName: string,
  permissionsList: string[] = [],
  _disableCache = false,
  _checkAll = false,
  _checkResourceDefinitions = false
): PermissionsResult {
  const chrome = useChrome();
  const [permissions, setPermissions] = useState<PermissionsResult>({
    isLoading: true,
    hasAccess: false,
    isOrgAdmin: false,
    permissions: [],
  });

  useEffect(() => {
    let ignore = false;
    setPermissions(prev => ({ ...prev, isLoading: true }));

    void (async () => {
      const user = await chrome.auth.getUser();
      const isOrgAdmin = Boolean(
        (user as { identity?: { user?: { is_org_admin?: boolean } } })?.identity?.user?.is_org_admin
      );
      const userPermissions = (await chrome.getUserPermissions(appName, _disableCache)) ?? [];

      if (ignore) {
        return;
      }

      setPermissions({
        isLoading: false,
        isOrgAdmin,
        permissions: userPermissions as string[],
        // POC: allow access when org admin or no explicit permissions requested
        hasAccess: isOrgAdmin || permissionsList.length === 0,
      });
    })();

    return () => {
      ignore = true;
    };
  }, [appName, permissionsList.join(','), _disableCache, _checkAll, chrome]);

  return permissions;
}

export default usePermissions;
