import type { AzureQuery } from '@koku-ui/api/queries/azureQuery';
import type { AzureReport, AzureReportItem } from '@koku-ui/api/reports/azureReports';

import type { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedAzureReportItemsParams extends ComputedReportItemsParams<AzureReport, AzureReportItem> {}

export function getIdKeyForGroupBy(groupBy: AzureQuery['group_by'] = {}): ComputedAzureReportItemsParams['idKey'] {
  if (groupBy.subscription_guid) {
    return 'subscription_guid';
  }
  if (groupBy.resource_location) {
    return 'resource_location';
  }
  if (groupBy.service_name) {
    return 'service_name';
  }
  return 'date';
}
