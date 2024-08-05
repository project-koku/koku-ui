import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  type HistoricalDataWidget,
  HistoricalDataWidgetType,
} from 'store/breakdown/historicalData/common/historicalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: HistoricalDataWidget = {
  chartName: 'ibmCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: HistoricalDataWidget = {
  chartName: 'ibmComputeChart',
  id: getId(),
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.trend,
};

export const storageUsageWidget: HistoricalDataWidget = {
  chartName: 'ibmStorageChart',
  id: getId(),
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.trend,
};
