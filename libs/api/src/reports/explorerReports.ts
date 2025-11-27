import type { ReportItem } from './report';

export interface ExplorerReportItem extends ReportItem {
  account?: string;
  account_alias?: string;
  cluster?: string;
  gcp_project?: string;
  node?: string;
  org_unit_id?: string;
  payer_tenant_id?: string;
  product_service?: string;
  project?: string;
  region?: string;
  resource_location?: string;
  service?: string;
  service_name?: string;
  subscription_guid?: string;
}
