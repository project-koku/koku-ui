import { OrgPathsType } from 'api/orgs/org';
import { Providers } from 'api/providers';
import { getQueryRoute, Query } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { ResourcePathsType } from 'api/resources/resource';
import { TagPathsType } from 'api/tags/tag';
import { UserAccess } from 'api/userAccess';
import { ComputedReportItemType, ComputedReportItemValueType } from 'components/charts/common/chartDatumUtils';
import { format } from 'date-fns';
import { FetchStatus } from 'store/common';
import { ComputedAwsReportItemsParams } from 'utils/computedReport/getComputedAwsReportItems';
import { ComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';
import { ComputedGcpReportItemsParams } from 'utils/computedReport/getComputedGcpReportItems';
import { ComputedIbmReportItemsParams } from 'utils/computedReport/getComputedIbmReportItems';
import { ComputedOcpReportItemsParams } from 'utils/computedReport/getComputedOcpReportItems';
import { getCurrentMonthDate, getLast30DaysDate, getLast60DaysDate } from 'utils/dateRange';
import { isAwsAvailable, isAzureAvailable, isGcpAvailable, isIbmAvailable, isOcpAvailable } from 'utils/userAccess';

// The date range drop down has the options below (if today is Jan 18th…)
// eslint-disable-next-line no-shadow
export const enum DateRangeType {
  currentMonthToDate = 'current_month_to_date', // Current month (Jan 1 - Jan 18)
  previousMonthToDate = 'previous_month_to_date', // Previous and current month (Dec 1 - Jan 18)
  lastThirtyDays = 'last_thirty_days', // Last 30 days (Dec 18 - Jan 17)
  lastSixtyDays = 'last_sixty_days', // Last 60 days (Nov 18 - Jan 17)
}

// eslint-disable-next-line no-shadow
export const enum PerspectiveType {
  aws = 'aws',
  awsOcp = 'aws_ocp', // Aws filtered by Ocp
  azure = 'azure',
  azureOcp = 'azure_ocp', // Azure filtered by Ocp
  gcp = 'gcp',
  gcpOcp = 'gcp_ocp', // Gcp filtered by Ocp
  ocp = 'ocp',
  ibm = 'ibm',
  ocpCloud = 'ocp_cloud', // All filtered by Ocp
  ocpSupplementary = 'ocp_supplementary',
  ocpUsage = 'ocp_usage',
}

export const baseQuery: Query = {
  filter: {
    limit: 10,
    offset: 0,
  },
  filter_by: {},
  order_by: {
    cost: 'desc',
  },
};

export const dateRangeOptions: {
  label: string;
  value: string;
}[] = [
  { label: 'explorer.date_range.current_month_to_date', value: 'current_month_to_date' },
  { label: 'explorer.date_range.previous_month_to_date', value: 'previous_month_to_date' },
  { label: 'explorer.date_range.last_thirty_days', value: 'last_thirty_days' },
  { label: 'explorer.date_range.last_sixty_days', value: 'last_sixty_days' },
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
  { label: 'project', value: 'project' },
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

export const groupByOcpOptions: {
  label: string;
  value: ComputedOcpReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
];

// Infrastructure AWS options
export const infrastructureAwsOptions = [{ label: 'explorer.perspective.aws', value: 'aws' }];

// Infrastructure AWS filtered by OpenShift options
export const infrastructureAwsOcpOptions = [{ label: 'explorer.perspective.aws_ocp', value: 'aws_ocp' }];

// Infrastructure Azure options
export const infrastructureAzureOptions = [{ label: 'explorer.perspective.azure', value: 'azure' }];

// Infrastructure Azure filtered by OpenShift options
export const infrastructureAzureOcpOptions = [{ label: 'explorer.perspective.azure_ocp', value: 'azure_ocp' }];

// Infrastructure GCP options
export const infrastructureGcpOptions = [{ label: 'explorer.perspective.gcp', value: 'gcp' }];

// Infrastructure GCP filtered by OpenShift options
export const infrastructureGcpOcpOptions = [{ label: 'explorer.perspective.gcp_ocp', value: 'gcp_ocp' }];

// Infrastructure IBM options
export const infrastructureIbmOptions = [{ label: 'explorer.perspective.ibm', value: 'ibm' }];

// Infrastructure Ocp options
export const infrastructureOcpOptions = [{ label: 'explorer.perspective.ocp_usage', value: 'ocp_usage' }];

// Infrastructure Ocp cloud options
export const infrastructureOcpCloudOptions = [{ label: 'explorer.perspective.ocp_cloud', value: 'ocp_cloud' }];

// Ocp options
export const ocpOptions = [
  { label: 'explorer.perspective.ocp', value: 'ocp' },
  { label: 'explorer.perspective.ocp_supplementary', value: 'ocp_supplementary' },
];

export const getComputedReportItemType = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.ocpSupplementary:
      result = ComputedReportItemType.supplementary;
      break;
    case PerspectiveType.ocpUsage:
      result = ComputedReportItemType.infrastructure;
      break;
    default:
      result = ComputedReportItemType.cost;
      break;
  }
  return result;
};

