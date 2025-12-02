import type { AwsQuery } from '@koku-ui/api/queries/awsQuery';
import type { AwsReport, AwsReportItem } from '@koku-ui/api/reports/awsReports';

import type { ComputedReportItemsParams } from './getComputedReportItems';

export interface ComputedAwsReportItemsParams extends ComputedReportItemsParams<AwsReport, AwsReportItem> {}

export function getIdKeyForGroupBy(groupBy: AwsQuery['group_by'] = {}): ComputedAwsReportItemsParams['idKey'] {
  if (groupBy.account) {
    return 'account';
  }
  if (groupBy.aws_category) {
    return 'aws_category';
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
