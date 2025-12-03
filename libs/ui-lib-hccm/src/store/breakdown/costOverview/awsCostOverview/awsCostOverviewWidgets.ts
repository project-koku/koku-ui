import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import { tagPrefix } from '@koku-ui/utils/props';

import type { CostOverviewWidget } from '../common/costOverviewCommon';
import { CostOverviewWidgetType } from '../common/costOverviewCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costBreakdownWidget: CostOverviewWidget = {
  chartName: 'costBreakdownWidget',
  id: getId(),
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.costBreakdown,
};

export const accountSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'account',
  },
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['region', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
  },
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['account', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: CostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service',
  },
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['region', 'account', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};
