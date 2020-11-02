import { GcpQuery } from 'api/queries/gcpQuery';
import { GcpReport, GcpReportValue } from 'api/reports/gcpReports';

import { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedGcpReportItemsParams extends ComputedReportItemsParams<GcpReport, GcpReportValue> {}

export function getIdKeyForGroupBy(groupBy: GcpQuery['group_by'] = {}): ComputedGcpReportItemsParams['idKey'] {
  if (groupBy.account) {
    return 'account';
  }
  if (groupBy.instance_type) {
    return 'instance_type';
  }
  if (groupBy.org_unit_id) {
    return 'org_unit_id';
  }
  if (groupBy.region) {
    return 'region';
  }
  if (groupBy.service) {
    return 'service';
  }
  return 'date';
}
