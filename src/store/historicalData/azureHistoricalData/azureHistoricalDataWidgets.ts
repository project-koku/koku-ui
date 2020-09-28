import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/historicalData/common/historicalDataCommon';

import { AzureHistoricalDataWidget } from './azureHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: AzureHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: AzureHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.trend,
};

export const storageUsageWidget: AzureHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.azure,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.trend,
};
