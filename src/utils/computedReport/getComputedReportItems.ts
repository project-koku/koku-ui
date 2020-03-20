import { Report, ReportData, ReportValue } from 'api/reports/report';
import { ReportDatum } from 'api/reports/report';
import { sort, SortDirection } from 'utils/sort';
import { getItemLabel } from './getItemLabel';

export interface ComputedReportItem {
  capacity?: number;
  cluster?: string | number;
  clusters?: string[];
  cost: number;
  deltaPercent: number;
  deltaValue: number;
  supplementaryCost: number;
  id: string | number;
  infrastructureCost: number;
  label: string | number;
  limit?: number;
  request?: number;
  units?: string;
  usage?: number;
}

export interface ComputedReportItemsParams<
  R extends Report,
  T extends ReportValue
> {
  report: R;
  idKey: keyof T;
  sortKey?: keyof ComputedReportItem;
  labelKey?: keyof T;
  sortDirection?: SortDirection;
}

export function getComputedReportItems<
  R extends Report,
  T extends ReportValue
>({
  report,
  idKey,
  labelKey = idKey,
  sortDirection = SortDirection.asc,
  sortKey = 'cost',
}: ComputedReportItemsParams<R, T>) {
  return sort(
    getUnsortedComputedReportItems<R, T>({
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

export function getUnsortedComputedReportItems<
  R extends Report,
  T extends ReportValue
>({ report, idKey, labelKey = idKey }: ComputedReportItemsParams<R, T>) {
  if (!report) {
    return [];
  }

  const itemMap: Map<string | number, ComputedReportItem> = new Map();

  const visitDataPoint = (dataPoint: ReportData) => {
    if (dataPoint.values) {
      dataPoint.values.forEach((value: any) => {
        // clusters will either contain the cluster alias or default to cluster ID
        const cluster_alias =
          value.clusters && value.clusters.length > 0
            ? value.clusters[0]
            : undefined;
        const cluster = cluster_alias || value.cluster;
        const capacity = value.capacity ? value.capacity.value : 0;
        const cost =
          value.cost && value.cost.total ? value.cost.total.value : 0;
        const supplementaryCost =
          value.supplementary && value.supplementary.total
            ? value.supplementary.total.value
            : 0;
        const infrastructureCost =
          value.infrastructure && value.infrastructure.total
            ? value.infrastructure.total.value
            : 0;
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
          label = (value[itemLabelKey] as ReportDatum).value;
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
          : value.cost && value.cost.total
          ? value.cost.total.units
          : 'USD';
        if (!itemMap.get(id)) {
          itemMap.set(id, {
            capacity,
            cluster,
            clusters: value.clusters,
            cost,
            deltaPercent: value.delta_percent,
            deltaValue: value.delta_value,
            supplementaryCost,
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
          supplementaryCost:
            itemMap.get(id).supplementaryCost + supplementaryCost,
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
