import { RootState } from 'store/rootReducer';

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
  const costModelPermissions = permissions.find(item => item.permission.startsWith('cost-management'));
  if (!costModelPermissions) {
    return false;
  }
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
