import { OcpQuery } from 'api/queries/ocpQuery';
import { OcpReport, OcpReportValue } from 'api/reports/ocpReports';
import { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedOcpReportItemsParams
  extends ComputedReportItemsParams<OcpReport, OcpReportValue> {}

export function getIdKeyForGroupBy(
  groupBy: OcpQuery['group_by'] = {}
): ComputedOcpReportItemsParams['idKey'] {
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
