import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/costOverview/common/costOverviewCommon';
import { OcpCostOverviewWidget } from './ocpCostOverviewCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costBreakdownWidget: OcpCostOverviewWidget = {
  id: getId(),
  costBreakdown: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
  },
  type: CostOverviewWidgetType.costBreakdown,
};

export const cpuUsageWidget: OcpCostOverviewWidget = {
  id: getId(),
  cpuUsage: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
    showCapacityOnGroupBy: ['cluster'],
  },
  type: CostOverviewWidgetType.cpuUsage,
};

export const memoryUsageWidget: OcpCostOverviewWidget = {
  id: getId(),
  memoryUsage: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
    showCapacityOnGroupBy: ['cluster'],
  },
  type: CostOverviewWidgetType.memoryUsage,
};

export const projectSummaryWidget: OcpCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'project',
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: ['cluster'],
    usePlaceholder: true,
  },
  type: CostOverviewWidgetType.reportSummary,
};
