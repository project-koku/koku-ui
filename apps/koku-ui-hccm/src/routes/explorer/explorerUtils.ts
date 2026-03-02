import { OrgPathsType } from 'api/orgs/org';
import type { Providers } from 'api/providers';
import type { Query } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { ResourcePathsType } from 'api/resources/resource';
import { TagPathsType } from 'api/tags/tag';
import type { UserAccess } from 'api/userAccess';
import type { ComputedAwsReportItemsParams } from 'routes/utils/computedReport/getComputedAwsReportItems';
import type { ComputedAzureReportItemsParams } from 'routes/utils/computedReport/getComputedAzureReportItems';
import type { ComputedGcpReportItemsParams } from 'routes/utils/computedReport/getComputedGcpReportItems';
import type { ComputedOcpReportItemsParams } from 'routes/utils/computedReport/getComputedOcpReportItems';
import { hasCloudProvider, hasCurrentMonthData, hasData, hasPreviousMonthData } from 'routes/utils/providers';
import {
  hasAwsAccess,
  hasAzureAccess,
  hasGcpAccess,
  isAwsAvailable,
  isAzureAvailable,
  isGcpAvailable,
  isOcpAvailable,
} from 'utils/userAccess';

export const enum PerspectiveType {
  aws = 'aws',
  awsOcp = 'aws_ocp', // Aws filtered by Ocp
  azure = 'azure',
  azureOcp = 'azure_ocp', // Azure filtered by Ocp
  gcp = 'gcp',
  gcpOcp = 'gcp_ocp', // Gcp filtered by Ocp
  ocp = 'ocp',
  ocpCloud = 'ocp_cloud', // All filtered by Ocp
  rhel = 'rhel',
}

export const baseQuery: Query = {
  filter: {
    limit: 10,
    offset: 0,
  },
  exclude: {},
  filter_by: {},
  order_by: {
    cost: 'desc',
  },
};

export const groupByAwsOptions: {
  label: string;
  value: ComputedAwsReportItemsParams['idKey'];
  resourceKey?: string;
}[] = [
  { label: 'account', value: 'account', resourceKey: 'account_alias' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

export const groupByAzureOptions: {
  label: string;
  value: ComputedAzureReportItemsParams['idKey'];
  resourceKey?: string;
}[] = [
  { label: 'subscription_guid', value: 'subscription_guid', resourceKey: 'account_alias' },
  { label: 'service_name', value: 'service_name' },
  { label: 'resource_location', value: 'resource_location' },
];

export const groupByGcpOptions: {
  label: string;
  value: ComputedGcpReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'gcp_project', value: 'gcp_project' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

export const groupByGcpOcpOptions: {
  label: string;
  value: ComputedGcpReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'gcp_project', value: 'gcp_project' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

export const groupByOcpOptions: {
  label: string;
  value: ComputedOcpReportItemsParams['idKey'];
  resourceKey?: string;
}[] = [
  { label: 'cluster', value: 'cluster', resourceKey: 'cluster_alias' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
];

export const getPerspectiveDefault = ({
  awsProviders,
  azureProviders,
  gcpProviders,
  ocpProviders,
  queryFromRoute,
  userAccess,
}: {
  awsProviders: Providers;
  azureProviders: Providers;
  gcpProviders: Providers;
  ocpProviders: Providers;
  queryFromRoute: Query;
  userAccess: UserAccess;
}) => {
  const perspective = queryFromRoute.perspective;

  // Upon page refresh, perspective param takes precedence
  // Todo: Add ocp here?
  switch (perspective) {
    case PerspectiveType.aws:
    case PerspectiveType.awsOcp:
    case PerspectiveType.azure:
    case PerspectiveType.azureOcp:
    case PerspectiveType.gcp:
    case PerspectiveType.gcpOcp:
    case PerspectiveType.ocpCloud:
      return perspective;
  }

  if (isOcpAvailable(userAccess, ocpProviders)) {
    return PerspectiveType.ocp;
  }

  const hasAwsCloud = hasAwsAccess(userAccess) && hasCloudProvider(awsProviders, ocpProviders);
  const hasAzureCloud = hasAzureAccess(userAccess) && hasCloudProvider(azureProviders, ocpProviders);
  const hasGcpCloud = hasGcpAccess(userAccess) && hasCloudProvider(gcpProviders, ocpProviders);

  if (hasAwsCloud || hasAzureCloud || hasGcpCloud) {
    return PerspectiveType.ocpCloud;
  }
  if (isAwsAvailable(userAccess, awsProviders)) {
    return PerspectiveType.aws;
  }
  if (isAzureAvailable(userAccess, azureProviders)) {
    return PerspectiveType.azure;
  }
  if (isGcpAvailable(userAccess, gcpProviders)) {
    return PerspectiveType.gcp;
  }
  return undefined;
};

export const getGroupByDefault = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.aws:
    case PerspectiveType.awsOcp:
    case PerspectiveType.gcp:
    case PerspectiveType.gcpOcp:
      result = 'account';
      break;
    case PerspectiveType.azure:
    case PerspectiveType.azureOcp:
      result = 'subscription_guid';
      break;
    case PerspectiveType.ocp:
    case PerspectiveType.ocpCloud:
      result = 'project';
      break;
    default:
      result = undefined;
      break;
  }
  return result;
};

export const getGroupByOptions = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.aws:
      result = groupByAwsOptions;
      break;
    case PerspectiveType.awsOcp:
      result = [...groupByAwsOptions, ...groupByOcpOptions];
      break;
    case PerspectiveType.azure:
      result = groupByAzureOptions;
      break;
    case PerspectiveType.azureOcp:
      result = [...groupByAzureOptions, ...groupByOcpOptions];
      break;
    case PerspectiveType.gcp:
      result = groupByGcpOptions;
      break;
    case PerspectiveType.gcpOcp:
      result = [...groupByGcpOcpOptions, ...groupByOcpOptions];
      break;
    case PerspectiveType.ocp:
    case PerspectiveType.ocpCloud:
      result = groupByOcpOptions;
      break;
    default:
      result = undefined;
      break;
  }
  return result;
};

export const getIsDataAvailable = ({
  awsProviders,
  azureProviders,
  gcpProviders,
  ocpProviders,
  perspective,
}: {
  awsProviders: Providers;
  azureProviders: Providers;
  gcpProviders: Providers;
  ocpProviders: Providers;
  perspective: string;
}) => {
  let isCurrentMonthData;
  let isDataAvailable;
  let isPreviousMonthData;

  switch (perspective) {
    case PerspectiveType.aws:
    case PerspectiveType.awsOcp:
      isDataAvailable = hasData(awsProviders);
      isCurrentMonthData = hasCurrentMonthData(awsProviders);
      isPreviousMonthData = hasPreviousMonthData(awsProviders);
      break;
    case PerspectiveType.azure:
    case PerspectiveType.azureOcp:
      isDataAvailable = hasData(azureProviders);
      isCurrentMonthData = hasCurrentMonthData(azureProviders);
      isPreviousMonthData = hasPreviousMonthData(azureProviders);
      break;
    case PerspectiveType.gcp:
    case PerspectiveType.gcpOcp:
      isDataAvailable = hasData(gcpProviders);
      isCurrentMonthData = hasCurrentMonthData(gcpProviders);
      isPreviousMonthData = hasPreviousMonthData(gcpProviders);
      break;
    case PerspectiveType.ocp:
    case PerspectiveType.ocpCloud:
      isDataAvailable = hasData(ocpProviders);
      isCurrentMonthData = hasCurrentMonthData(ocpProviders);
      isPreviousMonthData = hasPreviousMonthData(ocpProviders);
      break;
  }
  return {
    isCurrentMonthData,
    isDataAvailable,
    isPreviousMonthData,
  };
};

export const getOrgReportPathsType = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.aws:
      result = OrgPathsType.aws;
      break;
    default:
      result = undefined;
      break;
  }
  return result;
};

