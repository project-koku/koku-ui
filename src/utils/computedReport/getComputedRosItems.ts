import type { RosQuery } from 'api/queries/rosQuery';
import type { Ros, RosItem } from 'api/ros/ros';

import type { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedRosItemsParams extends ComputedReportItemsParams<Ros, RosItem> {}

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
