import { AwsQuery } from 'api/awsQuery';
import { AwsReport, AwsReportValue } from 'api/awsReports';
import {
  ComputedReportItem,
  ComputedReportItemsParams,
} from './getComputedReportItems';

export interface ComputedAwsReportItemsParams
  extends ComputedReportItemsParams<AwsReport, AwsReportValue> {
  sortKey?: keyof ComputedReportItem;
}

export function getIdKeyForGroupBy(
  groupBy: AwsQuery['group_by'] = {}
): ComputedAwsReportItemsParams['idKey'] {
  if (groupBy.account) {
    return 'account';
  }
  if (groupBy.instance_type) {
    return 'instance_type';
  }
  if (groupBy.region) {
    return 'region';
  }
  if (groupBy.service) {
    return 'service';
  }
  return 'date';
}
