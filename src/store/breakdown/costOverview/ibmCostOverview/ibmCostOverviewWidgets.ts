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
    showWidgetOnGroupBy: ['project', 'region', 'service', tagPrefix],
  },
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const projectSummaryWidget: IbmCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'project',
    showWidgetOnGroupBy: ['account', 'region', 'service', tagPrefix],
  },
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: IbmCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
    showWidgetOnGroupBy: ['account', 'project', 'service', tagPrefix],
  },
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: IbmCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service',
    showWidgetOnGroupBy: ['project', 'region', 'account', tagPrefix],
  },
  reportPathsType: ReportPathsType.ibm,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};
