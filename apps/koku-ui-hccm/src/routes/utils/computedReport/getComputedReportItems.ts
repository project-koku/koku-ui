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
  networkUnattributedDistributed?: ReportValue;
  platformDistributed?: ReportValue;
  raw?: ReportValue;
  storageUnattributedDistributed?: ReportValue;
  total?: ReportValue;
  usage?: ReportValue;
  workerUnallocatedDistributed?: ReportValue;
}

export interface ComputedReportOcpItem extends ReportItem {
  data_transfer_in?: ReportValue;
  data_transfer_out?: ReportValue;
  capacity?: ReportValue;
  cluster?: string;
  clusters?: string[];
  limit?: ReportValue;
  gpu_count?: ReportValue;
  gpu_memory?: ReportValue;
  gpu_model?: string;
  gpu_vendor?: string;
  memory?: ReportValue;
  persistent_volume_claim?: string;
  request?: ReportValue;
  storage_class?: string;
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
  isGroupBy?: boolean;
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
  const clusters = val?.clusters || [];
  if (item?.clusters) {
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
    ...(val?.[key]?.distributed && {
      distributed: {
        value: (val?.[key]?.distributed?.value || 0) + (item?.[key]?.distributed?.value || 0),
        units: val?.[key]?.distributed?.units || defaultUnits,
      },
    }),
    ...(val?.[key]?.markup && {
      markup: {
        value: (val?.[key]?.markup?.value || 0) + (item?.[key]?.markup?.value || 0),
        units: val?.[key]?.markup?.units || defaultUnits,
      },
    }),
    ...(val?.[key]?.network_unattributed_distributed && {
      networkUnattributedDistributed: {
        value:
          (val?.[key]?.network_unattributed_distributed?.value || 0) +
          (item?.[key]?.network_unattributed_distributed?.value || 0),
        units: val?.[key]?.network_unattributed_distributed?.units || defaultUnits,
      },
    }),
    ...(val?.[key]?.platform_distributed && {
      platformDistributed: {
        value: (val?.[key]?.platform_distributed?.value || 0) + (item?.[key]?.platform_distributed?.value || 0),
        units: val?.[key]?.platform_distributed?.units || defaultUnits,
      },
    }),
    ...(val?.[key]?.total && {
      raw: {
        value: (val?.[key]?.raw?.value || 0) + (item?.[key]?.raw?.value || 0),
        units: val?.[key]?.raw?.units || defaultUnits,
      },
    }),
    ...(val?.[key]?.storage_unattributed_distributed && {
      storageUnattributedDistributed: {
        value:
          (val?.[key]?.storage_unattributed_distributed?.value || 0) +
          (item?.[key]?.storage_unattributed_distributed?.value || 0),
        units: val?.[key]?.storage_unattributed_distributed?.units || defaultUnits,
      },
    }),
    ...(val?.[key]?.total && {
      total: {
        value: (val?.[key]?.total?.value || 0) + (item?.[key]?.total?.value || 0),
        units: val?.[key]?.total?.units || defaultUnits,
      },
    }),
    ...(val?.[key]?.usage && {
      usage: {
        value: (val?.[key]?.usage?.value || 0) + (item?.[key]?.usage?.value || 0),
        units: val?.[key]?.usage?.units || defaultUnits,
      },
    }),
    ...(val?.[key]?.worker_unallocated_distributed && {
      workerUnallocatedDistributed: {
        value:
          (val?.[key]?.worker_unallocated_distributed?.value || 0) +
          (item?.[key]?.worker_unallocated_distributed?.value || 0),
        units: val?.[key]?.worker_unallocated_distributed?.units || defaultUnits,
      },
    }),
    ...(val?.cost && {
      value: (val?.cost?.value || 0) + (item?.cost?.value || 0),
      units: val?.cost?.units || defaultUnits,
    }),
  };
}

