import { OcpQuery } from 'api/ocpQuery';
import {
  OcpDatum,
  OcpReport,
  OcpReportData,
  OcpReportValue,
} from 'api/ocpReports';
import { Omit } from 'react-redux';
import { sort, SortDirection } from './sort';

export interface ComputedOcpReportItem {
  capacity?: number;
  cluster?: string | number;
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

export interface GetComputedOcpReportItemsParams {
  report: OcpReport;
  idKey: keyof Omit<
    OcpReportValue,
    'cost' | 'usage' | 'count' | 'request' | 'limit' | 'capacity'
  >;
  sortKey?: keyof ComputedOcpReportItem;
  labelKey?: keyof OcpReportValue;
  sortDirection?: SortDirection;
}

export function getComputedOcpReportItems({
  report,
  idKey,
  labelKey = idKey,
  sortKey = 'cost',
  sortDirection = SortDirection.asc,
}: GetComputedOcpReportItemsParams) {
  return sort(
    getUnsortedComputedOcpReportItems({
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

export function getUnsortedComputedOcpReportItems({
  report,
  idKey,
  labelKey = idKey,
}: GetComputedOcpReportItemsParams) {
  if (!report) {
    return [];
  }

  const itemMap: Map<string | number, ComputedOcpReportItem> = new Map();

  const visitDataPoint = (dataPoint: OcpReportData) => {
    if (dataPoint.values) {
      dataPoint.values.forEach(value => {
        const capacity = value.capacity ? value.capacity.value : 0;
        const cluster = value.cluster_alias
          ? value.cluster_alias
          : value.cluster;
        const cost = value.cost ? value.cost.value : 0;
        const id = value[idKey];
        let label;
        if (labelKey === 'cluster' && value.cluster_alias) {
          label = value.cluster_alias;
        } else if (value[labelKey] instanceof Object) {
          label = (value[labelKey] as OcpDatum).value;
        } else {
          label = value[labelKey];
        }
        const limit = value.limit ? value.limit.value : 0;
        const request = value.request ? value.request.value : 0;
        const usage = value.usage ? value.usage.value : 0;
        const units = value.usage ? value.usage.units : value.cost.units;
        if (!itemMap.get(id)) {
          itemMap.set(id, {
            capacity,
            cluster,
            cost,
            deltaPercent: value.delta_percent,
            deltaValue: value.delta_value,
            id,
            label,
            limit,
            request,
            units,
            usage,
          });
          return;
        }
        itemMap.set(id, {
          ...itemMap.get(id),
          capacity: itemMap.get(id).capacity + capacity,
          cost: itemMap.get(id).cost + cost,
          limit: itemMap.get(id).limit + limit,
          request: itemMap.get(id).request + request,
          usage: itemMap.get(id).usage + usage,
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
  groupBy: OcpQuery['group_by'] = {}
): GetComputedOcpReportItemsParams['idKey'] {
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
