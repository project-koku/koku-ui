import type { Access } from '@redhat-cloud-services/rbac-client/types';

export interface RBAC {
  isOrgAdmin: boolean;
  permissions: Access[];
}

export type RBACFunction = () => Promise<RBAC>;

export let getRBAC: RBACFunction;

export function setRBACFunction(fn: RBACFunction) {
  getRBAC = fn;
}
