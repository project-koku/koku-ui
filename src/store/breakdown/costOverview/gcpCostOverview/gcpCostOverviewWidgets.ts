import { ReportPathsType, ReportType } from 'api/reports/report';
import type { CostOverviewWidget } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { tagPrefix } from 'utils/props';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: CostOverviewWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'account',
  },
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['gcp_project', 'region', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const projectSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'gcp_project',
  },
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['account', 'region', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
  },
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['account', 'gcp_project', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service',
  },
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['gcp_project', 'region', 'account', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};
