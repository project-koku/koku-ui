import { OcpOnCloudQuery } from 'api/ocpOnCloudQuery';
import {
  OcpOnCloudDatum,
  OcpOnCloudReport,
  OcpOnCloudReportData,
  OcpOnCloudReportValue,
} from 'api/ocpOnCloudReports';
import { Omit } from 'react-redux';
import { ComputedOcpOnCloudReportItem } from './getComputedOcpOnCloudReportItems';
import { sort, SortDirection } from './sort';

export interface ComputedOcpOnCloudReportItem {
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

export interface GetComputedOcpOnCloudReportItemsParams {
  report: OcpOnCloudReport;
  idKey: keyof Omit<
    OcpOnCloudReportValue,
    | 'capacity'
    | 'cost'
    | 'count'
    | 'derived_cost'
    | 'infrastructure_cost'
    | 'limit'
    | 'request'
    | 'usage'
  >;
  sortKey?: keyof ComputedOcpOnCloudReportItem;
  labelKey?: keyof OcpOnCloudReportValue;
  sortDirection?: SortDirection;
}

export function getComputedOcpOnCloudReportItems({
  report,
  idKey,
  labelKey = idKey,
  sortKey = 'cost',
  sortDirection = SortDirection.asc,
}: GetComputedOcpOnCloudReportItemsParams) {
  return sort(
    getUnsortedComputedOcpOnCloudReportItems({
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

export function getUnsortedComputedOcpOnCloudReportItems({
  report,
  idKey,
  labelKey = idKey,
}: GetComputedOcpOnCloudReportItemsParams) {
  if (!report) {
    return [];
  }

  const itemMap: Map<string | number, ComputedOcpOnCloudReportItem> = new Map();

  const visitDataPoint = (dataPoint: OcpOnCloudReportData) => {
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
        // Ensure unique IDs -- https://github.com/project-koku/koku-ui/issues/706
        const idSuffix =
          idKey !== 'date' && idKey !== 'cluster' && value.cluster
            ? `-${value.cluster}`
            : '';
        const id = `${value[idKey]}${idSuffix}`;
        let label;
        if (labelKey === 'cluster' && value.cluster_alias) {
          label = value.cluster_alias;
        } else if (value[labelKey] instanceof Object) {
          label = (value[labelKey] as OcpOnCloudDatum).value;
        } else {
          label = value[labelKey];
        }
        if (labelKey === 'account' && value.account_alias) {
          label = value.account_alias;
        }
        const limit = value.limit ? value.limit.value : 0;
        const request = value.request ? value.request.value : 0;
        const usage = value.usage ? value.usage.value : 0;
        const units = value.usage
          ? value.usage.units
          : value.cost
          ? value.cost.units
          : 'USD';
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
  groupBy: OcpOnCloudQuery['group_by'] = {}
): GetComputedOcpOnCloudReportItemsParams['idKey'] {
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
