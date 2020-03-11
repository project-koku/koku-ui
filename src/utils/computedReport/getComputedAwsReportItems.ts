import { AwsQuery } from 'api/awsQuery';
import { AwsReport, AwsReportData, AwsReportValue } from 'api/awsReports';
import { ReportDatum } from 'api/reports';
import { sort, SortDirection } from 'utils/sort';
import { ComputedReportItem } from './getComputedReportItems';
import { getItemLabel } from './getItemLabel';

/*
import {
  ComputedAwsReportItem,
  getComputedAwsReportItems,
  GetComputedAwsReportItemsParams,
} from 'utils/computedReport/getComputedAwsReportItems';
 */

export interface ComputedAwsReportItem extends ComputedReportItem {
  cost: number;
  deltaPercent: number;
  deltaValue: number;
  derivedCost: number;
  id: string | number;
  infrastructureCost: number;
  label: string | number;
  units: string;
}

export interface GetComputedAwsReportItemsParams {
  report: AwsReport;
  idKey: keyof AwsReportValue;
  sortKey?: keyof ComputedAwsReportItem;
  labelKey?: keyof AwsReportValue;
  sortDirection?: SortDirection;
}

export function getComputedAwsReportItems({
  report,
  idKey,
  labelKey = idKey,
  sortKey = 'cost',
  sortDirection = SortDirection.asc,
}: GetComputedAwsReportItemsParams) {
  return sort(
    getUnsortedComputedAwsReportItems({
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

export function getUnsortedComputedAwsReportItems({
  report,
  idKey,
  labelKey = idKey,
}: GetComputedAwsReportItemsParams) {
  if (!report) {
    return [];
  }

  const itemMap: Map<string | number, ComputedAwsReportItem> = new Map();

  const visitDataPoint = (dataPoint: AwsReportData) => {
    if (dataPoint.values) {
      dataPoint.values.forEach((value: any) => {
        const cost = value.usage ? value.usage.value : value.cost.value;
        const derivedCost = value.derived_cost ? value.derived_cost.value : 0;
        const infrastructureCost = value.infrastructure_cost
          ? value.infrastructure_cost.value
          : 0;
        const id = value[idKey];
        let label;
        const itemLabelKey = getItemLabel({ report, labelKey, value });
        if (value[itemLabelKey] instanceof Object) {
          label = (value[itemLabelKey] as ReportDatum).value;
        } else {
          label = value[itemLabelKey];
        }
        if (itemLabelKey === 'account' && value.account_alias) {
          label = value.account_alias;
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
            units: value.usage
              ? value.usage.units
              : value.cost
              ? value.cost.units
              : 'USD',
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
  groupBy: AwsQuery['group_by'] = {}
): GetComputedAwsReportItemsParams['idKey'] {
  if (groupBy.account) {
    return 'account';
  }
  if (groupBy.instance_type) {
    return 'instance_type';
  }
  if (groupBy.region) {
    return 'region';
  }
  if (groupBy.service) {
    return 'service';
  }
  return 'date';
}
