import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/breakdown/historicalData/common/historicalDataCommon';

import { OcpHistoricalDataWidget } from './ocpHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: OcpHistoricalDataWidget = {
  chartName: 'ocpCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.cost,
};

export const cpuUsageWidget: OcpHistoricalDataWidget = {
  chartName: 'ocpCpuChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
  type: HistoricalDataWidgetType.usage,
};

export const memoryUsageWidget: OcpHistoricalDataWidget = {
  chartName: 'ocpMemoryChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.memory,
  type: HistoricalDataWidgetType.usage,
};
