// For resource types, see https://github.com/project-koku/koku/blob/main/koku/koku/rbac.py#L37-L43

import { paths, routes } from 'routes';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const debugUserPermissions = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userPermissions = await insights.chrome.getUserPermissions('cost-management');
  if (userPermissions) {
    for (const item of userPermissions) {
      // eslint-disable-next-line no-console
      console.log(item);
    }
  }
};

const debug = false; // For testing purposes
const debugPermissions = (name, result) => {
  if (debug) {
    // eslint-disable-next-line no-console
    console.log(`${name}: ${result}`);
  }
  return result;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const hasPermissions = permissions => insights.chrome.visibilityFunctions.hasPermissions([permissions]);

// Returns true if the user has permissions for AWS
export const hasAwsPermissions = async () => {
  const wildcard = await hasPermissions('cost-management:*:*');
  const all = await hasPermissions('cost-management:aws.account:*');
  const read = await hasPermissions('cost-management:aws.account:read');
  const result = wildcard || all || read;
  return debugPermissions('hasAwsPermissions', result);
};

// Returns true if the user has permissions for Azure
export const hasAzurePermissions = async () => {
  const wildcard = await hasPermissions('cost-management:*:*');
  const all = await hasPermissions('cost-management:azure.subscription_guid:*');
  const read = await hasPermissions('cost-management:azure.subscription_guid:read');
  const result = wildcard || all || read;
  return debugPermissions('hasAzurePermissions', result);
};

// Returns true if the user has permissions for GCP
export const hasGcpPermissions = async () => {
  const wildcard = await hasPermissions('cost-management:*:*');
  const all = await hasPermissions('cost-management:aws.account:*');
  const read = await hasPermissions('cost-management:aws.account:read');
  const result = wildcard || all || read;
  return debugPermissions('hasGcpPermissions', result);
};

// Returns true if the user has permissions for cost models
export const hasCostModelPermissions = async () => {
  const wildcard = await hasPermissions('cost-management:*:*');
  const costModelAll = await hasPermissions('cost-management:cost_model:*');
  const costModelRead = await hasPermissions('cost-management:cost_model:read');
  const costModelWrite = await hasPermissions('cost-management:cost_model:write');
  const rateAll = await hasPermissions('cost-management:rate:*');
  const rateRead = await hasPermissions('cost-management:rate:read');
  const rateWrite = await hasPermissions('cost-management:rate:write');
  const costModelResult = wildcard || costModelAll || costModelRead || costModelWrite;
  const rateResult = wildcard || rateAll || rateRead || rateWrite;
  const result = costModelResult || rateResult;
  return debugPermissions('hasCostModelPermissions', result);
};

// Returns true if the user is entitled to access Cost Management
export const hasEntitledPermissions = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result = await insights.chrome.visibilityFunctions.isEntitled('cost_management');
  return debugPermissions('isEntitled', result);
};

// Returns true if the user is an org admin
export const hasOrgAdminPermissions = async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result = await insights.chrome.visibilityFunctions.isOrgAdmin();
  return debugPermissions('isOrgAdmin', result);
};

// Returns true if the user has permissions for Ocp clusters
export const hasOcpClusterPermissions = async () => {
  const wildcard = await hasPermissions('cost-management:*:*');
  const all = await hasPermissions('cost-management:openshift.cluster:*');
  const read = await hasPermissions('cost-management:openshift.cluster:read');
  const result = wildcard || all || read;
  return debugPermissions('hasOcpClusterPermissions', result);
};

// Returns true if the user has permissions for Ocp nodes
export const hasOcpNodePermissions = async () => {
  const wildcard = await hasPermissions('cost-management:*:*');
  const all = await hasPermissions('cost-management:openshift.node:*');
  const read = await hasPermissions('cost-management:openshift.node:read');
  const result = wildcard || all || read;
  return debugPermissions('hasOcpNodePermissions', result);
};

// Returns true if the user has permissions for Ocp projects
export const hasOcpProjectPermissions = async () => {
  const wildcard = await hasPermissions('cost-management:*:*');
  const all = await hasPermissions('cost-management:openshift.project:*');
  const read = await hasPermissions('cost-management:openshift.project:read');
  const result = wildcard || all || read;
  return debugPermissions('hasOcpProjectPermissions', result);
};

// Returns true if the user has permissions for Ocp; clusters, nodes, and projects
export const hasOcpPermissions = async () => {
  const cluster = await hasOcpClusterPermissions();
  const node = await hasOcpNodePermissions();
  const project = await hasOcpProjectPermissions();
  return cluster || node || project;
};

// Returns true if the user has permissions for AWS, Azure, Gcp, and Ocp
export const hasOverviewPermissions = async () => {
  const aws = await hasAwsPermissions();
  const azure = await hasAzurePermissions();
  const gcp = await hasGcpPermissions();
  const ocp = await hasOcpPermissions();
  return aws || azure || gcp || ocp;
};

// Returns true if the user has permissions for the given page path
export const hasPagePermissions = async (pathname: string) => {
  // cost models may include :uuid
  const _pathname = pathname.includes(paths.costModels) ? paths.costModels : pathname;
  const currRoute = routes.find(({ path }) => path.includes(_pathname));

  switch (currRoute.path) {
    case paths.overview:
      return await hasOverviewPermissions();
    case paths.costModels:
      return await hasCostModelPermissions();
    case paths.awsDetails:
    case paths.awsDetailsBreakdown:
      return await hasAwsPermissions();
    case paths.azureDetails:
    case paths.azureDetailsBreakdown:
      return await hasAzurePermissions();
    case paths.gcpDetails:
    case paths.gcpDetailsBreakdown:
      return await hasGcpPermissions();
    case paths.ocpDetails:
    case paths.ocpDetailsBreakdown:
      return await hasOcpPermissions();
    default:
      return false;
  }
};
