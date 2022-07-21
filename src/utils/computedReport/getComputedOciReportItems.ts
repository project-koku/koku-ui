import { OciQuery } from 'api/queries/ociQuery';
import { OciReport, OciReportItem } from 'api/reports/ociReports';

import { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedOciReportItemsParams extends ComputedReportItemsParams<OciReport, OciReportItem> {}

export function getIdKeyForGroupBy(groupBy: OciQuery['group_by'] = {}): ComputedOciReportItemsParams['idKey'] {
  if (groupBy.payer_tenant_id) {
    return 'payer_tenant_id';
  }
  if (groupBy.region) {
    return 'region';
  }
  if (groupBy.product_service) {
    return 'product_service';
  }
  return 'date';
}
