import { AwsQuery } from 'api/awsQuery';
import {
  AwsDatum,
  AwsReport,
  AwsReportData,
  AwsReportValue,
} from 'api/awsReports';
import { Omit } from 'react-redux';
import { sort, SortDirection } from './sort';

export interface ComputedAwsReportItem {
  deltaPercent: number;
  deltaValue: number;
  id: string | number;
  label: string | number;
  total: number;
  units: string;
}

export interface GetComputedAwsReportItemsParams {
  report: AwsReport;
  idKey: keyof Omit<AwsReportValue, 'cost' | 'usage' | 'count'>;
  sortKey?: keyof ComputedAwsReportItem;
  labelKey?: keyof AwsReportValue;
  sortDirection?: SortDirection;
}

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

  const itemMap: Map<string | number, ComputedAwsReportItem> = new Map();

  const visitDataPoint = (dataPoint: AwsReportData) => {
    if (dataPoint.values) {
      dataPoint.values.forEach(value => {
        const total = value.usage ? value.usage.value : value.cost.value;
        const id = value[idKey];
        let label;
        if (value[labelKey] instanceof Object) {
          label = (value[labelKey] as AwsDatum).value;
        } else {
          label = value[labelKey];
        }
        if (labelKey === 'account' && value.account_alias) {
          label = value.account_alias;
        }
        if (!itemMap.get(id)) {
          itemMap.set(id, {
            deltaPercent: value.delta_percent,
            deltaValue: value.delta_value,
            id,
            total,
            label,
            units: value.usage ? value.usage.units : value.cost.units,
          });
          return;
        }
        itemMap.set(id, {
          ...itemMap.get(id),
          total: itemMap.get(id).total + total,
        });
      });
    }
    for (const key in dataPoint) {
      if (dataPoint[key] instanceof Array) {
        return dataPoint[key].forEach(visitDataPoint);
      }
    }
  };
  if (report && report.data) {
    report.data.forEach(visitDataPoint);
  }
  return Array.from(itemMap.values());
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
