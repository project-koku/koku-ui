import { tagPrefix } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';

import type { AwsCostOverviewWidget } from './awsCostOverviewCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: AwsCostOverviewWidget = {
  chartName: 'awsCostWidget',
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: AwsCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'account',
    showWidgetOnGroupBy: ['region', 'service', tagPrefix],
  },
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: AwsCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
    showWidgetOnGroupBy: ['account', 'service', tagPrefix],
  },
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: AwsCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service',
    showWidgetOnGroupBy: ['region', 'account', tagPrefix],
  },
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};
