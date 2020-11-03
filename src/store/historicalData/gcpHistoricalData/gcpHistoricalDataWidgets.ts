import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/historicalData/common/historicalDataCommon';

import { GcpHistoricalDataWidget } from './gcpHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: GcpHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: GcpHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.trend,
};

export const storageUsageWidget: GcpHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.trend,
};
