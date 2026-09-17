import { useEffect, useState } from 'react';

// eslint-disable-next-line no-restricted-imports -- sibling module under onprem-cloud-deps/src; webpack cannot resolve baseUrl-style paths here
import useChrome from '../frontend-components/useChrome';

const toPermissionString = (permission: unknown): string => {
  if (typeof permission === 'string') {
    return permission;
  }

  if (permission && typeof permission === 'object' && 'permission' in permission) {
    return String((permission as { permission: string }).permission);
  }

  return '';
};

const permissionMatches = (userPermission: string, requestedPermission: string): boolean => {
  const userParts = userPermission.split(':');
  const requestedParts = requestedPermission.split(':');

  return userParts.every((part, index) => part === '*' || part === requestedParts[index]);
};

const hasAllPermissions = (userPermissions: string[], requested: string[]): boolean =>
  requested.every(req => userPermissions.some(userPerm => permissionMatches(userPerm, req)));

const hasAnyPermission = (userPermissions: string[], requested: string[]): boolean =>
  requested.some(req => userPermissions.some(userPerm => permissionMatches(userPerm, req)));

export interface PermissionsResult {
  isLoading: boolean;
  hasAccess: boolean;
  isOrgAdmin: boolean;
  permissions: string[];
}

/**
 * On-prem stub for Chrome RBAC permission checks.
 * Avoids bundling frontend-components-utilities/RBAC (rbac-client types) into the federated remote.
 */
export function usePermissions(
  appName: string,
  permissionsList: string[] = [],
  _disableCache = false,
  _checkAll = false
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
      const userPermissions = ((await chrome.getUserPermissions(appName, _disableCache)) ?? [])
        .map(toPermissionString)
        .filter(Boolean);

      if (ignore) {
        return;
      }

      setPermissions({
        isLoading: false,
        isOrgAdmin,
        permissions: userPermissions,
        hasAccess:
          isOrgAdmin ||
          permissionsList.length === 0 ||
          (_checkAll
            ? hasAllPermissions(userPermissions, permissionsList)
            : hasAnyPermission(userPermissions, permissionsList)),
      });
    })();

    return () => {
      ignore = true;
    };
  }, [appName, permissionsList.join(','), _disableCache, _checkAll, chrome]);

  return permissions;
}

export default usePermissions;
