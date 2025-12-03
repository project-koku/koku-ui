import type { RootState } from '../rootReducer';
import { stateKey } from './reducer';

export const selectRbacState = (state: RootState) => state[stateKey];

export const selectRbacStatus = (state: RootState) => selectRbacState(state).status;

export const selectRbacError = (state: RootState) => selectRbacState(state).error;

export const selectRbacNotification = (state: RootState) => selectRbacState(state).notification;

export const isCostModelWritePermission = (state: RootState) => {
  const { isOrgAdmin, permissions } = selectRbacState(state);
  if (isOrgAdmin === true) {
    return true;
  }
  if (!permissions) {
    return false;
  }
  const costManagementPermissions = permissions.filter(item => item.permission.startsWith('cost-management'));
  if (!costManagementPermissions) {
    return false;
  }
  // Check for multiple roles; cost-management:cost-model:read and cost-management:cost-model:write
  // See https://issues.redhat.com/browse/COST-2816
  for (const item of costManagementPermissions) {
    if (hasCostModelWritePermission(item)) {
      return true;
    }
  }
  return false;
};

export const isSettingsWritePermission = (state: RootState) => {
  const { isOrgAdmin, permissions } = selectRbacState(state);
  if (isOrgAdmin === true) {
    return true;
  }
  if (!permissions) {
    return false;
  }
  const costManagementPermissions = permissions.filter(item => item.permission.startsWith('cost-management'));
  if (!costManagementPermissions) {
    return false;
  }
  // Check for multiple roles; cost-management:cost-model:read and cost-management:cost-model:write
  // See https://issues.redhat.com/browse/COST-2816
  for (const item of costManagementPermissions) {
    if (hasSettingsWritePermission(item)) {
      return true;
    }
  }
  return false;
};

const hasCostModelWritePermission = costManagementPermissions => {
  const [app, resource, operation] = costManagementPermissions.permission.split(':');
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

const hasSettingsWritePermission = costManagementPermissions => {
  const [app, resource, operation] = costManagementPermissions.permission.split(':');
  if (
    app === 'cost-management' &&
    (resource === 'write' || resource === '*') &&
    (operation === 'write' || operation === '*')
  ) {
    return true;
  }
  if (resource === 'settings' && (operation === 'write' || operation === '*')) {
    return true;
  }
  return false;
};
