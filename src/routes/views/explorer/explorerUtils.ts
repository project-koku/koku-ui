import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { OrgPathsType } from 'api/orgs/org';
import type { Providers } from 'api/providers';
import type { Query } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { ResourcePathsType } from 'api/resources/resource';
import { TagPathsType } from 'api/tags/tag';
import type { UserAccess } from 'api/userAccess';
import messages from 'locales/messages';
import { ComputedReportItemType, ComputedReportItemValueType } from 'routes/views/components/charts/common/chartDatum';
import { hasCloudProvider } from 'routes/views/utils/providers';
import type { ComputedAwsReportItemsParams } from 'utils/computedReport/getComputedAwsReportItems';
import type { ComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';
import type { ComputedGcpReportItemsParams } from 'utils/computedReport/getComputedGcpReportItems';
import type { ComputedIbmReportItemsParams } from 'utils/computedReport/getComputedIbmReportItems';
import type { ComputedOciReportItemsParams } from 'utils/computedReport/getComputedOciReportItems';
import type { ComputedOcpReportItemsParams } from 'utils/computedReport/getComputedOcpReportItems';
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

// eslint-disable-next-line no-shadow
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

export const dateRangeOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.explorerDateRange, value: 'current_month_to_date' },
  { label: messages.explorerDateRange, value: 'previous_month' },
  { label: messages.explorerDateRange, value: 'previous_month_to_date' },
  { label: messages.explorerDateRange, value: 'last_thirty_days' },
  { label: messages.explorerDateRange, value: 'last_sixty_days' },
  { label: messages.explorerDateRange, value: 'last_ninety_days' },
  { label: messages.explorerDateRange, value: 'custom' },
];

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

export const getComputedReportItemType = (perspective: string) => {
  let result;
  switch (perspective) {
    // Removed "OpenShift supplementary & usage" perspectives -- see https://issues.redhat.com/browse/COST-1722
    default:
      result = ComputedReportItemType.cost;
      break;
  }
  return result;
};

export const getComputedReportItemValueType = (perspective: string, groupBy, costDistribution) => {
  let result;
  switch (perspective) {
    // Removed "OpenShift usage" perspective -- see https://issues.redhat.com/browse/COST-1722
    case PerspectiveType.ocp:
      result = groupBy === 'project' ? costDistribution : ComputedReportItemValueType.total;
      break;
    default:
      result = ComputedReportItemValueType.total;
      break;
  }
  return result;
};

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

export const getGroupByOptions = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.aws:
    case PerspectiveType.awsOcp:
      result = groupByAwsOptions;
      break;
    case PerspectiveType.azure:
    case PerspectiveType.azureOcp:
      result = groupByAzureOptions;
      break;
    case PerspectiveType.gcp:
      result = groupByGcpOptions;
      break;
    case PerspectiveType.gcpOcp:
      result = groupByGcpOcpOptions;
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
      break;
    case PerspectiveType.awsOcp:
      return ResourcePathsType.awsOcp;
      break;
    case PerspectiveType.azure:
      return ResourcePathsType.azure;
      break;
    case PerspectiveType.azureOcp:
      return ResourcePathsType.azureOcp;
      break;
    case PerspectiveType.gcp:
      return ResourcePathsType.gcp;
    case PerspectiveType.gcpOcp:
      return ResourcePathsType.gcpOcp;
    case PerspectiveType.ibm:
      return ResourcePathsType.ibm;
      break;
    case PerspectiveType.oci:
      return ResourcePathsType.oci;
      break;
    case PerspectiveType.ocp:
      return ResourcePathsType.ocp;
      break;
    case PerspectiveType.ocpCloud:
      return ResourcePathsType.ocpCloud;
      break;
    case PerspectiveType.rhel:
      return ResourcePathsType.rhel;
      break;
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
      break;
    case PerspectiveType.awsOcp:
      return TagPathsType.awsOcp;
      break;
    case PerspectiveType.azure:
      return TagPathsType.azure;
      break;
    case PerspectiveType.azureOcp:
      return TagPathsType.azureOcp;
      break;
    case PerspectiveType.gcp:
      return TagPathsType.gcp;
      break;
    case PerspectiveType.gcpOcp:
      return TagPathsType.gcpOcp;
      break;
    case PerspectiveType.ibm:
      return TagPathsType.ibm;
      break;
    case PerspectiveType.oci:
      return TagPathsType.oci;
      break;
    case PerspectiveType.ocp:
      return TagPathsType.ocp;
      break;
    case PerspectiveType.ocpCloud:
      return TagPathsType.ocpCloud;
      break;
    case PerspectiveType.rhel:
      return TagPathsType.rhel;
      break;
    default:
      result = undefined;
      break;
  }
  return result;
};
