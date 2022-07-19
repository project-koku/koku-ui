import { Providers } from 'api/providers';
import { UserAccess, UserAccessType } from 'api/userAccess';

const hasAccess = (userAccess: UserAccess, userAccessType: UserAccessType) => {
  let result = false;

  if (userAccess && Array.isArray(userAccess.data)) {
    // Used with multiple types (e.g., type=)
    const data = (userAccess.data as any).find(d => d.type === userAccessType);
    result = data && data.access;
  } else {
    // Used with type=any, type=GCP, etc.
    result = userAccess && userAccess.data === true;
  }
  return result;
};

const hasProviders = (providers: Providers) => {
  let result = false;

  if (providers && providers.meta) {
    // providers API returns empty data array for no sources
    result = providers.meta.count > 0;
  }
  return result;
};

// Returns true if user has access to AWS
export const hasAwsAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.aws);
};

// Returns true if user has access to AWS and at least one source provider
export const isAwsAvailable = (userAccess: UserAccess, awsProviders: Providers) => {
  return hasAwsAccess(userAccess) && hasProviders(awsProviders);
};

// Returns true if user has access to Azure
export const hasAzureAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.azure);
};

// Returns true if user has access to Azure and at least one source provider
export const isAzureAvailable = (userAccess: UserAccess, azureProviders: Providers) => {
  return hasAzureAccess(userAccess) && hasProviders(azureProviders);
};

// Returns true if user has access to Oci
export const hasOciAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.oci);
};

// Returns true if user has access to Oci and at least one source provider
export const isOciAvailable = (userAccess: UserAccess, ociProviders: Providers) => {
  return hasOciAccess(userAccess) && hasProviders(ociProviders);
};

// Returns true if user has access to cost models
export const hasCostModelAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.cost_model);
};

// Returns true if user has access to GCP
export const hasGcpAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.gcp);
};

// Returns true if user has access to GCP and at least one source provider
export const isGcpAvailable = (userAccess: UserAccess, gcpProviders: Providers) => {
  return hasAccess(userAccess, UserAccessType.gcp) && hasProviders(gcpProviders);
};

// Returns true if user has access to IBM
export const hasIbmAccess = (userAccess: UserAccess) => {
  return hasGcpAccess(userAccess);
};

// Returns true if user has access to IBM and at least one source provider
export const isIbmAvailable = (userAccess: UserAccess, ibmProviders: Providers) => {
  return hasIbmAccess(userAccess) && hasProviders(ibmProviders);
};

// Returns true if user has access to OCP
export const hasOcpAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.ocp);
};

// Returns true if user has access to OCP and at least one source provider
export const isOcpAvailable = (userAccess: UserAccess, ocpProviders: Providers) => {
  return hasOcpAccess(userAccess) && hasProviders(ocpProviders);
};
