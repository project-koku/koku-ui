import type { OcpQuery } from 'api/queries/ocpQuery';
import type { OcpReport, OcpReportItem } from 'api/reports/ocpReports';

import type { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedOcpReportItemsParams extends ComputedReportItemsParams<OcpReport, OcpReportItem> {}

export function getIdKeyForGroupBy(groupBy: OcpQuery['group_by'] = {}): ComputedOcpReportItemsParams['idKey'] {
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
