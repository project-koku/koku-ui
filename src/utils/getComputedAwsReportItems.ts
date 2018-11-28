import { AwsQuery } from 'api/awsQuery';
import { AwsReport, AwsReportData, AwsReportValue } from 'api/awsReports';
import { Omit } from 'react-redux';
import { sort, SortDirection } from './sort';

export interface ComputedAwsReportItem {
  deltaPercent: number;
  deltaValue: number;
  id: string | number;
  label: string | number;
  total: number;
  units: AwsReportValue['units'];
}

export interface GetComputedAwsReportItemsParams {
  report: AwsReport;
  idKey: keyof Omit<AwsReportValue, 'total' | 'units' | 'count'>;
  sortKey?: keyof ComputedAwsReportItem;
  labelKey?: keyof AwsReportValue;
  sortDirection?: SortDirection;
}

const groups = ['services', 'accounts', 'instance_types', 'regions'];

export function getComputedAwsReportItems({
  report,
  idKey,
  labelKey = idKey,
  sortKey = 'total',
  sortDirection = SortDirection.asc,
}: GetComputedAwsReportItemsParams) {
  return sort(
    getUnsortedComputedAwsReportItems({
      report,
      idKey,
      labelKey,
      sortDirection,
      sortKey,
    }),
    {
      key: sortKey,
      direction: sortDirection,
    }
  );
}

export function getUnsortedComputedAwsReportItems({
  report,
  idKey,
  labelKey = idKey,
}: GetComputedAwsReportItemsParams) {
  if (!report) {
    return [];
  }

  const itemMap: Record<string, ComputedAwsReportItem> = {};

  const visitDataPoint = (dataPoint: AwsReportData) => {
    if (dataPoint.values) {
      dataPoint.values.forEach(value => {
        const total = value.total;
        const id = value[idKey];
        let label = value[labelKey];
        if (labelKey === 'account' && value.account_alias) {
          label = value.account_alias;
        }
        if (!itemMap[id]) {
          itemMap[id] = {
            deltaPercent: value.delta_percent,
            deltaValue: value.delta_value,
            id,
            total,
            label,
            units: value.units,
          };
          return;
        }
        itemMap[id] = {
          ...itemMap[id],
          total: itemMap[id].total + total,
        };
      });
    }
    groups.forEach(group => {
      if (dataPoint[group]) {
        return dataPoint[group].forEach(visitDataPoint);
      }
    });
  };
  report.data.forEach(visitDataPoint);
  return Object.values(itemMap);
}

export function getIdKeyForGroupBy(
  groupBy: AwsQuery['group_by'] = {}
): GetComputedAwsReportItemsParams['idKey'] {
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
