import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { platformCategoryKey, tagPrefix } from 'utils/props';

import type { OcpCostOverviewWidget } from './ocpCostOverviewCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const clusterWidget: OcpCostOverviewWidget = {
  id: getId(),
  cluster: {
    reportGroupBy: 'project',
  },
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['project'],
  type: CostOverviewWidgetType.cluster,
};

export const costWidget: OcpCostOverviewWidget = {
  chartName: 'ocpCostWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const costDistributionWidget: OcpCostOverviewWidget = {
  chartName: 'ocpCostDistributionWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.costDistribution,
};

export const cpuUsageWidget: OcpCostOverviewWidget = {
  chartName: 'ocpCpuWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
  type: CostOverviewWidgetType.cpuUsage,
};

export const memoryUsageWidget: OcpCostOverviewWidget = {
  chartName: 'ocpMemoryWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.memory,
  type: CostOverviewWidgetType.memoryUsage,
};

export const projectSummaryWidget: OcpCostOverviewWidget = {
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

export const pvcWidget: OcpCostOverviewWidget = {
  chartName: 'ocpPvcWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  showWidgetOnGroupBy: ['project'],
  type: CostOverviewWidgetType.pvc,
};

// Storage summary
export const volumeSummaryWidget: OcpCostOverviewWidget = {
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

export const volumeUsageWidget: OcpCostOverviewWidget = {
  chartName: 'ocpVolumeWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  showWidgetOnGroupBy: ['cluster', 'node', tagPrefix],
  type: CostOverviewWidgetType.volumeUsage,
};
