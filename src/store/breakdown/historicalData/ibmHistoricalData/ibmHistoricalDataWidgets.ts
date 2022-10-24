import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/breakdown/historicalData/common/historicalDataCommon';

import type { IbmHistoricalDataWidget } from './ibmHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: IbmHistoricalDataWidget = {
  chartName: 'ibmCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: IbmHistoricalDataWidget = {
  chartName: 'ibmComputeChart',
  id: getId(),
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.trend,
};

export const storageUsageWidget: IbmHistoricalDataWidget = {
  chartName: 'ibmStorageChart',
  id: getId(),
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.trend,
};
