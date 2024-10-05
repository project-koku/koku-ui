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
import type { ComputedIbmReportItemsParams } from 'routes/utils/computedReport/getComputedIbmReportItems';
import type { ComputedOciReportItemsParams } from 'routes/utils/computedReport/getComputedOciReportItems';
import type { ComputedOcpReportItemsParams } from 'routes/utils/computedReport/getComputedOcpReportItems';
import { hasCloudProvider, hasCurrentMonthData, hasData, hasPreviousMonthData } from 'routes/utils/providers';
import {
  hasAwsAccess,
  hasAzureAccess,
  hasGcpAccess,
  hasIbmAccess,
  isAwsAvailable,
  isAzureAvailable,
  isGcpAvailable,
  isIbmAvailable,
  isOciAvailable,
  isOcpAvailable,
  isRhelAvailable,
} from 'utils/userAccess';

export const enum PerspectiveType {
  aws = 'aws',
  awsOcp = 'aws_ocp', // Aws filtered by Ocp
  azure = 'azure',
  azureOcp = 'azure_ocp', // Azure filtered by Ocp
  gcp = 'gcp',
  gcpOcp = 'gcp_ocp', // Gcp filtered by Ocp
  ibm = 'ibm',
  ibmOcp = 'ibm_ocp', // IBM filtered by Ocp
  oci = 'oci',
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
}[] = [
  { label: 'account', value: 'account' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

export const groupByAzureOptions: {
  label: string;
  value: ComputedAzureReportItemsParams['idKey'];
}[] = [
  { label: 'subscription_guid', value: 'subscription_guid' },
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

export const groupByIbmOptions: {
  label: string;
  value: ComputedIbmReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'project', value: 'project' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

export const groupByOciOptions: {
  label: string;
  value: ComputedOciReportItemsParams['idKey'];
}[] = [
  { label: 'payer_tenant_id', value: 'payer_tenant_id' },
  { label: 'product_service', value: 'product_service' },
  { label: 'region', value: 'region' },
];

export const groupByOcpOptions: {
  label: string;
  value: ComputedOcpReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
];

export const groupByRhelOptions: {
  label: string;
  value: ComputedOcpReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
];

export const getPerspectiveDefault = ({
  awsProviders,
  azureProviders,
  ociProviders,
  gcpProviders,
  ibmProviders,
  ocpProviders,
  queryFromRoute,
  rhelProviders,
  userAccess,
}: {
  awsProviders: Providers;
  azureProviders: Providers;
  ociProviders: Providers;
  gcpProviders: Providers;
  ibmProviders: Providers;
  ocpProviders: Providers;
  queryFromRoute: Query;
  rhelProviders: Providers;
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
    case PerspectiveType.ibm:
    case PerspectiveType.ibmOcp:
    case PerspectiveType.oci:
    case PerspectiveType.ocpCloud:
    case PerspectiveType.rhel:
      return perspective;
  }

  if (isOcpAvailable(userAccess, ocpProviders)) {
    return PerspectiveType.ocp;
  }
  if (isRhelAvailable(userAccess, rhelProviders)) {
    return PerspectiveType.rhel;
  }

  const hasAwsCloud = hasAwsAccess(userAccess) && hasCloudProvider(awsProviders, ocpProviders);
  const hasAzureCloud = hasAzureAccess(userAccess) && hasCloudProvider(azureProviders, ocpProviders);
  const hasGcpCloud = hasGcpAccess(userAccess) && hasCloudProvider(gcpProviders, ocpProviders);
  const hasIbmCloud = hasIbmAccess(userAccess) && hasCloudProvider(ibmProviders, ocpProviders);

  if (hasAwsCloud || hasAzureCloud || hasGcpCloud || hasIbmCloud) {
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
  if (isIbmAvailable(userAccess, ibmProviders)) {
    return PerspectiveType.ibm;
  }
  if (isOciAvailable(userAccess, ociProviders)) {
    return PerspectiveType.oci;
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
    case PerspectiveType.ibm:
      result = 'account';
      break;
    case PerspectiveType.azure:
    case PerspectiveType.azureOcp:
      result = 'subscription_guid';
      break;
    case PerspectiveType.oci:
      result = 'payer_tenant_id';
      break;
    case PerspectiveType.ocp:
    case PerspectiveType.ocpCloud:
    case PerspectiveType.rhel:
      result = 'project';
      break;
    default:
      result = undefined;
      break;
  }
  return result;
};

export const getGroupByOptions = (perspective: string, isOcpCloudGroupBysToggleEnabled) => {
  let result;
  switch (perspective) {
    case PerspectiveType.aws:
      result = groupByAwsOptions;
      break;
    case PerspectiveType.awsOcp:
      result = isOcpCloudGroupBysToggleEnabled ? [...groupByAwsOptions, ...groupByOcpOptions] : [...groupByAwsOptions];
      break;
    case PerspectiveType.azure:
      result = groupByAzureOptions;
      break;
    case PerspectiveType.azureOcp:
      result = isOcpCloudGroupBysToggleEnabled
        ? [...groupByAzureOptions, ...groupByOcpOptions]
        : [...groupByAzureOptions];
      break;
    case PerspectiveType.gcp:
      result = groupByGcpOptions;
      break;
    case PerspectiveType.gcpOcp:
      result = isOcpCloudGroupBysToggleEnabled
        ? [...groupByGcpOcpOptions, ...groupByOcpOptions]
        : [...groupByGcpOcpOptions];
      break;
    case PerspectiveType.ibm:
      result = groupByIbmOptions;
      break;
    case PerspectiveType.oci:
      result = groupByOciOptions;
      break;
    case PerspectiveType.ocp:
    case PerspectiveType.ocpCloud:
      result = groupByOcpOptions;
      break;
    case PerspectiveType.rhel:
      result = groupByRhelOptions;
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
  ociProviders,
  gcpProviders,
  ibmProviders,
  ocpProviders,
  perspective,
  rhelProviders,
}: {
  awsProviders: Providers;
  azureProviders: Providers;
  ociProviders: Providers;
  gcpProviders: Providers;
  ibmProviders: Providers;
  ocpProviders: Providers;
  perspective: string;
  rhelProviders: Providers;
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
    case PerspectiveType.ibm:
    case PerspectiveType.ibmOcp:
      isDataAvailable = hasData(ibmProviders);
      isCurrentMonthData = hasCurrentMonthData(ibmProviders);
      isPreviousMonthData = hasPreviousMonthData(ibmProviders);
      break;
    case PerspectiveType.oci:
      isDataAvailable = hasData(ociProviders);
      isCurrentMonthData = hasCurrentMonthData(ociProviders);
      isPreviousMonthData = isPreviousMonthData(ociProviders);
      break;
    case PerspectiveType.ocp:
    case PerspectiveType.ocpCloud:
      isDataAvailable = hasData(ocpProviders);
      isCurrentMonthData = hasCurrentMonthData(ocpProviders);
      isPreviousMonthData = hasPreviousMonthData(ocpProviders);
      break;
    case PerspectiveType.rhel:
      isDataAvailable = hasData(rhelProviders);
      isCurrentMonthData = hasCurrentMonthData(rhelProviders);
      isPreviousMonthData = hasPreviousMonthData(rhelProviders);
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
    case PerspectiveType.ibm:
      result = ReportPathsType.ibm;
      break;
    case PerspectiveType.oci:
      result = ReportPathsType.oci;
      break;
    case PerspectiveType.ocp:
      result = ReportPathsType.ocp;
      break;
    case PerspectiveType.ocpCloud:
      result = ReportPathsType.ocpCloud;
      break;
    case PerspectiveType.rhel:
      result = ReportPathsType.rhel;
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
    case PerspectiveType.ibm:
      return ResourcePathsType.ibm;
    case PerspectiveType.oci:
      return ResourcePathsType.oci;
    case PerspectiveType.ocp:
      return ResourcePathsType.ocp;
    case PerspectiveType.ocpCloud:
      return ResourcePathsType.ocpCloud;
    case PerspectiveType.rhel:
      return ResourcePathsType.rhel;
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
    case PerspectiveType.ibm:
      return TagPathsType.ibm;
    case PerspectiveType.oci:
      return TagPathsType.oci;
    case PerspectiveType.ocp:
      return TagPathsType.ocp;
    case PerspectiveType.ocpCloud:
      return TagPathsType.ocpCloud;
    case PerspectiveType.rhel:
      return TagPathsType.rhel;
    default:
      result = undefined;
      break;
  }
  return result;
};
