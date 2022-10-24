import type { RootState } from 'store/rootReducer';

import { stateKey } from './reducer';

export const selectRbacState = (state: RootState) => state[stateKey];

export const isCostModelWritePermission = (state: RootState) => {
  const { isOrgAdmin, permissions } = selectRbacState(state);
  if (isOrgAdmin === true) {
    return true;
  }
  if (!permissions) {
    return false;
  }
  const costModelPermissions = permissions.filter(item => item.permission.startsWith('cost-management'));
  if (!costModelPermissions) {
    return false;
  }
  // Check for multiple roles; cost-management:cost-model:read and cost-management:cost-model:write
  // See https://issues.redhat.com/browse/COST-2816
  for (const item of costModelPermissions) {
    if (hasWritePermission(item)) {
      return true;
    }
  }
  return false;
};

const hasWritePermission = costModelPermissions => {
  const [app, resource, operation] = costModelPermissions.permission.split(':');
  if (
    app === 'cost-management' &&
    (resource === 'write' || resource === '*') &&
    (operation === 'write' || operation === '*')
  ) {
    return true;
  }
  if ((resource === 'rate' || resource === 'cost_model') && (operation === 'write' || operation === '*')) {
    return true;
  }
  return false;
};
