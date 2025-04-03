import { ReportPathsType, ReportType } from 'api/reports/report';
import type { CostOverviewWidget } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { platformCategoryKey } from 'utils/props';

let currrentId = 0;
const getId = () => currrentId++;

export const clusterWidget: CostOverviewWidget = {
  id: getId(),
  cluster: {
    reportGroupBy: 'project',
  },
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['project'],
  type: CostOverviewWidgetType.cluster,
};

export const costBreakdownWidget: CostOverviewWidget = {
  chartName: 'costBreakdownWidget',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.costBreakdown,
};

export const costWidget: CostOverviewWidget = {
  chartName: 'rhelCostWidget',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const cpuUsageWidget: CostOverviewWidget = {
  chartName: 'rhelCpuWidget',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.cpu,
  type: CostOverviewWidgetType.cpuUsage,
};

export const memoryUsageWidget: CostOverviewWidget = {
  chartName: 'rhelMemoryWidget',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.memory,
  type: CostOverviewWidgetType.memoryUsage,
};

export const projectSummaryWidget: CostOverviewWidget = {
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

export const volumeUsageWidget: CostOverviewWidget = {
  chartName: 'rhelVolumeWidget',
  id: getId(),
  reportPathsType: ReportPathsType.rhel,
  reportType: ReportType.volume,
  type: CostOverviewWidgetType.volumeUsage,
};
