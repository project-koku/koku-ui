import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';

import { type HistoricalDataWidget, HistoricalDataWidgetType } from '../common/historicalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

// Cost comparison
export const costWidget: HistoricalDataWidget = {
  chartName: 'ocpCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.cost,
};

// CPU usage, request, and limit comparison
export const cpuUsageWidget: HistoricalDataWidget = {
  chartName: 'ocpCpuChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
  showLimit: true,
  showRequest: true,
  type: HistoricalDataWidgetType.usage,
};

// Memory usage, request, and limit comparison
export const memoryUsageWidget: HistoricalDataWidget = {
  chartName: 'ocpMemoryChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.memory,
  showLimit: true,
  showRequest: true,
  type: HistoricalDataWidgetType.usage,
};

// Network usage comparison (shown when grouped by cluster and node)
export const networkUsageWidget: HistoricalDataWidget = {
  chartName: 'ocpNetworkChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.network,
  showRequest: true, // Reusing request to show "Data in" legend
  showWidgetOnGroupBy: ['cluster', 'node'],
  type: HistoricalDataWidgetType.network,
};

// Storage usage comparison
export const volumeUsageWidget: HistoricalDataWidget = {
  chartName: 'ocpVolumeChart',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  showRequest: true,
  showWidgetOnGroupBy: ['cluster', 'node', 'project'],
  type: HistoricalDataWidgetType.volume,
};
