import { Report, ReportData, ReportValue } from 'api/reports/report';
import { ReportDatum } from 'api/reports/report';
import { sort, SortDirection } from 'utils/sort';

import { getItemLabel } from './getItemLabel';

export interface ComputedReportItem {
  capacity?: number;
  cluster?: string | number;
  clusters?: string[];
  cost?: number;
  deltaPercent?: number;
  deltaValue?: number;
  id?: string | number;
  infrastructure?: number;
  label?: string | number;
  limit?: number;
  request?: number;
  source_uuid?: string[];
  supplementary?: number;
  type?: string; // account or organizational_unit
  units?: {
    capacity?: string;
    cost: string;
    infrastructure?: string;
    limit?: string;
    request?: string;
    supplementary?: string;
    usage?: string;
  };
  usage?: number;
  x?: string;
}

export interface ComputedReportItemsParams<R extends Report, T extends ReportValue> {
  report: R;
  idKey: keyof T;
  reportItemValue?: string; // Only supported for infrastructure values
  sortKey?: keyof ComputedReportItem;
  labelKey?: keyof T;
  sortDirection?: SortDirection;
}

export function getComputedReportItems<R extends Report, T extends ReportValue>({
  idKey,
  labelKey = idKey,
  report,
  reportItemValue = 'total',
  sortDirection = SortDirection.asc,
  sortKey = 'cost',
}: ComputedReportItemsParams<R, T>) {
  return sort(
    getUnsortedComputedReportItems<R, T>({
      idKey,
      labelKey,
      report,
      reportItemValue,
      sortDirection,
      sortKey,
    }),
    {
      key: sortKey,
      direction: sortDirection,
    }
  );
}

export function getUnsortedComputedReportItems<R extends Report, T extends ReportValue>({
  report,
  idKey,
  labelKey = idKey,
  reportItemValue = 'total',
}: ComputedReportItemsParams<R, T>) {
  if (!report) {
    return [];
  }

  const itemMap: Map<string | number, ComputedReportItem> = new Map();

  const visitDataPoint = (dataPoint: ReportData) => {
    if (dataPoint && dataPoint.values) {
      const type = dataPoint.type;
      dataPoint.values.forEach((val: any) => {
        // Ensure unique map IDs -- https://github.com/project-koku/koku-ui/issues/706
        const idSuffix = idKey !== 'date' && idKey !== 'cluster' && val.cluster ? `-${val.cluster}` : '';

        // org_unit_id workaround for storage and instance-type APIs
        let id = idKey === 'org_entities' ? val.org_unit_id : val[idKey];
        if (id === undefined) {
          id = val.id;
        }
        const mapId = `${id}${idSuffix}`;

        // clusters will either contain the cluster alias or default to cluster ID
        const cluster_alias = val.clusters && val.clusters.length > 0 ? val.clusters[0] : undefined;
        const cluster = cluster_alias || val.cluster;
        const clusters = val.clusters ? val.clusters : [];
        const capacity = val.capacity ? val.capacity.value : 0;
        const cost = val.cost && val.cost.total ? val.cost.total.value : 0;
        const deltaPercent = val.delta_percent ? val.delta_percent : 0;
        const deltaValue = val.delta_value ? val.delta_value : 0;
        const source_uuid = val.source_uuid ? val.source_uuid : [];
        const supplementary = val.supplementary && val.supplementary.total ? val.supplementary.total.value : 0;
        const infrastructure =
          val.infrastructure && val.infrastructure[reportItemValue] ? val.infrastructure[reportItemValue].value : 0;

        let label;
        const itemLabelKey = getItemLabel({ report, labelKey, value: val });
        if (itemLabelKey === 'org_entities' && val.alias) {
          label = val.alias;
        } else if (itemLabelKey === 'account' && val.account_alias) {
          label = val.account_alias;
        } else if (itemLabelKey === 'cluster' && cluster_alias) {
          label = cluster_alias;
        } else if (val[itemLabelKey] instanceof Object) {
          label = (val[itemLabelKey] as ReportDatum).value;
        } else {
          label = val[itemLabelKey];
        }
        if (label === undefined) {
          label = val.alias ? val.alias : val.id;
        }
        const limit = val.limit ? val.limit.value : 0;
        const request = val.request ? val.request.value : 0;
        const usage = val.usage ? val.usage.value : 0;
        const units = {
          ...(val.capacity && { capacity: val.capacity.units }),
          cost: val.cost && val.cost.total ? val.cost.total.units : 'USD',
          ...(val.limit && { limit: val.limit.units }),
          ...(val.infrastructure &&
            val.infrastructure.total && {
              infrastructure: val.infrastructure.total.units,
            }),
          ...(val.request && { request: val.request.units }),
          ...(val.supplementary &&
            val.supplementary.total && {
              supplementary: val.supplementary.total.units,
            }),
          ...(val.usage && { usage: val.usage.units }),
        };

        const item = itemMap.get(mapId);
        if (item) {
          itemMap.set(mapId, {
            ...item,
            capacity: item.capacity + capacity,
            cost: item.cost + cost,
            supplementary: item.supplementary + supplementary,
            infrastructure: item.infrastructure + infrastructure,
            limit: item.limit + limit,
            request: item.request + request,
            usage: item.usage + usage,
          });
        } else {
          itemMap.set(mapId, {
            capacity,
            cluster,
            clusters,
            cost,
            deltaPercent,
            deltaValue,
            source_uuid,
            supplementary,
            id,
            infrastructure,
            label,
            limit,
            request,
            type,
            units,
            usage,
          });
        }
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
