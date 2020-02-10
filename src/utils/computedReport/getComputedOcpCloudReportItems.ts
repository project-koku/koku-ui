import { OcpCloudQuery } from 'api/ocpCloudQuery';
import {
  OcpCloudDatum,
  OcpCloudReport,
  OcpCloudReportData,
  OcpCloudReportValue,
} from 'api/ocpCloudReports';
import { Omit } from 'react-redux';
import { sort, SortDirection } from 'utils/sort';
import { ComputedReportItem } from './computedReportItems';
import { ComputedOcpCloudReportItem } from './getComputedOcpCloudReportItems';
import { getItemLabel } from './getItemLabel';

export interface ComputedOcpCloudReportItem extends ComputedReportItem {
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
  markupCost?: number;
  request?: number;
  units: string;
  usage?: number;
}

export interface GetComputedOcpCloudReportItemsParams {
  report: OcpCloudReport;
  idKey: keyof Omit<
    OcpCloudReportValue,
    | 'capacity'
    | 'cost'
    | 'count'
    | 'derived_cost'
    | 'infrastructure_cost'
    | 'limit'
    | 'markup_cost'
    | 'request'
    | 'usage'
  >;
  sortKey?: keyof ComputedOcpCloudReportItem;
  labelKey?: keyof OcpCloudReportValue;
  sortDirection?: SortDirection;
}

export function getComputedOcpCloudReportItems({
  report,
  idKey,
  labelKey = idKey,
  sortKey = 'cost',
  sortDirection = SortDirection.asc,
}: GetComputedOcpCloudReportItemsParams) {
  return sort(
    getUnsortedComputedOcpCloudReportItems({
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

export function getUnsortedComputedOcpCloudReportItems({
  report,
  idKey,
  labelKey = idKey,
}: GetComputedOcpCloudReportItemsParams) {
  if (!report) {
    return [];
  }

  const itemMap: Map<string | number, ComputedOcpCloudReportItem> = new Map();

  const visitDataPoint = (dataPoint: OcpCloudReportData) => {
    if (dataPoint.values) {
      dataPoint.values.forEach(value => {
        // clusters will either contain the cluster alias or default to cluster ID
        const cluster_alias =
          value.clusters && value.clusters.length > 0
            ? value.clusters[0]
            : undefined;
        const cluster = cluster_alias || value.cluster;
        const capacity = value.capacity ? value.capacity.value : 0;
        const cost = value.cost ? value.cost.value : 0;
        const derivedCost = value.derived_cost ? value.derived_cost.value : 0;
        const infrastructureCost = value.infrastructure_cost
          ? value.infrastructure_cost.value
          : 0;
        const markupCost = value.markup_cost ? value.markup_cost.value : 0;
        // Ensure unique IDs -- https://github.com/project-koku/koku-ui/issues/706
        const idSuffix =
          idKey !== 'date' && idKey !== 'cluster' && value.cluster
            ? `-${value.cluster}`
            : '';
        const id = `${value[idKey]}${idSuffix}`;
        let label;
        const itemLabelKey = getItemLabel({ report, labelKey, value });
        if (itemLabelKey === 'cluster' && cluster_alias) {
          label = cluster_alias;
        } else if (value[itemLabelKey] instanceof Object) {
          label = (value[itemLabelKey] as OcpCloudDatum).value;
        } else {
          label = value[itemLabelKey];
        }
        if (itemLabelKey === 'account' && value.account_alias) {
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
            clusters: value.clusters,
            cost,
            deltaPercent: value.delta_percent,
            deltaValue: value.delta_value,
            derivedCost,
            id,
            infrastructureCost,
            label,
            limit,
            markupCost,
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
          markupCost: itemMap.get(id).markupCost + markupCost,
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
  groupBy: OcpCloudQuery['group_by'] = {}
): GetComputedOcpCloudReportItemsParams['idKey'] {
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
