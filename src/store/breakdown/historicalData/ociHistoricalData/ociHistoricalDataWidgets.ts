import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/breakdown/historicalData/common/historicalDataCommon';

import { OciHistoricalDataWidget } from './ociHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: OciHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: OciHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.usage,
};

export const storageUsageWidget: OciHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.oci,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.usage,
};
