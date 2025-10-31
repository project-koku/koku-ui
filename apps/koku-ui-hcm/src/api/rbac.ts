import type { Access } from '@redhat-cloud-services/rbac-client/types';

export interface RBAC {
  isOrgAdmin: boolean;
  permissions: Access[];
}

export async function getRBAC(): Promise<RBAC> {
  const insights = (window as any).insights;
  if (insights?.chrome?.auth?.getUser && insights?.chrome?.getUserPermissions) {
    const user = await insights.chrome.auth.getUser();
    const permissions = await insights.chrome.getUserPermissions();
    return {
      isOrgAdmin: user.identity.user.is_org_admin,
      permissions,
    };
  }
  return { isOrgAdmin: false, permissions: null };
}