function getGpuData(val, item?: any) {
  return {
    ...(val?.gpu_count && {
      gpu_count: {
        value: (val?.gpu_count?.value || 0) + (item?.gpu_count?.value || 0),
        units: val?.gpu_count?.units || 'GPUs',
      },
    }),
    ...(val?.gpu_memory && {
      gpu_memory: {
        value: (val?.gpu_memory?.value || 0) + (item?.gpu_memory?.value || 0),
        units: val?.gpu_memory?.units || 'GB',
      },
    }),
  };
}

function getUsageData(val, item?: any) {
  const defaultUnits = 'Core-Hours';
  return {
    ...(val?.capacity && {
      capacity: {
        value: (val?.capacity?.value || 0) + (item?.capacity?.value || 0),
        units: val?.capacity?.units || defaultUnits,
        ...(val?.capacity?.count !== undefined && {
          count: (val?.capacity?.count || 0) + (item?.capacity?.count || 0),
        }),
        ...(val?.capacity?.count_units && {
          count_units: val?.capacity?.count_units,
        }),
        ...(val?.capacity?.unused !== undefined && {
          unused: (val?.capacity?.unused || 0) + (item?.capacity?.unused || 0),
        }),
        ...(val?.capacity?.unused_percent !== undefined && {
          unused_percent: (val?.capacity?.unused_percent || 0) + (item?.capacity?.unused_percent || 0),
        }),
      },
    }),
    ...(val?.limit && {
      limit: {
        value: (val?.limit?.value || 0) + (item?.limit?.value || 0),
        units: val?.limit?.units || defaultUnits,
      },
    }),
    ...(val?.request && {
      request: {
        ...(val?.request?.cpu !== undefined && {
          cpu: {
            value: (val?.request?.cpu?.value || 0) + (item?.request?.cpu?.value || 0),
            units: val?.request?.cpu?.units || defaultUnits,
          },
        }),
        ...(val?.request.memory !== undefined && {
          memory: {
            value: (val?.request?.memory?.value || 0) + (item?.request?.memory?.value || 0),
            units: val?.request?.memory?.units || defaultUnits,
          },
        }),
        ...(val?.request.value !== undefined && {
          value: (val?.request?.value || 0) + (item?.request?.value || 0),
          units: val?.request?.units || defaultUnits,
        }),
        ...(val?.request?.unused !== undefined && {
          unused: (val?.request?.unused || 0) + (item?.request.unused || 0),
        }),
        ...(val?.request?.unused_percent !== undefined && {
          unused_percent: (val?.request?.unused_percent || 0) + (item?.request?.unused_percent || 0),
        }),
      },
    }),
    ...(val?.usage && {
      usage: {
        value: (val?.usage.value || 0) + (item?.usage?.value || 0),
        units: val?.usage?.units || defaultUnits,
      },
    }),
  };
}

// Details pages typically use this function with filter[resolution]=monthly
export function getUnsortedComputedReportItems<R extends Report, T extends ReportItem>({
  idKey, // Note: The idKey must use org_entities for reports, while group_by uses org_unit_id
  isDateMap = false,
  isGroupBy = true,
  report,

  // Todo: Uncomment to omit group_by in breakdown page
  // isGroupBy = report?.data?.find(data => data.hasOwnProperty(`values`)) === undefined,
}: ComputedReportItemsParams<R, T>) {
  if (!report) {
    return [];
  }

  // Map<string | number, ComputedReportItem | Map<string | number, ComputedReportItem>
  const itemMap = new Map();

  const visitDataPoint = (dataPoint: ReportData) => {
    const type = dataPoint.type; // Org unit type

    if (isGroupBy) {
      if (dataPoint?.values instanceof Array) {
        dataPoint.values.forEach((val: any) => {
          initReportItems({
            idKey,
            isDateMap,
            itemMap,
            report,
            type,
            val,
          });
        });
      } else {
        // Avoid iterating over "tags.values" array returned by reports/aws/resources/ec2-compute API
        for (const key in dataPoint) {
          if (dataPoint[key] instanceof Array) {
            return dataPoint[key].forEach(visitDataPoint);
          }
        }
      }
    } else {
      for (const key in dataPoint) {
        if (dataPoint[key] instanceof Array) {
          dataPoint[key].forEach(val => {
            initReportItems({
              idKey,
              isDateMap,
              itemMap,
              report,
              type,
              val,
            });
          });
        }
      }
    }
  };
  if (report?.data) {
    report.data.forEach(visitDataPoint);
  }
  return Array.from(itemMap.values());
}

