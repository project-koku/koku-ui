import type { RosQuery } from 'api/queries/rosQuery';
import type { RosItem, RosReport } from 'api/ros/ros';

import type { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedRosItemsParams extends ComputedReportItemsParams<RosReport, RosItem> {}

export function getIdKeyForGroupBy(groupBy: RosQuery['group_by'] = {}): ComputedRosItemsParams['idKey'] {
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
