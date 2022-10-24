import type { Access } from '@redhat-cloud-services/rbac-client';

export interface RBAC {
  isOrgAdmin: boolean;
  permissions: Access[];
}

export async function getRBAC(): Promise<RBAC> {
  const _insights = (window as any).insights;
  if (
    _insights &&
    _insights.chrome &&
    _insights.chrome.auth &&
    _insights.chrome.auth.getUser &&
    _insights.chrome.getUserPermissions
  ) {
    const user = await _insights.chrome.auth.getUser();
    const permissions = await _insights.chrome.getUserPermissions();
    return {
      isOrgAdmin: user.identity.user.is_org_admin,
      permissions,
    };
  }
  return { isOrgAdmin: false, permissions: null };
}
