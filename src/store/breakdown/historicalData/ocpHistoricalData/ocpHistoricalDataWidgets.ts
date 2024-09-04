import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  type HistoricalDataWidget,
  HistoricalDataWidgetType,
} from 'store/breakdown/historicalData/common/historicalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: HistoricalDataWidget = {
  chartName: 'ocpCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.cost,
};

export const cpuUsageWidget: HistoricalDataWidget = {
  chartName: 'ocpCpuChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
  type: HistoricalDataWidgetType.usage,
};

export const memoryUsageWidget: HistoricalDataWidget = {
  chartName: 'ocpMemoryChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.memory,
  type: HistoricalDataWidgetType.usage,
};

export const networkUsageWidget: HistoricalDataWidget = {
  chartName: 'ocpNetworkChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.network,
  showWidgetOnGroupBy: ['cluster', 'node'],
  type: HistoricalDataWidgetType.network,
};

export const volumeUsageWidget: HistoricalDataWidget = {
  chartName: 'ocpVolumeChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  showWidgetOnGroupBy: ['cluster', 'node', 'project'],
  type: HistoricalDataWidgetType.volume,
};