export const getReportType = (perspective: string) => {
  let result;
  switch (perspective) {
    default:
      result = ReportType.cost;
      break;
  }
  return result;
};

export const getReportPathsType = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.aws:
      result = ReportPathsType.aws;
      break;
    case PerspectiveType.awsOcp:
      result = ReportPathsType.awsOcp;
      break;
    case PerspectiveType.azure:
      result = ReportPathsType.azure;
      break;
    case PerspectiveType.azureOcp:
      result = ReportPathsType.azureOcp;
      break;
    case PerspectiveType.gcp:
      result = ReportPathsType.gcp;
      break;
    case PerspectiveType.gcpOcp:
      result = ReportPathsType.gcpOcp;
      break;
    case PerspectiveType.ocp:
      result = ReportPathsType.ocp;
      break;
    case PerspectiveType.ocpCloud:
      result = ReportPathsType.ocpCloud;
      break;
    default:
      result = undefined;
      break;
  }
  return result;
};

export const getResourcePathsType = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.aws:
      return ResourcePathsType.aws;
    case PerspectiveType.awsOcp:
      return ResourcePathsType.awsOcp;
    case PerspectiveType.azure:
      return ResourcePathsType.azure;
    case PerspectiveType.azureOcp:
      return ResourcePathsType.azureOcp;
    case PerspectiveType.gcp:
      return ResourcePathsType.gcp;
    case PerspectiveType.gcpOcp:
      return ResourcePathsType.gcpOcp;
    case PerspectiveType.ocp:
      return ResourcePathsType.ocp;
    case PerspectiveType.ocpCloud:
      return ResourcePathsType.ocpCloud;
    default:
      result = undefined;
      break;
  }
  return result;
};

export const getTagReportPathsType = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.aws:
      return TagPathsType.aws;
    case PerspectiveType.awsOcp:
      return TagPathsType.awsOcp;
    case PerspectiveType.azure:
      return TagPathsType.azure;
    case PerspectiveType.azureOcp:
      return TagPathsType.azureOcp;
    case PerspectiveType.gcp:
      return TagPathsType.gcp;
    case PerspectiveType.gcpOcp:
      return TagPathsType.gcpOcp;
    case PerspectiveType.ocp:
      return TagPathsType.ocp;
    case PerspectiveType.ocpCloud:
      return TagPathsType.ocpCloud;
    default:
      result = undefined;
      break;
  }
  return result;
};
