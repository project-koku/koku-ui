import { AzureQuery } from 'api/azureQuery';
import {
  AzureDatum,
  AzureReport,
  AzureReportData,
  AzureReportValue,
} from 'api/azureReports';
import { Omit } from 'react-redux';
import { sort, SortDirection } from './sort';

export interface ComputedAzureReportItem {
  cost: number;
  deltaPercent: number;
  deltaValue: number;
  derivedCost: number;
  id: string | number;
  infrastructureCost: number;
  label: string | number;
  units: string;
}

export interface GetComputedAzureReportItemsParams {
  report: AzureReport;
  idKey: keyof Omit<
    AzureReportValue,
    'cost' | 'count' | 'derived_cost' | 'infrastructure_cost' | 'usage'
  >;
  sortKey?: keyof ComputedAzureReportItem;
  labelKey?: keyof AzureReportValue;
  sortDirection?: SortDirection;
}

export function getComputedAzureReportItems({
  report,
  idKey,
  labelKey = idKey,
  sortKey = 'cost',
  sortDirection = SortDirection.asc,
}: GetComputedAzureReportItemsParams) {
  return sort(
    getUnsortedComputedAzureReportItems({
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

export function getUnsortedComputedAzureReportItems({
  report,
  idKey,
  labelKey = idKey,
}: GetComputedAzureReportItemsParams) {
  if (!report) {
    return [];
  }

  const itemMap: Map<string | number, ComputedAzureReportItem> = new Map();

  const visitDataPoint = (dataPoint: AzureReportData) => {
    if (dataPoint.values) {
      dataPoint.values.forEach(value => {
        const cost = value.usage ? value.usage.value : value.cost.value;
        const derivedCost = value.derived_cost ? value.derived_cost.value : 0;
        const infrastructureCost = value.infrastructure_cost
          ? value.infrastructure_cost.value
          : 0;
        const id = value[idKey];
        let label;
        if (value[labelKey] instanceof Object) {
          label = (value[labelKey] as AzureDatum).value;
        } else {
          label = value[labelKey];
        }
        if (!itemMap.get(id)) {
          itemMap.set(id, {
            cost,
            deltaPercent: value.delta_percent,
            deltaValue: value.delta_value,
            derivedCost,
            id,
            infrastructureCost,
            label,
            units: value.usage ? value.usage.units : value.cost.units,
          });
          return;
        }
        itemMap.set(id, {
          ...itemMap.get(id),
          cost: itemMap.get(id).cost + cost,
          derivedCost: itemMap.get(id).derivedCost + derivedCost,
          infrastructureCost:
            itemMap.get(id).infrastructureCost + infrastructureCost,
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
  groupBy: AzureQuery['group_by'] = {}
): GetComputedAzureReportItemsParams['idKey'] {
  if (groupBy.subscription_guid) {
    return 'subscription_guid';
  }
  if (groupBy.instance_type) {
    return 'instance_type';
  }
  if (groupBy.resource_location) {
    return 'resource_location';
  }
  if (groupBy.service_name) {
    return 'service_name';
  }
  return 'date';
}
