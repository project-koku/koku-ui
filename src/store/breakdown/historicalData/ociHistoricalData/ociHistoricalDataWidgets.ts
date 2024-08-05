import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  type HistoricalDataWidget,
  HistoricalDataWidgetType,
} from 'store/breakdown/historicalData/common/historicalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: HistoricalDataWidget = {
  chartName: 'ociCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: HistoricalDataWidget = {
  chartName: 'ociComputeChart',
  id: getId(),
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.usage,
};

export const storageUsageWidget: HistoricalDataWidget = {
  chartName: 'ociStorageChart',
  id: getId(),
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.usage,
};
