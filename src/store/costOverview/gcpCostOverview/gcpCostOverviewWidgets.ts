import { tagPrefix } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { CostOverviewWidgetType } from 'store/costOverview/common/costOverviewCommon';

import { GcpCostOverviewWidget } from './gcpCostOverviewCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costWidget: GcpCostOverviewWidget = {
  id: getId(),
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.cost,
};

export const accountSummaryWidget: GcpCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'account',
    showWidgetOnGroupBy: ['region', 'service', tagPrefix],
  },
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const regionSummaryWidget: GcpCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'region',
    showWidgetOnGroupBy: ['account', 'service', tagPrefix],
  },
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};

export const serviceSummaryWidget: GcpCostOverviewWidget = {
  id: getId(),
  reportSummary: {
    reportGroupBy: 'service',
    showWidgetOnGroupBy: ['region', 'account', tagPrefix],
  },
  reportPathsType: ReportPathsType.gcp,
  reportType: ReportType.cost,
  type: CostOverviewWidgetType.reportSummary,
};