export const getComputedReportItemValueType = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.ocpUsage:
      result = ComputedReportItemValueType.usage;
      break;
    default:
      result = ComputedReportItemValueType.total;
      break;
  }
  return result;
};

export const getDateRange = (dateRangeType: DateRangeType) => {
  const endDate = new Date();
  const startDate = new Date();
  let dateRange;

  switch (dateRangeType) {
    case DateRangeType.previousMonthToDate:
      startDate.setDate(1); // Required to obtain correct month
      startDate.setMonth(startDate.getMonth() - 1); // Note: Must include previous and current month

      dateRange = {
        end_date: format(endDate, 'yyyy-MM-dd'),
        start_date: format(startDate, 'yyyy-MM-dd'),
      };
      break;
    case DateRangeType.lastSixtyDays:
      dateRange = getLast60DaysDate();
      break;
    case DateRangeType.lastThirtyDays:
      dateRange = getLast30DaysDate();
      break;
    case DateRangeType.currentMonthToDate:
    default:
      dateRange = getCurrentMonthDate();
      break;
  }
  return dateRange;
};

export const getDateRangeDefault = (queryFromRoute: Query) => {
  return queryFromRoute.dateRange || DateRangeType.currentMonthToDate;
};

export const getPerspectiveDefault = ({
  awsProviders,
  awsProvidersFetchStatus,
  azureProviders,
  azureProvidersFetchStatus,
  gcpProviders,
  gcpProvidersFetchStatus,
  ibmProviders,
  ibmProvidersFetchStatus,
  ocpProviders,
  ocpProvidersFetchStatus,
  queryFromRoute,
  userAccess,
}: {
  awsProviders: Providers;
  awsProvidersFetchStatus: FetchStatus;
  azureProviders: Providers;
  azureProvidersFetchStatus: FetchStatus;
  gcpProviders: Providers;
  gcpProvidersFetchStatus: FetchStatus;
  ibmProviders: Providers;
  ibmProvidersFetchStatus: FetchStatus;
  ocpProviders: Providers;
  ocpProvidersFetchStatus: FetchStatus;
  queryFromRoute: Query;
  userAccess: UserAccess;
}) => {
  let result = queryFromRoute.perspective;

  if (!result) {
    if (isOcpAvailable(userAccess, ocpProviders, ocpProvidersFetchStatus)) {
      result = PerspectiveType.ocp;
    } else if (isAwsAvailable(userAccess, awsProviders, awsProvidersFetchStatus)) {
      result = PerspectiveType.aws;
    } else if (isAzureAvailable(userAccess, azureProviders, azureProvidersFetchStatus)) {
      result = PerspectiveType.azure;
    } else if (isGcpAvailable(userAccess, gcpProviders, gcpProvidersFetchStatus)) {
      result = PerspectiveType.gcp;
    } else if (isIbmAvailable(userAccess, ibmProviders, ibmProvidersFetchStatus)) {
      result = PerspectiveType.ibm;
    }
  }
  return result;
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
    case PerspectiveType.ocp:
    case PerspectiveType.ocpCloud:
    case PerspectiveType.ocpSupplementary:
    case PerspectiveType.ocpUsage:
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
    case PerspectiveType.gcpOcp:
      result = groupByGcpOptions;
      break;
    case PerspectiveType.ibm:
      result = groupByIbmOptions;
      break;
    case PerspectiveType.ocp:
    case PerspectiveType.ocpCloud:
    case PerspectiveType.ocpSupplementary:
    case PerspectiveType.ocpUsage:
      result = groupByOcpOptions;
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
    case PerspectiveType.ocp:
      result = ReportPathsType.ocp;
      break;
    case PerspectiveType.ocpCloud:
      result = ReportPathsType.ocpCloud;
      break;
    case PerspectiveType.ocpSupplementary:
      result = ReportPathsType.ocp;
      break;
    case PerspectiveType.ocpUsage:
      result = ReportPathsType.ocpUsage;
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
    case PerspectiveType.ocp:
    case PerspectiveType.ocpSupplementary:
    case PerspectiveType.ocpUsage:
      return ResourcePathsType.ocp;
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
    case PerspectiveType.ocp:
    case PerspectiveType.ocpSupplementary:
    case PerspectiveType.ocpUsage:
      return TagPathsType.ocp;
      break;
    case PerspectiveType.ocpCloud:
      return TagPathsType.ocpCloud;
      break;
    default:
      result = undefined;
      break;
  }
  return result;
};

export const getRouteForQuery = (history, query: Query, reset: boolean = false) => {
  // Reset pagination
  if (reset) {
    query.filter = {
      ...query.filter,
      offset: baseQuery.filter.offset,
    };
  }
  return `${history.location.pathname}?${getQueryRoute(query)}`;
};
