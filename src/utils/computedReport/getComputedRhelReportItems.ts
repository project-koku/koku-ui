import type { RhelQuery } from 'api/queries/rhelQuery';
import type { RhelReport, RhelReportItem } from 'api/reports/rhelReports';

import type { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedRhelReportItemsParams extends ComputedReportItemsParams<RhelReport, RhelReportItem> {}

export function getIdKeyForGroupBy(groupBy: RhelQuery['group_by'] = {}): ComputedRhelReportItemsParams['idKey'] {
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
