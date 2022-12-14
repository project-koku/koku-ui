import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { platformCategoryKey } from 'utils/props';

import type { RhelCostOverviewWidget } from './rhelCostOverviewCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const clusterWidget: RhelCostOverviewWidget = {
  id: getId(),
  cluster: {
    reportGroupBy: 'project',
    showWidgetOnGroupBy: ['project'],
  },
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cluster,
};

export const costWidget: RhelCostOverviewWidget = {
  chartName: 'rhelCostWidget',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const cpuUsageWidget: RhelCostOverviewWidget = {
  chartName: 'rhelCpuWidget',
  id: getId(),
  usage: {
    showCapacityOnGroupBy: ['cluster'],
  },
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cpu,
  type: CostOverviewWidgetType.cpuUsage,
};

export const memoryUsageWidget: RhelCostOverviewWidget = {
  chartName: 'rhelMemoryWidget',
  id: getId(),
  usage: {
    showCapacityOnGroupBy: ['cluster'],
  },
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.memory,
  type: CostOverviewWidgetType.memoryUsage,
};

export const projectSummaryWidget: RhelCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'project',
    showWidgetOnCategory: [platformCategoryKey],
    showWidgetOnGroupBy: ['cluster'],
    usePlaceholder: true,
  },
  reportType: ReportType.cost,
  reportPathsType: ReportPathsType.rhel,
  type: CostOverviewWidgetType.reportSummary,
};

export const volumeUsageWidget: RhelCostOverviewWidget = {
  chartName: 'rhelVolumeWidget',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.volume,
  type: CostOverviewWidgetType.volumeUsage,
};
