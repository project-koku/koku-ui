import { ReportPathsType, ReportType } from 'api/reports/report';
import type { CostOverviewWidget } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { tagPrefix } from 'utils/props';

let currrentId = 0;
const getId = () => currrentId++;

export const costBreakdownWidget: CostOverviewWidget = {
  chartName: 'costBreakdownWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.costBreakdown,
};

export const accountSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'account',
  },
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['project', 'region', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const projectSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'project',
  },
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['account', 'region', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
  },
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['account', 'project', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service',
  },
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['project', 'region', 'account', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};
