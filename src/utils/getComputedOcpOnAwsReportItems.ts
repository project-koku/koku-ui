import { OcpOnAwsQuery } from 'api/ocpOnAwsQuery';
import {
  OcpOnAwsDatum,
  OcpOnAwsReport,
  OcpOnAwsReportData,
  OcpOnAwsReportValue,
} from 'api/ocpOnAwsReports';
import { Omit } from 'react-redux';
import { ComputedOcpOnAwsReportItem } from './getComputedOcpOnAwsReportItems';
import { sort, SortDirection } from './sort';

export interface ComputedOcpOnAwsReportItem {
  capacity?: number;
  cluster?: string | number;
  cost: number;
  deltaPercent: number;
  deltaValue: number;
  derivedCost: number;
  id: string | number;
  infrastructureCost: number;
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
    | 'capacity'
    | 'cost'
    | 'count'
    | 'derived_cost'
    | 'infrastructure_cost'
    | 'limit'
    | 'request'
    | 'usage'
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

  const itemMap: Map<string | number, ComputedOcpOnAwsReportItem> = new Map();

  const visitDataPoint = (dataPoint: OcpOnAwsReportData) => {
    if (dataPoint.values) {
      dataPoint.values.forEach(value => {
        const capacity = value.capacity ? value.capacity.value : 0;
        const cluster = value.cluster_alias
          ? value.cluster_alias
          : value.cluster;
        const cost = value.cost ? value.cost.value : 0;
        const derivedCost = value.derived_cost ? value.derived_cost.value : 0;
        const infrastructureCost = value.infrastructure_cost
          ? value.infrastructure_cost.value
          : 0;
        const id = value[idKey];
        let label;
        if (labelKey === 'cluster' && value.cluster_alias) {
          label = value.cluster_alias;
        } else if (value[labelKey] instanceof Object) {
          label = (value[labelKey] as OcpOnAwsDatum).value;
        } else {
          label = value[labelKey];
        }
        if (labelKey === 'account' && value.account_alias) {
          label = value.account_alias;
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
            derivedCost,
            id,
            infrastructureCost,
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
          derivedCost: itemMap.get(id).derivedCost + derivedCost,
          infrastructureCost:
            itemMap.get(id).infrastructureCost + infrastructureCost,
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
