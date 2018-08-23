import { Query } from 'api/query';
import { Report, ReportData, ReportValue } from 'api/reports';
import { Omit } from 'react-redux';
import { sort, SortDirection } from './sort';

export interface ComputedReportItem {
  id: string | number;
  label: string | number;
  total: number;
  units: ReportValue['units'];
}

export interface GetComputedReportItemsParams {
  report: Report;
  idKey: keyof Omit<ReportValue, 'total' | 'units' | 'count'>;
  sortKey?: keyof ComputedReportItem;
  labelKey?: keyof ReportValue;
  sortDirection?: SortDirection;
}

const groups = ['services', 'accounts', 'instance_types', 'regions'];

export function getComputedReportItems({
  report,
  idKey,
  labelKey = idKey,
  sortKey = 'total',
  sortDirection = SortDirection.asc,
}: GetComputedReportItemsParams) {
  if (!report) {
    return [];
  }

  const itemMap: Record<string, ComputedReportItem> = {};

  const visitDataPoint = (dataPoint: ReportData) => {
    if (dataPoint.values) {
      dataPoint.values.forEach(value => {
        const total = value.total;
        const id = value[idKey];
        if (!itemMap[id]) {
          itemMap[id] = {
            id,
            total,
            label: value[labelKey],
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

  return sort(Object.values(itemMap), {
    key: sortKey,
    direction: sortDirection,
  });
}

export function getIdKeyForGroupBy(
  groupBy: Query['group_by'] = {}
): GetComputedReportItemsParams['idKey'] {
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
