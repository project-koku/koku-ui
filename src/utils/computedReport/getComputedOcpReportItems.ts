import { OcpQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportValue } from 'api/ocpReports';
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