export function initReportItems({ idKey, isDateMap, itemMap, report, type, val }) {
  let id = val?.id || val[idKey];
  if (!id) {
    id = val?.date;
  }

  // Ensure unique map IDs -- https://github.com/project-koku/koku-ui/issues/706
  const idSuffix = idKey !== 'date' && idKey !== 'cluster' && val?.cluster ? `-${val.cluster}` : '';
  const mapId = `${id}${idSuffix}`;

  // 'clusters' will contain either the cluster alias or default cluster ID
  const cluster_alias = val?.clusters?.length > 0 ? val.clusters[0] : undefined;
  const cluster = cluster_alias || val?.cluster;
  const date = val?.date;
  const default_project = val?.default_project?.toLowerCase() === 'true';
  const gpu_model = val?.gpu_model;
  const gpu_vendor = val?.gpu_vendor;
  const node = val?.node;

  let label;
  if (report?.meta?.others && (id === 'Other' || id === 'Others')) {
    // Add count to "Others" label
    label = intl.formatMessage(messages.chartOthers, { count: report.meta.others });
  } else {
    const itemLabelKey = getItemLabel({ report, idKey, value: val });
    if (itemLabelKey === 'org_entities' && val?.alias) {
      label = val.alias;
    } else if (itemLabelKey === 'account' && val?.account_alias) {
      label = val.account_alias;
    } else if (itemLabelKey === 'cluster' && cluster_alias) {
      label = cluster_alias;
    } else if (itemLabelKey === 'subscription_guid' && val?.subscription_name) {
      label = val.subscription_name;
    } else if (itemLabelKey === 'resource_id' && val?.instance_name) {
      label = val.instance_name;
    } else if (val[itemLabelKey] instanceof Object) {
      label = val[itemLabelKey].value;
    } else {
      label = val[itemLabelKey];
    }
    if (label === undefined || label.trim().length === 0) {
      label = val?.alias?.trim()?.length > 0 ? val.alias : val[idKey];
    }
  }

  if (isDateMap) {
    const data = {
      ...val,
      ...getUsageData(val), // capacity, limit, request, & usage
      ...getGpuData(val), // gpu_count and memory
      cluster,
      clusters: getClusters(val),
      cost: getCostData(val, 'cost'),
      default_project,
      gpu_model,
      gpu_vendor,
      id,
      infrastructure: getCostData(val, 'infrastructure'),
      label,
      node,
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
        ...getGpuData(val, item), // gpu_count and memory
        cluster,
        clusters: getClusters(val, item),
        cost: getCostData(val, 'cost', item),
        date,
        default_project,
        gpu_model,
        gpu_vendor,
        id,
        infrastructure: getCostData(val, 'infrastructure', item),
        label,
        node,
        supplementary: getCostData(val, 'supplementary', item),
        type,
      });
    } else {
      itemMap.set(mapId, {
        ...val,
        ...getUsageData(val), // capacity, limit, request, & usage
        ...getGpuData(val), // gpu_count and memory
        cluster,
        clusters: getClusters(val),
        cost: getCostData(val, 'cost'),
        date,
        default_project,
        gpu_model,
        gpu_vendor,
        id,
        infrastructure: getCostData(val, 'infrastructure'),
        label,
        node,
        supplementary: getCostData(val, 'supplementary'),
        type,
      });
    }
  }
}
