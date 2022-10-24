import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/breakdown/historicalData/common/historicalDataCommon';

import type { AzureHistoricalDataWidget } from './azureHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: AzureHistoricalDataWidget = {
  chartName: 'azureCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: AzureHistoricalDataWidget = {
  chartName: 'azureComputeChart',
  id: getId(),
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.usage,
};

export const storageUsageWidget: AzureHistoricalDataWidget = {
  chartName: 'azureStorageChart',
  id: getId(),
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.usage,
};
