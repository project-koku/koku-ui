import { Report, ReportData, ReportValue } from 'api/reports';
import { Omit } from 'react-redux';

export interface ComputedReportItem {
  id: string | number;
  label: string | number;
  total: number;
  units: ReportValue['units'];
}

export interface GetComputedReportItemsParams {
  report: Report;
  idKey: keyof Omit<ReportValue, 'total' | 'units' | 'count'>;
  sortKey?: keyof ComputedReportItem;
  labelKey?: keyof ReportValue;
}

const groups = ['services', 'accounts', 'instance_types'];

export function getComputedReportItems({
  report,
  idKey,
  labelKey = idKey,
  sortKey = 'total',
}: GetComputedReportItemsParams) {
  const itemMap: Record<string, ComputedReportItem> = {};

  const visitDataPoint = (dataPoint: ReportData) => {
    if (dataPoint.values) {
      dataPoint.values.forEach(value => {
        const id = value[idKey];
        const total = value.total;
        if (!itemMap[id]) {
          itemMap[id] = {
            id,
            total: 0,
            label: value[labelKey],
            units: value.units,
          };
          return;
        }
        itemMap[id].total = itemMap[id].total + total;
      });
    }
    groups.forEach(group => {
      if (dataPoint[group]) {
        return dataPoint[group].forEach(visitDataPoint);
      }
    });
  };
  report.data.forEach(visitDataPoint);

  return Object.values(itemMap).sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal > bVal) {
      return -1;
    }
    if (aVal < bVal) {
      return 1;
    }
    return 0;
  });
}
