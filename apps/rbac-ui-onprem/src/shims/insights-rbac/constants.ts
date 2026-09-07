/**
 * insights-rbac-frontend/shared/utilities/constants
 *
 * On-prem has no RHEL entitlement (COST-7589). Upstream DEFAULT_MUA_BUNDLE is
 * 'rhel' for SaaS; unparameterized /iam/my-user-access deep links must default
 * to OpenShift (COST-8160).
 */
export const RBAC_API_BASE = `/api/rbac/v1` as const;
export const RBAC_API_BASE_2 = `/api/rbac/v2` as const;
export const COST_API_BASE = `/api/cost-management/v1` as const;
export const INVENTORY_API_BASE = `/api/inventory/v1` as const;

export const DEFAULT_MUA_BUNDLE = 'openshift' as const;

export const DEFAULT_ACCESS_GROUP_ID = 'default-access' as const;
