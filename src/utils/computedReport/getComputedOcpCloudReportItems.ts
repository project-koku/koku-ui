import { OcpCloudQuery } from 'api/queries/ocpCloudQuery';
import { OcpCloudReport, OcpCloudReportValue } from 'api/reports/ocpCloudReports';

import { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedOcpCloudReportItemsParams
  extends ComputedReportItemsParams<OcpCloudReport, OcpCloudReportValue> {}

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
