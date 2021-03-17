import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/breakdown/historicalData/common/historicalDataCommon';

import { AwsHistoricalDataWidget } from './awsHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: AwsHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: AwsHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.instanceType,
  type: HistoricalDataWidgetType.usage,
};

export const storageUsageWidget: AwsHistoricalDataWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.storage,
  type: HistoricalDataWidgetType.usage,
};
