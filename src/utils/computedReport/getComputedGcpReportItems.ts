import { GcpQuery } from 'api/queries/gcpQuery';
import { GcpReport, GcpReportItem } from 'api/reports/gcpReports';

import { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedGcpReportItemsParams extends ComputedReportItemsParams<GcpReport, GcpReportItem> {}

export function getIdKeyForGroupBy(groupBy: GcpQuery['group_by'] = {}): ComputedGcpReportItemsParams['idKey'] {
  if (groupBy.account) {
    return 'account';
  }
  if (groupBy.gcp_project) {
    return 'gcp_project';
  }
  if (groupBy.instance_type) {
    return 'instance_type';
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
