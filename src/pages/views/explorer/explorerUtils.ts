import { OrgPathsType } from 'api/orgs/org';
import { Providers } from 'api/providers';
import { getQueryRoute, Query } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { ComputedReportItemType } from 'components/charts/common/chartDatumUtils';
import { format, startOfMonth } from 'date-fns';
import { FetchStatus } from 'store/common';
import { ComputedAwsReportItemsParams } from 'utils/computedReport/getComputedAwsReportItems';
import { ComputedAzureReportItemsParams } from 'utils/computedReport/getComputedAzureReportItems';
import { ComputedGcpReportItemsParams } from 'utils/computedReport/getComputedGcpReportItems';
import { ComputedOcpReportItemsParams } from 'utils/computedReport/getComputedOcpReportItems';

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
  allCloud = 'all_cloud', // All filtered by Ocp
  aws = 'aws',
  awsCloud = 'aws_cloud', // Aws filtered by Ocp
  azure = 'azure',
  azureCloud = 'azure_cloud', // Azure filtered by Ocp
  gcp = 'gcp',
  ocp = 'ocp',
  ocpSupplementary = 'ocp_supplementary',
  ocpUsage = 'ocp_usage',
}

export const baseQuery: Query = {
  filter: {
    limit: 10,
    offset: 0,
  },
  filter_by: {},
  group_by: {
    account: '*',
  },
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

export const groupByOcpOptions: {
  label: string;
  value: ComputedOcpReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
];

// Infrastructure all cloud options
export const infrastructureAllCloudOptions = [{ label: 'explorer.perspective.all_cloud', value: 'all_cloud' }];

// Infrastructure AWS options
export const infrastructureAwsOptions = [{ label: 'explorer.perspective.aws', value: 'aws' }];

// Infrastructure AWS cloud options
export const infrastructureAwsCloudOptions = [{ label: 'explorer.perspective.aws_cloud', value: 'aws_cloud' }];

// Infrastructure Azure options
export const infrastructureAzureOptions = [{ label: 'explorer.perspective.azure', value: 'azure' }];

// Infrastructure Azure cloud options
export const infrastructureAzureCloudOptions = [{ label: 'explorer.perspective.azure_cloud', value: 'azure_cloud' }];

// Infrastructure GCP options
export const infrastructureGcpOptions = [{ label: 'explorer.perspective.gcp', value: 'gcp' }];

// Infrastructure Ocp options
export const infrastructureOcpOptions = [{ label: 'explorer.perspective.ocp_usage', value: 'ocp_usage' }];

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
    case PerspectiveType.aws:
    case PerspectiveType.allCloud:
    case PerspectiveType.awsCloud:
    case PerspectiveType.azure:
    case PerspectiveType.azureCloud:
    case PerspectiveType.gcp:
    case PerspectiveType.ocp:
    case PerspectiveType.ocpUsage:
    default:
      result = ComputedReportItemType.cost;
      break;
  }
  return result;
};

export const getDateRange = queryFromRoute => {
  const dateRange = getDateRangeDefault(queryFromRoute);

  const today = new Date();
  const end_date = format(today, 'yyyy-MM-dd');
  let start_date;

  switch (dateRange) {
    case DateRangeType.previousMonthToDate:
      today.setMonth(today.getMonth() - 1);
      start_date = format(startOfMonth(today), 'yyyy-MM-dd');
      break;
    case DateRangeType.lastSixtyDays:
      today.setDate(today.getDate() - 60);
      start_date = format(today, 'yyyy-MM-dd');
      break;
    case DateRangeType.lastThirtyDays:
      today.setDate(today.getDate() - 30);
      start_date = format(today, 'yyyy-MM-dd');
      break;
    case DateRangeType.currentMonthToDate:
    default:
      start_date = format(startOfMonth(today), 'yyyy-MM-dd');
      break;
  }
  return {
    end_date,
    start_date,
  };
};

export const getDateRangeDefault = queryFromRoute => {
  return queryFromRoute.dateRange || DateRangeType.currentMonthToDate;
};

export const getPerspectiveDefault = queryFromRoute => {
  return queryFromRoute.perspective || PerspectiveType.ocp;
};

export const getGroupByDefault = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.aws:
    case PerspectiveType.awsCloud:
    case PerspectiveType.gcp:
      result = 'account';
      break;
    case PerspectiveType.azure:
    case PerspectiveType.azureCloud:
      result = 'subscription_guid';
      break;
    case PerspectiveType.allCloud:
    case PerspectiveType.ocp:
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
    case PerspectiveType.awsCloud:
      result = groupByAwsOptions;
      break;
    case PerspectiveType.azure:
    case PerspectiveType.azureCloud:
      result = groupByAzureOptions;
      break;
    case PerspectiveType.gcp:
      result = groupByGcpOptions;
      break;
    case PerspectiveType.allCloud:
    case PerspectiveType.ocp:
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
    case PerspectiveType.allCloud:
    case PerspectiveType.awsCloud:
    case PerspectiveType.azure:
    case PerspectiveType.azureCloud:
    case PerspectiveType.gcp:
    case PerspectiveType.ocp:
    case PerspectiveType.ocpSupplementary:
    case PerspectiveType.ocpUsage:
    default:
      result = undefined;
      break;
  }
  return result;
};

