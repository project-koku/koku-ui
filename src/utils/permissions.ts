// For resource types, see https://github.com/project-koku/koku/blob/master/koku/koku/rbac.py#L37-L43

import { routes } from 'routes';

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
export const hasAWSPermissions = async () => {
  const all = await hasPermissions('cost-management:aws.account:*');
  const read = await hasPermissions('cost-management:aws.account:read');
  const result = all || read;
  return debugPermissions('hasAWSPermissions', result);
};

// Returns true if the user has permissions for Azure
export const hasAzurePermissions = async () => {
  const all = await hasPermissions('cost-management:azure.subscription_guid:*');
  const read = await hasPermissions('cost-management:azure.subscription_guid:read');
  const result = all || read;
  return debugPermissions('hasAzurePermissions', result);
};

// Returns true if the user has permissions for cost models
export const hasCostModelPermissions = async () => {
  const all = await hasPermissions('cost-management:cost_model:*');
  const read = await hasPermissions('cost-management:cost_model:read');
  const write = await hasPermissions('cost-management:cost_model:write');
  const result = all || read || write;
  return debugPermissions('hasCostModelPermissions', result);
};

// Returns true if the user has entitlements
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
  const all = await hasPermissions('cost-management:openshift.cluster:*');
  const read = await hasPermissions('cost-management:openshift.cluster:read');
  const result = all || read;
  return debugPermissions('hasOcpClusterPermissions', result);
};

// Returns true if the user has permissions for Ocp nodes
export const hasOcpNodePermissions = async () => {
  const all = await hasPermissions('cost-management:openshift.node:*');
  const read = await hasPermissions('cost-management:openshift.node:read');
  const result = all || read;
  return debugPermissions('hasOcpNodePermissions', result);
};

// Returns true if the user has permissions for Ocp projects
export const hasOcpProjectPermissions = async () => {
  const all = await hasPermissions('cost-management:openshift.project:*');
  const read = await hasPermissions('cost-management:openshift.project:read');
  const result = all || read;
  return debugPermissions('hasOcpProjectPermissions', result);
};

// Returns true if the user has permissions for Ocp; clusters, nodes, and projects
export const hasOcpPermissions = async () => {
  const cluster = await hasOcpClusterPermissions();
  const node = await hasOcpNodePermissions();
  const project = await hasOcpProjectPermissions();
  return cluster || node || project;
};

// Returns true if the user has permissions for AWS, Azure, and Ocp
export const hasOverviewPermissions = async () => {
  const aws = await hasAWSPermissions();
  const azure = await hasAzurePermissions();
  const ocp = await hasOcpPermissions();
  return aws || azure || ocp;
};

// Returns true if the user has permissions for the given page path
export const hasPagePermissions = async (pathname: string) => {
  const currRoute = routes.find(({ path }) => path.includes(pathname));

  switch (currRoute.path) {
    case '/':
      return await hasOverviewPermissions();
    case '/cost-models':
      return await hasCostModelPermissions();
    case '/details/aws':
    case '/details/aws/breakdown':
      return await hasAWSPermissions();
    case '/details/azure':
    case '/details/azure/breakdown':
      return await hasAzurePermissions();
    case '/details/ocp':
    case '/details/ocp/breakdown':
      return await hasOcpPermissions();
    default:
      return false;
  }
};

// Returns true if the user has entitlements and is either an org admin or has permissions for the given page path
export const isPageAccessAllowed = async (pathname: string) => {
  const entitled = await hasEntitledPermissions();
  const orgAdmin = await hasOrgAdminPermissions();
  const permissions = await hasPagePermissions(pathname);
  return entitled && (orgAdmin || permissions);
};
