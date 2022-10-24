import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/breakdown/historicalData/common/historicalDataCommon';

import type { OciHistoricalDataWidget } from './ociHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: OciHistoricalDataWidget = {
  chartName: 'ociCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: OciHistoricalDataWidget = {
  chartName: 'ociComputeChart',
  id: getId(),
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.usage,
};

export const storageUsageWidget: OciHistoricalDataWidget = {
  chartName: 'ociStorageChart',
  id: getId(),
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.usage,
};