export const getReportType = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.allCloud:
    case PerspectiveType.aws:
    case PerspectiveType.awsCloud:
    case PerspectiveType.azure:
    case PerspectiveType.azureCloud:
    case PerspectiveType.gcp:
    case PerspectiveType.ocp:
    case PerspectiveType.ocpSupplementary:
    case PerspectiveType.ocpUsage:
    default:
      result = ReportType.cost;
      break;
  }
  return result;
};

export const getReportPathsType = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.allCloud:
      result = ReportPathsType.ocpCloud;
      break;
    case PerspectiveType.aws:
      result = ReportPathsType.aws;
      break;
    case PerspectiveType.awsCloud:
      result = ReportPathsType.awsCloud;
      break;
    case PerspectiveType.azure:
      result = ReportPathsType.azure;
      break;
    case PerspectiveType.azureCloud:
      result = ReportPathsType.azureCloud;
      break;
    case PerspectiveType.gcp:
      result = ReportPathsType.gcp;
      break;
    case PerspectiveType.ocp:
      result = ReportPathsType.ocp;
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

export const getTagReportPathsType = (perspective: string) => {
  let result;
  switch (perspective) {
    case PerspectiveType.aws:
    case PerspectiveType.awsCloud:
      return TagPathsType.aws;
      break;
    case PerspectiveType.azure:
    case PerspectiveType.azureCloud:
      return TagPathsType.azure;
      break;
    case PerspectiveType.gcp:
      return TagPathsType.gcp;
      break;
    case PerspectiveType.allCloud:
    case PerspectiveType.ocp:
    case PerspectiveType.ocpSupplementary:
    case PerspectiveType.ocpUsage:
      return TagPathsType.ocp;
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

export const isAwsAvailable = (
  awsProviders: Providers,
  awsProvidersFetchStatus: FetchStatus,
  userAccess: UserAccess
) => {
  let result = false;
  if (awsProvidersFetchStatus === FetchStatus.complete) {
    const data = (userAccess.data as any).find(d => d.type === UserAccessType.aws);
    const isUserAccessAllowed = data && data.access;

    // providers API returns empty data array for no sources
    result =
      isUserAccessAllowed &&
      awsProviders !== undefined &&
      awsProviders.meta !== undefined &&
      awsProviders.meta.count > 0;
  }
  return result;
};

export const isAzureAvailable = (
  azureProviders: Providers,
  azureProvidersFetchStatus: FetchStatus,
  userAccess: UserAccess
) => {
  let result = false;
  if (azureProvidersFetchStatus === FetchStatus.complete) {
    const data = (userAccess.data as any).find(d => d.type === UserAccessType.azure);
    const isUserAccessAllowed = data && data.access;

    // providers API returns empty data array for no sources
    result =
      isUserAccessAllowed &&
      azureProviders !== undefined &&
      azureProviders.meta !== undefined &&
      azureProviders.meta.count > 0;
  }
  return result;
};

export const isGcpAvailable = (
  gcpProviders: Providers,
  gcpsProvidersFetchStatus: FetchStatus,
  userAccess: UserAccess
) => {
  let result = false;
  if (gcpsProvidersFetchStatus === FetchStatus.complete) {
    const data = (userAccess.data as any).find(d => d.type === UserAccessType.gcp);
    const isUserAccessAllowed = data && data.access;

    // providers API returns empty data array for no sources
    result =
      isUserAccessAllowed &&
      gcpProviders !== undefined &&
      gcpProviders.meta !== undefined &&
      gcpProviders.meta.count > 0;
  }
  return result;
};

export const isOcpAvailable = (
  ocpProviders: Providers,
  ocpProvidersFetchStatus: FetchStatus,
  userAccess: UserAccess
) => {
  let result = false;
  if (ocpProvidersFetchStatus === FetchStatus.complete) {
    const data = (userAccess.data as any).find(d => d.type === UserAccessType.ocp);
    const isUserAccessAllowed = data && data.access;

    // providers API returns empty data array for no sources
    result =
      isUserAccessAllowed &&
      ocpProviders !== undefined &&
      ocpProviders.meta !== undefined &&
      ocpProviders.meta.count > 0;
  }
  return result;
};
