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
  },
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['project'],
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
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cpu,
  type: CostOverviewWidgetType.cpuUsage,
};

export const memoryUsageWidget: RhelCostOverviewWidget = {
  chartName: 'rhelMemoryWidget',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.memory,
  type: CostOverviewWidgetType.memoryUsage,
};

export const projectSummaryWidget: RhelCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'project',
    usePlaceholder: true,
  },
  reportType: ReportType.cost,
  reportPathsType: ReportPathsType.rhel,
  showWidgetOnPlatformCategory: [platformCategoryKey],
  showWidgetOnGroupBy: ['cluster'],
  type: CostOverviewWidgetType.reportSummary,
};

export const volumeUsageWidget: RhelCostOverviewWidget = {
  chartName: 'rhelVolumeWidget',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.volume,
  type: CostOverviewWidgetType.volumeUsage,
};
