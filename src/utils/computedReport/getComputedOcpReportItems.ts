import { OcpQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportValue } from 'api/ocpReports';
import {
  ComputedReportItem,
  ComputedReportItemsParams,
} from './getComputedReportItems';

export interface ComputedOcpReportItemsParams
  extends ComputedReportItemsParams<OcpReport, OcpReportValue> {
  sortKey?: keyof ComputedReportItem;
}

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
