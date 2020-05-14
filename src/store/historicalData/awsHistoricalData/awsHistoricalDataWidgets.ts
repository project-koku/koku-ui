import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/historicalData/common/historicalDataCommon';
import { AwsHistoricalDataWidget } from './awsHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: AwsHistoricalDataWidget = {
  id: getId(),
  trend: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
  },
  type: HistoricalDataWidgetType.trend,
};

export const computeUsageWidget: AwsHistoricalDataWidget = {
  id: getId(),
  trend: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.instanceType,
  },
  type: HistoricalDataWidgetType.trend,
};

export const storageUsageWidget: AwsHistoricalDataWidget = {
  id: getId(),
  trend: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.storage,
  },
  type: HistoricalDataWidgetType.trend,
};
