import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  type HistoricalDataWidget,
  HistoricalDataWidgetType,
} from 'store/breakdown/historicalData/common/historicalDataCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: HistoricalDataWidget = {
  chartName: 'rhelCostChart',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cost,
  type: HistoricalDataWidgetType.cost,
};

export const cpuUsageWidget: HistoricalDataWidget = {
  chartName: 'rhelCpuChart',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cpu,
  type: HistoricalDataWidgetType.usage,
};

export const memoryUsageWidget: HistoricalDataWidget = {
  chartName: 'rhelMemoryChart',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.memory,
  type: HistoricalDataWidgetType.usage,
};
