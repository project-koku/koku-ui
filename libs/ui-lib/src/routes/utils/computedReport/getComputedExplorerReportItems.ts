import type { Query } from '@koku-ui/api/queries/query';
import type { ExplorerReportItem } from '@koku-ui/api/reports/explorerReports';
import type { Report } from '@koku-ui/api/reports/report';

import type { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedExplorerReportItemsParams extends ComputedReportItemsParams<Report, ExplorerReportItem> {}

export function getIdKeyForGroupBy(groupBy: Query['group_by'] = {}): ComputedExplorerReportItemsParams['idKey'] {
  if (groupBy.account) {
    return 'account';
  }
  if (groupBy.cluster) {
    return 'cluster';
  }
  if (groupBy.gcp_project) {
    return 'gcp_project';
  }
  if (groupBy.node) {
    return 'node';
  }
  if (groupBy.org_unit_id) {
    return 'org_unit_id';
  }
  if (groupBy.payer_tenant_id) {
    return 'payer_tenant_id';
  }
  if (groupBy.product_service) {
    return 'product_service';
  }
  if (groupBy.project) {
    return 'project';
  }
  if (groupBy.region) {
    return 'region';
  }
  if (groupBy.resource_location) {
    return 'resource_location';
  }
  if (groupBy.service) {
    return 'service';
  }
  if (groupBy.service_name) {
    return 'service_name';
  }
  if (groupBy.subscription_guid) {
    return 'subscription_guid';
  }
  return 'date';
}
