import { ReportPathsType, ReportType } from 'api/reports/report';
import { HistoricalDataWidgetType } from 'store/breakdown/historicalData/common/historicalDataCommon';

import type { RhelHistoricalDataWidget } from './rhelHistoricalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: RhelHistoricalDataWidget = {
  chartName: 'rhelCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.cost,
};

export const cpuUsageWidget: RhelHistoricalDataWidget = {
  chartName: 'rhelCpuChart',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cpu,
  type: HistoricalDataWidgetType.usage,
};

export const memoryUsageWidget: RhelHistoricalDataWidget = {
  chartName: 'rhelMemoryChart',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.memory,
  type: HistoricalDataWidgetType.usage,
};
