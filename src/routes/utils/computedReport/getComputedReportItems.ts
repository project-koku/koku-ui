import type { Report, ReportData, ReportItem, ReportItemValue, ReportValue } from 'api/reports/report';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import { sort, SortDirection } from 'routes/utils/sort';

import { getItemLabel } from './getItemLabel';

export interface ComputedReportValue {
  units?: string;
  value?: number | string;
}

export interface ComputedReportItemValue {
  distributed?: ReportValue;
  markup?: ReportValue;
  platformDistributed?: ReportValue;
  raw?: ReportValue;
  total?: ReportValue;
  usage?: ReportValue;
  workerUnallocatedDistributed?: ReportValue;
}

export interface ComputedReportOcpItem extends ReportItem {
  capacity?: ReportValue;
  cluster?: string;
  clusters?: string[];
  limit?: ReportValue;
  request?: ReportValue;
  usage?: ReportValue;
}

export interface ComputedReportOrgItem extends ReportItem {
  id?: string;
}

export interface ComputedReportItem extends ComputedReportOcpItem, ComputedReportOrgItem {
  cost?: ReportItemValue;
  date?: string;
  delta_percent?: number;
  delta_value?: number;
  infrastructure?: ReportItemValue;
  label?: string; // helper for item label
  source_uuid?: string;
  supplementary?: ReportItemValue;
  type?: string; // 'account' or 'organizational_unit'
}

export interface ComputedReportItemsParams<R extends Report, T extends ReportItem> {
  idKey: keyof T;
  isDateMap?: boolean;
  report: R;
  sortKey?: keyof ComputedReportItem;
  sortDirection?: SortDirection;
}

export function getComputedReportItems<R extends Report, T extends ReportItem>({
  idKey,
  isDateMap,
  report,
  sortDirection = SortDirection.asc,
  sortKey = 'date',
}: ComputedReportItemsParams<R, T>) {
  return sort(
    getUnsortedComputedReportItems<R, T>({
      idKey,
      isDateMap,
      report,
      sortDirection,
      sortKey,
    }),
    {
      key: sortKey,
      direction: sortDirection,
    }
  );
}

// For filter[categpry]=platform, all clusters are listed in the breakdown page
function getClusters(val, item?: any) {
  const clusters = val.clusters ? val.clusters : [];
  if (item && item.clusters) {
    item.clusters.forEach(cluster => {
      if (!clusters.includes(cluster)) {
        clusters.push(cluster);
      }
    });
  }
  return clusters.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
}

function getCostData(val, key, item?: any) {
  const defaultUnits = 'USD';
  return {
    ...(val[key] &&
      val[key].distributed && {
        distributed: {
          value: val[key].distributed.value + (item && item[key]?.distributed ? item[key].distributed.value : 0),
          units: val[key].distributed.units ? val[key].distributed.units : defaultUnits,
        },
      }),
    ...(val[key] &&
      val[key].markup && {
        markup: {
          value: val[key].markup.value + (item && item[key]?.markup ? item[key].markup.value : 0),
          units: val[key].markup.units ? val[key].markup.units : defaultUnits,
        },
      }),
    ...(val[key] &&
      val[key].platform_distributed && {
        platformDistributed: {
          value:
            val[key].platform_distributed.value +
            (item && item[key]?.platform_distributed ? item[key].platform_distributed.value : 0),
          units: val[key].platform_distributed.units ? val[key].platform_distributed.units : defaultUnits,
        },
      }),
    ...(val[key] &&
      val[key].total && {
        raw: {
          value: val[key].raw.value + (item && item[key]?.raw ? item[key].raw.value : 0),
          units: val[key].raw.units ? val[key].raw.units : defaultUnits,
        },
      }),
    ...(val[key] &&
      val[key].total && {
        total: {
          value: val[key].total.value + (item && item[key]?.total ? item[key].total.value : 0),
          units: val[key].total.units ? val[key].total.units : defaultUnits,
        },
      }),
    ...(val[key] &&
      val[key].usage && {
        usage: {
          value: val[key].usage.value + (item && item[key]?.usage ? item[key].usage.value : 0),
          units: val[key].usage.units ? val[key].usage.units : defaultUnits,
        },
      }),
    ...(val[key] &&
      val[key].worker_unallocated_distributed && {
        workerUnallocatedDistributed: {
          value:
            val[key].worker_unallocated_distributed.value +
            (item && item[key]?.worker_unallocated_distributed ? item[key].worker_unallocated_distributed.value : 0),
          units: val[key].worker_unallocated_distributed.units
            ? val[key].worker_unallocated_distributed.units
            : defaultUnits,
        },
      }),
  };
}

