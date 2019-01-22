import { OcpQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportData, OcpReportValue } from 'api/ocpReports';
import { Omit } from 'react-redux';
import { sort, SortDirection } from './sort';

export interface ComputedOcpReportItem {
  app?: string;
  capacity?: number;
  charge: number;
  deltaPercent: number;
  deltaValue: number;
  id: string | number;
  label: string | number;
  limit?: number;
  request?: number;
  units: OcpReportValue['units'];
  usage?: number;
}

export interface GetComputedOcpReportItemsParams {
  report: OcpReport;
  idKey: keyof Omit<OcpReportValue, 'charge' | 'units' | 'count'>;
  sortKey?: keyof ComputedOcpReportItem;
  labelKey?: keyof OcpReportValue;
  sortDirection?: SortDirection;
}

const groups = ['apps', 'clusters', 'nodes', 'projects'];

export function getComputedOcpReportItems({
  report,
  idKey,
  labelKey = idKey,
  sortKey = 'charge',
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
        const capacity = value.capacity;
        const charge = value.charge;
        const id = value[idKey];
        let label = value[labelKey];
        if (labelKey === 'cluster' && value.cluster_alias) {
          label = value.cluster_alias;
        }
        const limit = value.limit;
        const request = value.request;
        const usage = value.usage;
        if (!itemMap[id]) {
          itemMap[id] = {
            app: value.app,
            capacity,
            charge,
            deltaPercent: value.delta_percent,
            deltaValue: value.delta_value,
            id,
            label,
            limit,
            request,
            units: value.units || usage ? 'GB' : 'USD',
            usage,
          };
          return;
        }
        itemMap[id] = {
          ...itemMap[id],
          capacity: itemMap[id].capacity + capacity,
          charge: itemMap[id].charge + charge,
          limit: itemMap[id].limit + limit,
          request: itemMap[id].request + request,
          usage: itemMap[id].usage + usage,
        };
      });
    }
    groups.forEach(group => {
      if (dataPoint[group]) {
        return dataPoint[group].forEach(visitDataPoint);
      }
    });
  };
  if (report && report.data) {
    report.data.forEach(visitDataPoint);
  }
  return Object.values(itemMap);
}

export function getIdKeyForGroupBy(
  groupBy: OcpQuery['group_by'] = {}
): GetComputedOcpReportItemsParams['idKey'] {
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
