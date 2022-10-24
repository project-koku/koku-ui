import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/breakdown/historicalData/common/historicalDataCommon';

import type { GcpHistoricalDataWidget } from './gcpHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: GcpHistoricalDataWidget = {
  chartName: 'gcpCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: GcpHistoricalDataWidget = {
  chartName: 'gcpComputeChart',
  id: getId(),
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.trend,
};

export const storageUsageWidget: GcpHistoricalDataWidget = {
  chartName: 'gcpStorageChart',
  id: getId(),
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.trend,
};
