import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/breakdown/historicalData/common/historicalDataCommon';

import type { OcpHistoricalDataWidget } from './ocpHistoricalDataCommon';

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

export const networkUsageWidget: OcpHistoricalDataWidget = {
  chartName: 'ocpNetworkChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.network,
  showWidgetOnGroupBy: ['cluster', 'node'],
  type: HistoricalDataWidgetType.network,
};

export const volumeUsageWidget: OcpHistoricalDataWidget = {
  chartName: 'ocpVolumeChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  showWidgetOnGroupBy: ['cluster', 'node', 'project'],
  type: HistoricalDataWidgetType.volume,
};