function getUsageData(val, item?: any) {
  const defaultUnits = 'Core-Hours';
  return {
    ...(val.capacity && {
      capacity: {
        value: val.capacity.value + (item?.capacity ? item.capacity.value : 0),
        units: val.capacity.units ? val.capacity.units : defaultUnits,
        ...(val.capacity.count !== undefined && {
          count: val.capacity.count + (item?.capacity ? item.capacity.count : 0),
        }),
        ...(val.capacity.count_units && {
          count_units: val.capacity.count_units,
        }),
        ...(val.capacity.unused !== undefined && {
          unused: val.capacity.unused + (item?.capacity ? item.capacity.unused : 0),
        }),
        ...(val.capacity.unused_percent !== undefined && {
          unused_percent: val.capacity.unused_percent + (item?.capacity ? item.capacity.unused_percent : 0),
        }),
      },
    }),
    ...(val.limit && {
      limit: {
        value: val.limit.value + (item?.limit ? item.limit.value : 0),
        units: val.limit.units ? val.limit.units : defaultUnits,
      },
    }),
    ...(val.request && {
      request: {
        value: val.request.value + (item?.request ? item.request.value : 0),
        units: val.request.units ? val.request.units : defaultUnits,
        ...(val.request.unused !== undefined && {
          unused: val.request.unused + (item?.request ? item.request.unused : 0),
        }),
        ...(val.request.unused_percent !== undefined && {
          unused_percent: val.request.unused_percent + (item?.request ? item.request.unused_percent : 0),
        }),
      },
    }),
    ...(val.usage && {
      usage: {
        value: val.usage.value + (item?.usage ? item.usage.value : 0),
        units: val.usage.units ? val.usage.units : defaultUnits,
      },
    }),
  };
}

// Details pages typically use this function with filter[resolution]=monthly
export function getUnsortedComputedReportItems<R extends Report, T extends ReportItem>({
  isDateMap = false,
  report,
  idKey, // Note: The idKey must use org_entities for reports, while group_by uses org_unit_id
}: ComputedReportItemsParams<R, T>) {
  if (!report) {
    return [];
  }

  // Map<string | number, ComputedReportItem | Map<string | number, ComputedReportItem>
  const itemMap = new Map();

  const visitDataPoint = (dataPoint: ReportData) => {
    const type = dataPoint.type; // Org unit type

    if (dataPoint && dataPoint.values) {
      dataPoint.values.forEach((val: any) => {
        let id = val.id ? val.id : val[idKey];
        if (!id) {
          id = val.date;
        }

        // Ensure unique map IDs -- https://github.com/project-koku/koku-ui/issues/706
        const idSuffix = idKey !== 'date' && idKey !== 'cluster' && val.cluster ? `-${val.cluster}` : '';
        const mapId = `${id}${idSuffix}`;

        // 'clusters' will contain either the cluster alias or default cluster ID
        const classification = val.classification;
        const cluster_alias = val.clusters && val.clusters.length > 0 ? val.clusters[0] : undefined;
        const cluster = cluster_alias || val.cluster;
        const date = val.date;
        const default_project = val.default_project && val.default_project.toLowerCase() === 'true';
        const delta_percent = val.delta_percent ? val.delta_percent : 0;
        const delta_value = val.delta_value ? val.delta_value : 0;
        const source_uuid = val.source_uuid ? val.source_uuid : [];

        let label;
        if (report.meta && report.meta.others && (id === 'Other' || id === 'Others')) {
          // Add count to "Others" label
          label = intl.formatMessage(messages.chartOthers, { count: report.meta.others });
        } else {
          const itemLabelKey = getItemLabel({ report, idKey, value: val });
          if (itemLabelKey === 'org_entities' && val.alias) {
            label = val.alias;
          } else if (itemLabelKey === 'account' && val.account_alias) {
            label = val.account_alias;
          } else if (itemLabelKey === 'cluster' && cluster_alias) {
            label = cluster_alias;
          } else if (val[itemLabelKey] instanceof Object) {
            label = val[itemLabelKey].value;
          } else {
            label = val[itemLabelKey];
          }
          if (label === undefined || label.trim().length === 0) {
            label = val.alias && val.alias.trim().length > 0 ? val.alias : val[idKey];
          }
        }

        if (isDateMap) {
          const data = {
            ...getUsageData(val), // capacity, limit, request, & usage
            classification,
            cluster,
            clusters: getClusters(val),
            cost: getCostData(val, 'cost'),
            date,
            default_project,
            delta_percent,
            delta_value,
            id,
            infrastructure: getCostData(val, 'infrastructure'),
            label,
            source_uuid,
            supplementary: getCostData(val, 'supplementary'),
            type,
          };
          const item = itemMap.get(mapId);
          if (item) {
            item.set(date, data);
          } else {
            const dateMap = new Map();
            dateMap.set(date, data);
            itemMap.set(mapId, dateMap);
          }
        } else {
          const item = itemMap.get(mapId);
          if (item) {
            // When applying multiple group_by params, costs may be split between regions. We need to sum those costs
            // See https://issues.redhat.com/browse/COST-1131
            itemMap.set(mapId, {
              ...item,
              ...getUsageData(val, item), // capacity, limit, request, & usage
              classification,
              cluster,
              clusters: getClusters(val, item),
              cost: getCostData(val, 'cost', item),
              date,
              default_project,
              delta_percent,
              delta_value,
              id,
              infrastructure: getCostData(val, 'infrastructure', item),
              label,
              source_uuid,
              supplementary: getCostData(val, 'supplementary', item),
              type,
            });
          } else {
            itemMap.set(mapId, {
              ...getUsageData(val), // capacity, limit, request, & usage
              classification,
              cluster,
              clusters: getClusters(val),
              cost: getCostData(val, 'cost'),
              date,
              default_project,
              delta_percent,
              delta_value,
              id,
              infrastructure: getCostData(val, 'infrastructure'),
              label,
              source_uuid,
              supplementary: getCostData(val, 'supplementary'),
              type,
            });
          }
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
