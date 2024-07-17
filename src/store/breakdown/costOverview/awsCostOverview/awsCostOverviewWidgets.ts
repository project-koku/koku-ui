import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { tagPrefix } from 'utils/props';

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
  },
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['region', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: AwsCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
  },
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['account', 'service', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: AwsCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service',
  },
  reportPathsType: ReportPathsType.aws,
  reportType: ReportType.cost,
  showWidgetOnGroupBy: ['region', 'account', tagPrefix],
  type: CostOverviewWidgetType.reportSummary,
};
