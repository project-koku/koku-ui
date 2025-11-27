import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';

import { type HistoricalDataWidget, HistoricalDataWidgetType } from '../common/historicalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: HistoricalDataWidget = {
  chartName: 'azureCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: HistoricalDataWidget = {
  chartName: 'azureComputeChart',
  id: getId(),
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.usage,
};

export const storageUsageWidget: HistoricalDataWidget = {
  chartName: 'azureStorageChart',
  id: getId(),
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.usage,
};
