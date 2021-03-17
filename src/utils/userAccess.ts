import { Providers } from 'api/providers';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { FetchStatus } from 'store/common';

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

const hasProviders = (providers: Providers, providersFetchStatus: FetchStatus) => {
  let result = false;
  if (providersFetchStatus === FetchStatus.complete) {
    // providers API returns empty data array for no sources
    result = providers !== undefined && providers.meta !== undefined && providers.meta.count > 0;
  }
  return result;
};

// Returns true if user has access to AWS
export const hasAwsAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.aws);
};

// Returns true if user has access to AWS and at least one source provider
export const isAwsAvailable = (
  userAccess: UserAccess,
  awsProviders: Providers,
  awsProvidersFetchStatus: FetchStatus
) => {
  return hasAwsAccess(userAccess) && hasProviders(awsProviders, awsProvidersFetchStatus);
};

// Returns true if user has access to Azure
export const hasAzureAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.azure);
};

// Returns true if user has access to Azure and at least one source provider
export const isAzureAvailable = (
  userAccess: UserAccess,
  azureProviders: Providers,
  azureProvidersFetchStatus: FetchStatus
) => {
  return hasAzureAccess(userAccess) && hasProviders(azureProviders, azureProvidersFetchStatus);
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
export const isGcpAvailable = (
  userAccess: UserAccess,
  gcpProviders: Providers,
  gcpsProvidersFetchStatus: FetchStatus
) => {
  return hasAccess(userAccess, UserAccessType.gcp) && hasProviders(gcpProviders, gcpsProvidersFetchStatus);
};

// Returns true if user has access to IBM
export const hasIbmAccess = (userAccess: UserAccess) => {
  return hasGcpAccess(userAccess);
};

// Returns true if user has access to IBM and at least one source provider
export const isIbmAvailable = (
  userAccess: UserAccess,
  ibmProviders: Providers,
  ibmProvidersFetchStatus: FetchStatus
) => {
  return hasIbmAccess(userAccess) && hasProviders(ibmProviders, ibmProvidersFetchStatus);
};

// Returns true if user has access to OCP
export const hasOcpAccess = (userAccess: UserAccess) => {
  return hasAccess(userAccess, UserAccessType.ocp);
};

// Returns true if user has access to OCP and at least one source provider
export const isOcpAvailable = (
  userAccess: UserAccess,
  ocpProviders: Providers,
  ocpProvidersFetchStatus: FetchStatus
) => {
  return hasOcpAccess(userAccess) && hasProviders(ocpProviders, ocpProvidersFetchStatus);
};
