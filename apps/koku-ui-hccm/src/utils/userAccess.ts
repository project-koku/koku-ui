import type { Providers } from 'api/providers';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';

const hasAccess = (userAccess: UserAccess, userAccessType: UserAccessType) => {
  let result = userAccess?.data === true; // Used with type=any, type=GCP, etc.

  if (userAccess && Array.isArray(userAccess.data)) {
    // Used with multiple types (e.g., type=)
    const data = userAccess.data.find(d => d.type === userAccessType);
    result = data?.access === true;
  }
  return result;
};

const hasWritePermission = (userAccess: UserAccess, userAccessType: UserAccessType) => {
  let result = userAccess?.data === true; // Used with type=any, type=GCP, etc.

  if (userAccess && Array.isArray(userAccess.data)) {
    // Used with multiple types (e.g., type=)
    const data = userAccess.data.find(d => d.type === userAccessType);
    result = data?.write === true;
  }
  return result;
};

const hasProviders = (providers: Providers) => {
  let result = false;

  if (providers?.meta) {
    // providers API returns empty data array for no sources
    result = providers.meta.count > 0;
  }
  return result;
};

// Returns true if user has access to AWS
export const hasAwsAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.aws);
};

// Returns true if user has write permission for AWS
export const hasAwsWritePermission = (userAccess: UserAccess) => {
  return hasWritePermission(userAccess, UserAccessType.aws);
};

// Returns true if user has access to AWS and at least one source provider
export const isAwsAvailable = (userAccess: UserAccess, awsProviders: Providers) => {
  return hasAwsAccess(userAccess) && hasProviders(awsProviders);
};

// Returns true if user has access to Azure
export const hasAzureAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.azure);
};

// Returns true if user has write permission for Azure
export const hasAzureWritePermission = (userAccess: UserAccess) => {
  return hasWritePermission(userAccess, UserAccessType.azure);
};

// Returns true if user has access to Azure and at least one source provider
export const isAzureAvailable = (userAccess: UserAccess, azureProviders: Providers) => {
  return hasAzureAccess(userAccess) && hasProviders(azureProviders);
};

// Returns true if user has access to cost models
export const hasCostModelAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.costModel);
};

// Returns true if user has cost model write permission
export const hasCostModelWritePermission = (userAccess: UserAccess) => {
  return hasWritePermission(userAccess, UserAccessType.costModel);
};

// Returns true if user has access to GCP
export const hasGcpAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.gcp);
};

// Returns true if user has write permission for GCP
export const hasGcpWritePermission = (userAccess: UserAccess) => {
  return hasWritePermission(userAccess, UserAccessType.gcp);
};

// Returns true if user has access to GCP and at least one source provider
export const isGcpAvailable = (userAccess: UserAccess, gcpProviders: Providers) => {
  return hasAccess(userAccess, UserAccessType.gcp) && hasProviders(gcpProviders);
};

// Returns true if user has access to OCP
export const hasOcpAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.ocp);
};

// Returns true if user has write permission for OCP
export const hasOcpWritePermission = (userAccess: UserAccess) => {
  return hasWritePermission(userAccess, UserAccessType.ocp);
};

// Returns true if user has access to OCP and at least one source provider
export const isOcpAvailable = (userAccess: UserAccess, ocpProviders: Providers) => {
  return hasOcpAccess(userAccess) && hasProviders(ocpProviders);
};

// Returns true if user has access to settings tabs
export const hasSettingsAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.settings);
};

// Returns true if user has write permission for settings
export const hasSettingsWritePermission = (userAccess: UserAccess) => {
  return hasWritePermission(userAccess, UserAccessType.settings);
};
