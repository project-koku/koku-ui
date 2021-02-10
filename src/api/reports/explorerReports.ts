import { ReportItem } from './report';

export interface ExplorerReportItem extends ReportItem {
  account?: string;
  account_alias?: string;
  cluster?: string;
  instance_type?: string;
  node?: string;
  org_unit_id?: string;
  project?: string;
  region?: string;
  resource_location?: string;
  service?: string;
  service_name?: string;
  subscription_guid?: string;
}
