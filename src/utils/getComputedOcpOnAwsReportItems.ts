import { OcpOnAwsQuery } from 'api/ocpOnAwsQuery';
import {
  OcpOnAwsDatum,
  OcpOnAwsReport,
  OcpOnAwsReportData,
  OcpOnAwsReportValue,
} from 'api/ocpOnAwsReports';
import { Omit } from 'react-redux';
import { sort, SortDirection } from './sort';

export interface ComputedOcpOnAwsReportItem {
  capacity?: number;
  cost: number;
  deltaPercent: number;
  deltaValue: number;
  id: string | number;
  label: string | number;
  limit?: number;
  request?: number;
  units: string;
  usage?: number;
}

export interface GetComputedOcpOnAwsReportItemsParams {
  report: OcpOnAwsReport;
  idKey: keyof Omit<
    OcpOnAwsReportValue,
    'cost' | 'usage' | 'count' | 'request' | 'limit' | 'capacity'
  >;
  sortKey?: keyof ComputedOcpOnAwsReportItem;
  labelKey?: keyof OcpOnAwsReportValue;
  sortDirection?: SortDirection;
}

export function getComputedOcpOnAwsReportItems({
  report,
  idKey,
  labelKey = idKey,
  sortKey = 'cost',
  sortDirection = SortDirection.asc,
}: GetComputedOcpOnAwsReportItemsParams) {
  return sort(
    getUnsortedComputedOcpOnAwsReportItems({
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

export function getUnsortedComputedOcpOnAwsReportItems({
  report,
  idKey,
  labelKey = idKey,
}: GetComputedOcpOnAwsReportItemsParams) {
  if (!report) {
    return [];
  }

  const itemMap: Record<string, ComputedOcpOnAwsReportItem> = {};

  const visitDataPoint = (dataPoint: OcpOnAwsReportData) => {
    if (dataPoint.values) {
      dataPoint.values.forEach(value => {
        const capacity = value.capacity ? value.capacity.value : 0;
        const cost = value.cost ? value.cost.value : 0;
        const id = value[idKey];
        let label;
        if (labelKey === 'cluster' && value.cluster_alias) {
          label = value.cluster_alias;
        } else if (value[labelKey] instanceof Object) {
          label = (value[labelKey] as OcpOnAwsDatum).value;
        } else {
          label = value[labelKey];
        }
        const limit = value.limit ? value.limit.value : 0;
        const request = value.request ? value.request.value : 0;
        const usage = value.usage ? value.usage.value : 0;
        const units = value.usage ? value.usage.units : value.cost.units;
        if (!itemMap[id]) {
          itemMap[id] = {
            capacity,
            cost,
            deltaPercent: value.delta_percent,
            deltaValue: value.delta_value,
            id,
            label,
            limit,
            request,
            units,
            usage,
          };
          return;
        }
        itemMap[id] = {
          ...itemMap[id],
          capacity: itemMap[id].capacity + capacity,
          cost: itemMap[id].cost + cost,
          limit: itemMap[id].limit + limit,
          request: itemMap[id].request + request,
          usage: itemMap[id].usage + usage,
        };
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
  return Object.values(itemMap);
}

export function getIdKeyForGroupBy(
  groupBy: OcpOnAwsQuery['group_by'] = {}
): GetComputedOcpOnAwsReportItemsParams['idKey'] {
  if (groupBy.project) {
    return 'project';
  }
  if (groupBy.cluster) {
    return 'cluster';
  }
  if (groupBy.node) {
    return 'node';
  }
  return 'date';
}
