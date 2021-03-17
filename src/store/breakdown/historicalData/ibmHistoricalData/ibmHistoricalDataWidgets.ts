import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/breakdown/historicalData/common/historicalDataCommon';

import { IbmHistoricalDataWidget } from './ibmHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: IbmHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: IbmHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.trend,
};

export const storageUsageWidget: IbmHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.trend,
};
