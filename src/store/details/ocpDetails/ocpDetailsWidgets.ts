import { ReportPathsType, ReportType } from 'api/reports/report';
import { DetailsWidgetType } from 'store/details/common/detailsCommon';
import { OcpDetailsWidget } from './ocpDetailsCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costBreakdownWidget: OcpDetailsWidget = {
  id: getId(),
  costBreakdown: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
  },
  type: DetailsWidgetType.costBreakdown,
};

export const cpuUsageWidget: OcpDetailsWidget = {
  id: getId(),
  cpuUsage: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
    showCapacityOnGroupBy: ['cluster'],
  },
  type: DetailsWidgetType.cpuUsage,
};

export const memoryUsageWidget: OcpDetailsWidget = {
  id: getId(),
  memoryUsage: {
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
    showCapacityOnGroupBy: ['cluster'],
  },
  type: DetailsWidgetType.memoryUsage,
};

export const projectSummaryWidget: OcpDetailsWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'project',
    reportPathsType: ReportPathsType.ocp,
    reportType: ReportType.cost,
    showWidgetOnGroupBy: ['cluster'],
    usePlaceholder: true,
  },
  type: DetailsWidgetType.reportSummary,
};
