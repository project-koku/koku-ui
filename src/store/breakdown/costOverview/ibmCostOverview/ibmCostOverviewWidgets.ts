import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { tagPrefix } from 'utils/props';

import type { IbmCostOverviewWidget } from './ibmCostOverviewCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: IbmCostOverviewWidget = {
  chartName: 'ibmCostWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: IbmCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'account',
  },
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['project', 'region', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const projectSummaryWidget: IbmCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'project',
  },
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['account', 'region', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: IbmCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
  },
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['account', 'project', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: IbmCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service',
  },
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['project', 'region', 'account', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};
