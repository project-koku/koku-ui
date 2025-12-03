import type { GcpQuery } from '@koku-ui/api/queries/gcpQuery';
import type { GcpReport, GcpReportItem } from '@koku-ui/api/reports/gcpReports';

import type { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedGcpReportItemsParams extends ComputedReportItemsParams<GcpReport, GcpReportItem> {}

export function getIdKeyForGroupBy(groupBy: GcpQuery['group_by'] = {}): ComputedGcpReportItemsParams['idKey'] {
  if (groupBy.account) {
    return 'account';
  }
  if (groupBy.gcp_project) {
    return 'gcp_project';
  }
  if (groupBy.project) {
    return 'project';
  }
  if (groupBy.region) {
    return 'region';
  }
  if (groupBy.service) {
    return 'service';
  }
  return 'date';
}
