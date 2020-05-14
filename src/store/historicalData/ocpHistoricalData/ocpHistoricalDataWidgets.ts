import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/historicalData/common/historicalDataCommon';
import { OcpHistoricalDataWidget } from './ocpHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: OcpHistoricalDataWidget = {
  id: getId(),
  cost: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
  },
  type: HistoricalDataWidgetType.cost,
};

export const cpuUsageWidget: OcpHistoricalDataWidget = {
  id: getId(),
  usage: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cpu,
  },
  type: HistoricalDataWidgetType.usage,
};

export const memoryUsageWidget: OcpHistoricalDataWidget = {
  id: getId(),
  usage: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.memory,
  },
  type: HistoricalDataWidgetType.usage,
};
