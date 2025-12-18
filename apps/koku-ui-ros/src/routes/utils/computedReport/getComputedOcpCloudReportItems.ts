import type { OcpCloudQuery } from 'api/queries/ocpCloudQuery';
import type { OcpCloudReport, OcpCloudReportItem } from 'api/reports/ocpCloudReports';

import type { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedOcpCloudReportItemsParams extends ComputedReportItemsParams<
  OcpCloudReport,
  OcpCloudReportItem
> {}

export function getIdKeyForGroupBy(
  groupBy: OcpCloudQuery['group_by'] = {}
): ComputedOcpCloudReportItemsParams['idKey'] {
  if (groupBy.project) {
    return 'project';
  }
  if (groupBy.cluster) {
    return 'cluster';
  }
  if (groupBy.node) {
    return 'node';
  }
  return 'date';
}
