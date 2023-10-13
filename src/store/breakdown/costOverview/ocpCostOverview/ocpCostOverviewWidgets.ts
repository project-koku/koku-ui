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
    showWidgetOnGroupBy: ['project'],
  },
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
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
  usage: {
    showCapacityOnGroupBy: ['cluster'],
  },
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
  type: CostOverviewWidgetType.cpuUsage,
};

export const memoryUsageWidget: OcpCostOverviewWidget = {
  chartName: 'ocpMemoryWidget',
  id: getId(),
  usage: {
    showCapacityOnGroupBy: ['cluster'],
  },
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.memory,
  type: CostOverviewWidgetType.memoryUsage,
};

export const projectSummaryWidget: OcpCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'project',
    showWidgetOnPlatformCategory: [platformCategoryKey],
    showWidgetOnGroupBy: ['cluster'],
    usePlaceholder: true,
  },
  reportType: ReportType.cost,
  reportPathsType: ReportPathsType.ocp,
  type: CostOverviewWidgetType.reportSummary,
};

export const pvcWidget: OcpCostOverviewWidget = {
  chartName: 'ocpPvcWidget',
  id: getId(),
  pvc: {
    showWidgetOnGroupBy: ['project'],
  },
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  type: CostOverviewWidgetType.pvc,
};

export const volumeUsageWidget: OcpCostOverviewWidget = {
  chartName: 'ocpVolumeWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  type: CostOverviewWidgetType.volumeUsage,
  volume: {
    showWidgetOnGroupBy: ['cluster', 'node', tagPrefix],
  },
};
