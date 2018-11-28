import { OcpQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportData, OcpReportValue } from 'api/ocpReports';
import { Omit } from 'react-redux';
import { sort, SortDirection } from './sort';

export interface ComputedOcpReportItem {
  deltaPercent: number;
  deltaValue: number;
  id: string | number;
  label: string | number;
  total: number;
  units: OcpReportValue['units'];
}

export interface GetComputedOcpReportItemsParams {
  report: OcpReport;
  idKey: keyof Omit<OcpReportValue, 'total' | 'units' | 'count'>;
  sortKey?: keyof ComputedOcpReportItem;
  labelKey?: keyof OcpReportValue;
  sortDirection?: SortDirection;
}

const groups = ['services', 'accounts', 'instance_types', 'regions'];

export function getComputedOcpReportItems({
  report,
  idKey,
  labelKey = idKey,
  sortKey = 'total',
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

  const itemMap: Record<string, ComputedOcpReportItem> = {};

  const visitDataPoint = (dataPoint: OcpReportData) => {
    if (dataPoint.values) {
      dataPoint.values.forEach(value => {
        const total = value.total;
        const id = value[idKey];
        let label = value[labelKey];
        if (labelKey === 'account' && value.account_alias) {
          label = value.account_alias;
        }
        if (!itemMap[id]) {
          itemMap[id] = {
            deltaPercent: value.delta_percent,
            deltaValue: value.delta_value,
            id,
            total,
            label,
            units: value.units,
          };
          return;
        }
        itemMap[id] = {
          ...itemMap[id],
          total: itemMap[id].total + total,
        };
      });
    }
    groups.forEach(group => {
      if (dataPoint[group]) {
        return dataPoint[group].forEach(visitDataPoint);
      }
    });
  };
  report.data.forEach(visitDataPoint);
  return Object.values(itemMap);
}

export function getIdKeyForGroupBy(
  groupBy: OcpQuery['group_by'] = {}
): GetComputedOcpReportItemsParams['idKey'] {
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
