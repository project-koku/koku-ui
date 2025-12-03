import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import { platformCategoryKey, tagPrefix } from '@koku-ui/utils/props';

import type { CostOverviewWidget } from '../common/costOverviewCommon';
import { CostOverviewWidgetType } from '../common/costOverviewCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const clusterWidget: CostOverviewWidget = {
  id: getId(),
  cluster: {
    reportGroupBy: 'project',
  },
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['project'],
  type: CostOverviewWidgetType.cluster,
};

export const costBreakdownWidget: CostOverviewWidget = {
  chartName: 'costBreakdownWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.costBreakdown,
};

export const cpuUsageWidget: CostOverviewWidget = {
  chartName: 'ocpCpuWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
  type: CostOverviewWidgetType.cpuUsage,
};

export const memoryUsageWidget: CostOverviewWidget = {
  chartName: 'ocpMemoryWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
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
  reportPathsType: ReportPathsType.ocp,
  showWidgetOnGroupBy: ['cluster'],
  showWidgetOnPlatformCategory: [platformCategoryKey],
  type: CostOverviewWidgetType.reportSummary,
};

export const pvcWidget: CostOverviewWidget = {
  chartName: 'ocpPvcWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  showWidgetOnGroupBy: ['project'],
  type: CostOverviewWidgetType.pvc,
};

// Storage summary
export const volumeSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'storageclass',
    usePlaceholder: true,
  },
  reportType: ReportType.volume,
  reportPathsType: ReportPathsType.ocp,
  showWidgetOnGroupBy: ['cluster', 'node', 'project'],
  type: CostOverviewWidgetType.reportSummary,
};

export const volumeUsageWidget: CostOverviewWidget = {
  chartName: 'ocpVolumeWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  showWidgetOnGroupBy: ['cluster', 'node', tagPrefix],
  type: CostOverviewWidgetType.volumeUsage,
};
